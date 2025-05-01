import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerResources } from './resources/index.js';
import { registerTools } from './tools/index.js';
import { registerPrompts } from './prompts/index.js';

// Create a new MCP server instance
const server = new McpServer({
  name: 'MCP-Boilerplate',
  version: '1.0.0',
});

// Register resources, tools, and prompts
registerResources(server);
registerTools(server);
registerPrompts(server);

// Start receiving messages on stdin and sending messages on stdout
const main = async () => {
  console.error('Starting MCP server in stdio mode...');

  const transport = new StdioServerTransport();

  // Handle close events
  transport.onclose = () => {
    console.error('Transport closed');
    process.exit(0);
  };

  // Connect to the transport
  await server.connect(transport);

  console.error('MCP server connected. Waiting for messages...');
};

main().catch(error => {
  console.error('Error starting MCP server:', error);
  process.exit(1);
});
