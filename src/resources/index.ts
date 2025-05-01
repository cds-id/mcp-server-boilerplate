import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { infoResource } from './infoResource.js';
import { greetingResource } from './greetingResource.js';

/**
 * Register all resources with the MCP server
 * @param server The MCP server instance
 */
export function registerResources(server: McpServer): void {
  // Register the info resource
  infoResource(server);

  // Register the greeting resource
  greetingResource(server);

  // Add more resources here
}
