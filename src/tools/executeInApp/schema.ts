import { z } from 'zod';

export const executeInAppSchema = z.object({
	webSocketDebuggerUrl: z
		.string()
		.describe(
			'The websocket debugger URL for the application (from getConnectedApps response)',
		),
	expression: z
		.string()
		.describe(
			'JavaScript expression to evaluate in the app context. Can be any valid JS including function calls, object access, or IIFEs for complex logic.',
		),
	awaitPromise: z
		.boolean()
		.optional()
		.default(true)
		.describe(
			'Whether to await the result if the expression returns a Promise (default: true)',
		),
});

export type ExecuteInAppSchema = z.infer<typeof executeInAppSchema>;


