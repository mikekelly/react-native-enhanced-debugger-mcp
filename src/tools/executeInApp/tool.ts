import WebSocket from 'ws';
import type { ToolRegistration } from '@/types';
import { makeJsonSchema } from '@/utils/makeJsonSchema';
import { type ExecuteInAppSchema, executeInAppSchema } from './schema';

interface RemoteObject {
	type:
		| 'object'
		| 'function'
		| 'undefined'
		| 'string'
		| 'number'
		| 'boolean'
		| 'symbol'
		| 'bigint';
	subtype?:
		| 'array'
		| 'null'
		| 'node'
		| 'regexp'
		| 'date'
		| 'map'
		| 'set'
		| 'weakmap'
		| 'weakset'
		| 'iterator'
		| 'generator'
		| 'error'
		| 'proxy'
		| 'promise'
		| 'typedarray'
		| 'arraybuffer'
		| 'dataview';
	className?: string;
	value?: unknown;
	unserializableValue?: string;
	description?: string;
	objectId?: string;
}

interface ExceptionDetails {
	exceptionId: number;
	text: string;
	lineNumber: number;
	columnNumber: number;
	exception?: RemoteObject;
}

interface EvaluateResponse {
	id: number;
	result?: {
		result: RemoteObject;
		exceptionDetails?: ExceptionDetails;
	};
	error?: {
		code: number;
		message: string;
	};
}

/**
 * Formats a RemoteObject result into a readable string
 */
function formatResult(result: RemoteObject): string {
	if (result.type === 'undefined') {
		return 'undefined';
	}

	if (result.subtype === 'null') {
		return 'null';
	}

	// For objects/arrays with a value, stringify it
	if (result.value !== undefined) {
		if (typeof result.value === 'object') {
			return JSON.stringify(result.value, null, 2);
		}
		return String(result.value);
	}

	// Use description for complex objects
	if (result.description) {
		return result.description;
	}

	// Handle unserializable values (NaN, Infinity, etc.)
	if (result.unserializableValue) {
		return result.unserializableValue;
	}

	return `[${result.type}${result.subtype ? ` ${result.subtype}` : ''}]`;
}

/**
 * Executes a JavaScript expression in the connected React Native app
 */
export const executeInApp = async (
	webSocketDebuggerUrl: string,
	expression: string,
	awaitPromise = true,
): Promise<{ success: boolean; result?: string; error?: string }> => {
	return new Promise((resolve) => {
		const ws = new WebSocket(webSocketDebuggerUrl);
		let messageId = 1;
		const TIMEOUT_MS = 10000;

		const timeout = setTimeout(() => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.close();
			}
			resolve({
				success: false,
				error: 'Timeout: Expression took too long to evaluate',
			});
		}, TIMEOUT_MS);

		ws.on('open', () => {
			// Enable runtime first
			ws.send(
				JSON.stringify({
					id: messageId++,
					method: 'Runtime.enable',
				}),
			);
		});

		ws.on('message', (data: Buffer) => {
			const message = JSON.parse(data.toString()) as EvaluateResponse;

			// After Runtime.enable succeeds, send the evaluate request
			if (message.id === 1) {
				ws.send(
					JSON.stringify({
						id: messageId++,
						method: 'Runtime.evaluate',
						params: {
							expression,
							returnByValue: true,
							awaitPromise,
							userGesture: true,
							generatePreview: true,
						},
					}),
				);
			}

			// Handle the evaluate response
			if (message.id === 2) {
				clearTimeout(timeout);

				if (message.error) {
					ws.close();
					resolve({
						success: false,
						error: message.error.message,
					});
					return;
				}

				if (message.result?.exceptionDetails) {
					const exception = message.result.exceptionDetails;
					const errorMessage =
						exception.exception?.description || exception.text;
					ws.close();
					resolve({
						success: false,
						error: errorMessage,
					});
					return;
				}

				if (message.result?.result) {
					ws.close();
					resolve({
						success: true,
						result: formatResult(message.result.result),
					});
					return;
				}

				ws.close();
				resolve({
					success: true,
					result: 'undefined',
				});
			}
		});

		ws.on('error', (error) => {
			clearTimeout(timeout);
			resolve({
				success: false,
				error: `WebSocket error: ${error.message}`,
			});
		});

		ws.on('close', () => {
			clearTimeout(timeout);
		});
	});
};

export const executeInAppTool: ToolRegistration<ExecuteInAppSchema> = {
	name: 'executeInApp',
	description:
		'Execute JavaScript code in a connected React Native app and return the result. Use this for REPL-style interactions, inspecting app state, or running diagnostic code.',
	inputSchema: makeJsonSchema(executeInAppSchema),
	handler: async ({
		webSocketDebuggerUrl,
		expression,
		awaitPromise,
	}: ExecuteInAppSchema) => {
		try {
			const parsedArgs = executeInAppSchema.parse({
				webSocketDebuggerUrl,
				expression,
				awaitPromise,
			});

			const result = await executeInApp(
				parsedArgs.webSocketDebuggerUrl,
				parsedArgs.expression,
				parsedArgs.awaitPromise,
			);

			if (!result.success) {
				return {
					content: [
						{
							type: 'text',
							text: `❌ Error: ${result.error}`,
						},
					],
					isError: true,
				};
			}

			return {
				content: [
					{
						type: 'text',
						text: result.result ?? 'undefined',
					},
				],
			};
		} catch (error) {
			return {
				content: [
					{
						type: 'text',
						text: `Error: ${(error as Error).message}`,
					},
				],
				isError: true,
			};
		}
	},
};


