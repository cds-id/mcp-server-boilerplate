import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * A tool that provides the current timestamp in various formats
 * @param server The MCP server instance
 */
export function timestampTool(server: McpServer): void {
  server.tool(
    'timestamp',
    {
      format: z.enum(['iso', 'unix', 'readable']).optional().default('iso'),
    },
    async ({ format }) => {
      const now = new Date();
      let formattedTime: string;

      switch (format) {
        case 'unix':
          formattedTime = Math.floor(now.getTime() / 1000).toString();
          break;
        case 'readable':
          formattedTime = now.toLocaleString();
          break;
        case 'iso':
        default:
          formattedTime = now.toISOString();
          break;
      }

      return {
        content: [
          {
            type: 'text',
            text: `Current timestamp (${format}): ${formattedTime}`,
          },
        ],
      };
    }
  );
}
