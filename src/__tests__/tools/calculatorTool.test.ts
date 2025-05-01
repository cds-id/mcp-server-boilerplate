import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { calculatorTool } from '../../tools/calculatorTool.js';
import { jest, expect, describe, test, beforeEach } from '@jest/globals';

describe('Calculator Tool', () => {
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

    // Initialize the calculator tool with our mock server
    calculatorTool(mockServer);
  });

  test('should register with the correct name and schema', () => {
    // Verify tool was called
    expect(mockTool).toHaveBeenCalled();

    // Check the first argument (name)
    expect(mockTool.mock.calls[0][0]).toBe('calculate');

    // Check the schema has the expected properties
    const schema = mockTool.mock.calls[0][1];
    expect(schema).toHaveProperty('operation');
    expect(schema).toHaveProperty('a');
    expect(schema).toHaveProperty('b');
  });

  test('should correctly add two numbers', async () => {
    const result = await handler({ operation: 'add', a: 5, b: 3 });
    expect(result.content[0].text).toBe('Result of add(5, 3) = 8');
    expect(result.isError).toBeUndefined();
  });

  test('should correctly subtract two numbers', async () => {
    const result = await handler({ operation: 'subtract', a: 10, b: 4 });
    expect(result.content[0].text).toBe('Result of subtract(10, 4) = 6');
    expect(result.isError).toBeUndefined();
  });

  test('should correctly multiply two numbers', async () => {
    const result = await handler({ operation: 'multiply', a: 7, b: 6 });
    expect(result.content[0].text).toBe('Result of multiply(7, 6) = 42');
    expect(result.isError).toBeUndefined();
  });

  test('should correctly divide two numbers', async () => {
    const result = await handler({ operation: 'divide', a: 20, b: 5 });
    expect(result.content[0].text).toBe('Result of divide(20, 5) = 4');
    expect(result.isError).toBeUndefined();
  });

  test('should handle division by zero', async () => {
    const result = await handler({ operation: 'divide', a: 10, b: 0 });
    expect(result.content[0].text).toBe('Error: Division by zero is not allowed.');
    expect(result.isError).toBe(true);
  });
});
