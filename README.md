# MCP Server Boilerplate

[![MCP TypeScript SDK NPM Version](https://img.shields.io/npm/v/@modelcontextprotocol/sdk)](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A boilerplate server implementation for the Model Context Protocol (MCP), built with TypeScript and Express.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
  - [HTTP Server](#http-server)
  - [Stdio Mode](#stdio-mode)
- [Resources](#resources)
- [Tools](#tools)
- [Prompts](#prompts)
- [Extending the Server](#extending-the-server)
  - [Adding Resources](#adding-resources)
  - [Adding Tools](#adding-tools)
  - [Adding Prompts](#adding-prompts)
- [Testing and Debugging](#testing-and-debugging)
- [License](#license)

## Overview

This project implements a server that follows the Model Context Protocol (MCP), which allows applications to provide context for LLMs in a standardized way. It includes:

- A fully configured MCP server with HTTP and stdio transport options
- Sample resources, tools, and prompts to demonstrate key functionality
- TypeScript support for type safety and better developer experience
- Express integration for the HTTP transport layer

## Project Structure

```
mcp-server-boilerplate/
├── .env                  # Environment variables
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore file
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── src/
│   ├── index.ts          # Main HTTP server entry point
│   ├── stdio.ts          # Stdio server entry point
│   ├── resources/        # MCP resources
│   │   ├── index.ts      # Resource registration
│   │   ├── infoResource.ts # Static info resource
│   │   └── greetingResource.ts # Dynamic greeting resource
│   ├── tools/            # MCP tools
│   │   ├── index.ts      # Tool registration
│   │   ├── calculatorTool.ts # Sample calculator tool
│   │   └── timestampTool.ts # Sample timestamp tool
│   └── prompts/          # MCP prompts
│       ├── index.ts      # Prompt registration
│       ├── greetingPrompt.ts # Sample greeting prompt
│       └── analyzeDataPrompt.ts # Sample data analysis prompt
└── dist/                 # Compiled JavaScript output
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/mcp-server-boilerplate.git
cd mcp-server-boilerplate
npm install
```

### Environment Variables

Copy the example environment file and modify as needed:

```bash
cp .env.example .env
```

Available environment variables:

- `PORT`: The port for the HTTP server (default: 3000)
- `NODE_ENV`: Environment mode (development, production)
- OAuth settings (if needed)

## Running the Server

### HTTP Server

Build and start the HTTP server:

```bash
npm run build
npm start
```

For development with auto-restart:

```bash
npm run dev
```

The server will be available at `http://localhost:3000/mcp` (or the port specified in your .env file).

### Stdio Mode

To run the server in stdio mode (for command-line tools):

```bash
npm run start:stdio
```

For development with auto-restart:

```bash
npm run dev:stdio
```

## Resources

The boilerplate includes these example resources:

1. **Static Info Resource**: `info://server`

   - Provides basic information about the server

2. **Dynamic Greeting Resource**: `greeting://{name}`
   - Generates a personalized greeting with the provided name parameter

To access resources:

- Through the MCP protocol
- Using an MCP client library

## Tools

The boilerplate includes these example tools:

1. **Calculator**: Performs basic arithmetic operations

   - Parameters:
     - `operation`: Operation to perform (add, subtract, multiply, divide)
     - `a`: First number
     - `b`: Second number

2. **Timestamp**: Provides the current time in various formats
   - Parameters:
     - `format`: Output format (iso, unix, readable)

## Prompts

The boilerplate includes these example prompts:

1. **Greeting**: Creates a personalized greeting prompt

   - Parameters:
     - `name`: Name to greet
     - `formal`: Whether to use formal greeting style (optional)

2. **Analyze Data**: Creates a prompt for data analysis
   - Parameters:
     - `data`: The data to analyze
     - `format`: Data format (json, csv, text)
     - `instructions`: Additional analysis instructions (optional)

## Extending the Server

### Adding Resources

To add a new resource:

1. Create a new file in `src/resources/` (e.g., `myResource.ts`)
2. Implement your resource handler
3. Register it in `src/resources/index.ts`

Example:

```typescript
// myResource.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function myResource(server: McpServer): void {
  server.resource('my-resource', 'my-resource://path', async uri => ({
    contents: [
      {
        uri: uri.href,
        text: 'My resource content',
      },
    ],
  }));
}

// Then add to resources/index.ts
import { myResource } from './myResource.js';

export function registerResources(server: McpServer): void {
  // ...existing resources
  myResource(server);
}
```

### Adding Tools

To add a new tool:

1. Create a new file in `src/tools/` (e.g., `myTool.ts`)
2. Implement your tool handler
3. Register it in `src/tools/index.ts`

Example:

```typescript
// myTool.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function myTool(server: McpServer): void {
  server.tool('my-tool', { param: z.string() }, async ({ param }) => ({
    content: [
      {
        type: 'text',
        text: `Processed: ${param}`,
      },
    ],
  }));
}

// Then add to tools/index.ts
import { myTool } from './myTool.js';

export function registerTools(server: McpServer): void {
  // ...existing tools
  myTool(server);
}
```

### Adding Prompts

To add a new prompt:

1. Create a new file in `src/prompts/` (e.g., `myPrompt.ts`)
2. Implement your prompt handler
3. Register it in `src/prompts/index.ts`

Example:

```typescript
// myPrompt.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function myPrompt(server: McpServer): void {
  server.prompt('my-prompt', { topic: z.string() }, ({ topic }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Please explain ${topic} in simple terms.`,
        },
      },
    ],
  }));
}

// Then add to prompts/index.ts
import { myPrompt } from './myPrompt.js';

export function registerPrompts(server: McpServer): void {
  // ...existing prompts
  myPrompt(server);
}
```

## Testing and Debugging

To test your MCP server, you can use:

- The MCP Inspector tool
- MCP client libraries
- Direct HTTP requests (for debugging)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
