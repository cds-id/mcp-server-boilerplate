import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { randomUUID } from 'crypto';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { registerResources } from './resources/index.js';
import { registerTools } from './tools/index.js';
import { registerPrompts } from './prompts/index.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(express.json());
app.use(cors());

// Maps to store transports by session ID
const streamableTransports: Record<string, StreamableHTTPServerTransport> = {};
const sseTransports: Record<string, SSEServerTransport> = {};

// Create a new MCP server instance
const createServer = () => {
  const server = new McpServer({
    name: 'MCP-Boilerplate',
    version: '1.0.0',
  });

  // Register resources, tools, and prompts
  registerResources(server);
  registerTools(server);
  registerPrompts(server);

  return server;
};

// Handle POST requests for client-to-server communication (normal HTTP JSON-RPC)
app.post('/mcp', async (req, res) => {
  // Check for existing session ID
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && streamableTransports[sessionId]) {
    // Reuse existing transport
    transport = streamableTransports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // New initialization request
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: sessionId => {
        // Store the transport by session ID
        streamableTransports[sessionId] = transport;
      },
    });

    // Clean up transport when closed
    transport.onclose = () => {
      if (transport.sessionId) {
        delete streamableTransports[transport.sessionId];
      }
    };

    // Create and connect to a new MCP server
    const server = createServer();
    await server.connect(transport);
  } else {
    // Invalid request
    res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Bad Request: No valid session ID provided',
      },
      id: null,
    });
    return;
  }

  // Handle the request
  await transport.handleRequest(req, res, req.body);
});

// Handle GET requests for StreamableHTTP transport
app.get('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;

  if (!sessionId || !streamableTransports[sessionId]) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }

  const transport = streamableTransports[sessionId];
  await transport.handleRequest(req, res);
});

// Handle DELETE requests for session termination (StreamableHTTP)
app.delete('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;

  if (!sessionId) {
    res.status(400).send('Missing session ID');
    return;
  }

  if (streamableTransports[sessionId]) {
    const transport = streamableTransports[sessionId];
    await transport.handleRequest(req, res);
    delete streamableTransports[sessionId];
    return;
  }

  res.status(404).send('Session not found');
});

// SSE endpoint to establish a connection
app.get('/sse/connect', async (req, res) => {
  try {
    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Create SSE transport
    const transport = new SSEServerTransport('/sse/messages', res);
    const sessionId = transport.sessionId;

    // Store the transport
    sseTransports[sessionId] = transport;

    // Handle connection close
    res.on('close', () => {
      delete sseTransports[sessionId];
      console.log(`SSE connection closed for session ${sessionId}`);
    });

    // Create and connect to a new MCP server
    const server = createServer();
    await server.connect(transport);

    // Send initialization message to client
    transport.send({
      jsonrpc: '2.0',
      method: 'sse/connection',
      params: {
        sessionId,
        message: 'Connection established',
      },
    });
  } catch (error) {
    console.error('Error setting up SSE connection:', error);
    if (!res.headersSent) {
      res.status(500).send('Error establishing SSE connection');
    }
  }
});

// Handle POST requests for SSE message sending
app.post('/sse/messages', async (req, res) => {
  const sessionId = req.query.sessionId as string;

  if (!sessionId || !sseTransports[sessionId]) {
    res.status(400).json({
      error: 'Invalid or missing session ID',
    });
    return;
  }

  const transport = sseTransports[sessionId];
  await transport.handlePostMessage(req, res, req.body);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    activeSessions: {
      streamable: Object.keys(streamableTransports).length,
      sse: Object.keys(sseTransports).length,
    },
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`StreamableHTTP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`SSE connect endpoint: http://localhost:${PORT}/sse/connect`);
});

export default app;
