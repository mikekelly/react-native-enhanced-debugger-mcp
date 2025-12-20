# React Native Enhanced Debugger MCP

An MCP server that lets AI assistants read console logs from your React Native app in real-time.

## Features

- **Read console logs** from any connected React Native app via Metro
- **Filter logs with regex** to find exactly what you're looking for
- **REPL access** — execute JavaScript directly in your running app
- **Plain text output** keeps AI context usage minimal
- **Smart error handling** with stack traces only for errors and warnings
- **Full fidelity** — captures multi-line strings, objects, arrays, and complex data structures

## Quick Start

Add to your Claude Desktop or Cursor MCP config:

```json
{
  "mcpServers": {
    "react-native-enhanced-debugger-mcp": {
      "command": "npx",
      "args": ["-y", "@realmikekelly/react-native-enhanced-debugger-mcp"]
    }
  }
}
```

## Tools

### `getConnectedApps`

Get a list of React Native apps connected to Metro.

| Parameter | Type | Description |
|-----------|------|-------------|
| `metroServerPort` | number | Metro server port (default: 8081) |

### `getAppLogs`

Read console logs from a connected app.

| Parameter | Type | Description |
|-----------|------|-------------|
| `webSocketDebuggerUrl` | string | WebSocket URL from `getConnectedApps` |
| `maxLogs` | number | Max logs to return (default: 100) |
| `regexp` | string | Regex pattern to filter logs |

### `executeInApp`

Execute JavaScript code in a connected app and return the result. Use for REPL-style interactions, inspecting app state, or running diagnostic code.

| Parameter | Type | Description |
|-----------|------|-------------|
| `webSocketDebuggerUrl` | string | WebSocket URL from `getConnectedApps` |
| `expression` | string | JavaScript expression to evaluate |
| `awaitPromise` | boolean | Await if expression returns a Promise (default: true) |

## Example

```
1. Call getConnectedApps to find your app
2. Call getAppLogs with the webSocketDebuggerUrl
3. Use regexp to filter: "error|warning" or "MyComponent"
4. Call executeInApp to run code: "globalThis.myVariable" or "Date.now()"
```

## License

MIT
