import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { calculatorTool } from './calculatorTool.js';
import { timestampTool } from './timestampTool.js';

/**
 * Register all tools with the MCP server
 * @param server The MCP server instance
 */
export function registerTools(server: McpServer): void {
  // Register calculator tool
  calculatorTool(server);

  // Register timestamp tool
  timestampTool(server);

  // Add more tools here
}
