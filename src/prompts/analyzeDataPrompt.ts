import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * A prompt for analyzing data with specific instructions
 * @param server The MCP server instance
 */
export function analyzeDataPrompt(server: McpServer): void {
  const description = 'A prompt template for analyzing data with customizable instructions';

  server.prompt('analyze-data', description, () => {
    const prompt = `Please analyze the provided data and focus on key patterns, anomalies, and actionable insights.`;

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: prompt,
          },
        },
      ],
    };
  });
}
