import { z } from 'zod';
import type { GetConnectedAppsSchema } from '../getConnectedApps/schema';

export const readConsoleLogsFromAppSchema = z.object({
	app: z
		.object({
			id: z.string().describe('The Metro application ID'),
			description: z.string().describe(`The Metro application's bundle ID`),
			webSocketDebuggerUrl: z
				.string()
				.describe('The websocket debugger URL for the application'),
		})
		.describe('The app object as returned by getConnectedApps'),
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
