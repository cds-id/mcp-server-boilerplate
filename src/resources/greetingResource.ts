import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * A dynamic greeting resource that provides personalized greetings
 * @param server The MCP server instance
 */
export function greetingResource(server: McpServer): void {
  server.resource(
    'greeting',
    new ResourceTemplate('greeting://{name}', { list: undefined }),
    async (uri, { name }) => ({
      contents: [
        {
          uri: uri.href,
          text: `Hello, ${name}! Welcome to the MCP server.
        
This is a dynamic resource that can respond with personalized greetings.
The current time is ${new Date().toISOString()}.`,
        },
      ],
    })
  );
}
