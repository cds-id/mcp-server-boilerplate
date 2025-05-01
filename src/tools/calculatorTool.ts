import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * A simple calculator tool that performs basic arithmetic operations
 * @param server The MCP server instance
 */
export function calculatorTool(server: McpServer): void {
  server.tool(
    'calculate',
    {
      operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
      a: z.number(),
      b: z.number(),
    },
    async ({ operation, a, b }) => {
      let result: number | undefined;

      switch (operation) {
        case 'add':
          result = a + b;
          break;
        case 'subtract':
          result = a - b;
          break;
        case 'multiply':
          result = a * b;
          break;
        case 'divide':
          if (b === 0) {
            return {
              content: [{ type: 'text', text: 'Error: Division by zero is not allowed.' }],
              isError: true,
            };
          }
          result = a / b;
          break;
      }

      return {
        content: [
          {
            type: 'text',
            text: `Result of ${operation}(${a}, ${b}) = ${result}`,
          },
        ],
      };
    }
  );
}
