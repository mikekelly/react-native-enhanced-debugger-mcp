import { z } from 'zod';

// Flattened schema to work around Cursor MCP limitation with nested object parameters
// See: https://forum.cursor.com/t/cursor-auto-selected-model-stringifies-mcp-tool-parameters/145807
export const readConsoleLogsFromAppSchema = z.object({
	webSocketDebuggerUrl: z
		.string()
		.describe('The websocket debugger URL for the application (from getConnectedApps response)'),
	maxLogs: z
		.number()
		.optional()
		.describe('Maximum number of logs to return (default: 100)'),
	regexp: z
		.string()
		.optional()
		.describe(
			'Optional regular expression pattern to filter logs. Only logs matching this pattern will be returned.',
		),
});

export type ReadConsoleLogsFromAppSchema = z.infer<
	typeof readConsoleLogsFromAppSchema
>;
