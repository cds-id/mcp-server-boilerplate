import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { greetingPrompt } from './greetingPrompt.js';
import { analyzeDataPrompt } from './analyzeDataPrompt.js';

/**
 * Register all prompts with the MCP server
 * @param server The MCP server instance
 */
export function registerPrompts(server: McpServer): void {
  // Register greeting prompt
  greetingPrompt(server);

  // Register analyze data prompt
  analyzeDataPrompt(server);

  // Add more prompts here
}
