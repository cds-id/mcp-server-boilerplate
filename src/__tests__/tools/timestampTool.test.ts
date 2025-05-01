import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { timestampTool } from '../../tools/timestampTool.js';
import { jest, expect, describe, test, beforeEach } from '@jest/globals';

describe('Timestamp Tool', () => {
  // Using a simpler approach with type assertion
  const mockTool = jest.fn();

  // Mock server
  const mockServer = {
    tool: mockTool,
  } as unknown as McpServer;

  let handler: any;

  beforeEach(() => {
    // Clear mocks before each test
    mockTool.mockReset();

    // Store the handler function when tool is called
    mockTool.mockImplementation((_name, _schema, handlerFn) => {
      handler = handlerFn;
    });

    // Initialize the timestamp tool with our mock server
    timestampTool(mockServer);
  });

  test('should register with the correct name and schema', () => {
    // Verify tool was called
    expect(mockTool).toHaveBeenCalled();

    // Check the first argument (name)
    expect(mockTool.mock.calls[0][0]).toBe('timestamp');

    // Check the schema has the expected properties
    const schema = mockTool.mock.calls[0][1];
    expect(schema).toHaveProperty('format');
  });

  test('should return ISO format by default', async () => {
    const result = await handler({});
    expect(result.content[0].text).toMatch(
      /Current timestamp \(undefined\): \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/
    );
  });

  test('should return timestamps in ISO format', async () => {
    const result = await handler({ format: 'iso' });
    expect(result.content[0].text).toMatch(
      /Current timestamp \(iso\): \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/
    );
  });

  test('should return timestamps in UNIX format', async () => {
    const result = await handler({ format: 'unix' });
    expect(result.content[0].text).toMatch(/Current timestamp \(unix\): \d+/);

    // Extract the timestamp and ensure it's a valid number close to the current time
    const unixTimestamp = parseInt(result.content[0].text.split(': ')[1]);
    const currentUnixTime = Math.floor(Date.now() / 1000);
    expect(unixTimestamp).toBeGreaterThan(currentUnixTime - 10);
    expect(unixTimestamp).toBeLessThan(currentUnixTime + 10);
  });

  test('should return timestamps in readable format', async () => {
    const result = await handler({ format: 'readable' });
    expect(result.content[0].text).toMatch(/Current timestamp \(readable\): .+/);
    expect(result.content[0].text.split(': ')[1].length).toBeGreaterThan(5);
  });
});
