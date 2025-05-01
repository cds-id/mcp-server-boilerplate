import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * A simple greeting prompt that generates a personalized greeting message
 * @param server The MCP server instance
 */
export function greetingPrompt(server: McpServer): void {
  const description = 'A greeting prompt that generates a personalized greeting message';

  server.prompt('greeting', description, () => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: 'Please introduce yourself and explain what you can do.',
        },
      },
    ],
  }));
}
