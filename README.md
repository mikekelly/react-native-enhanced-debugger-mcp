# React Native Enhanced Debugger MCP

An MCP server that lets AI assistants read console logs from your React Native app in real-time.

## Features

- **Read console logs** from any connected React Native app via Metro
- **Filter logs with regex** to find exactly what you're looking for
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

### `readConsoleLogsFromApp`

Read console logs from a connected app.

| Parameter | Type | Description |
|-----------|------|-------------|
| `app` | object | App object from `getConnectedApps` |
| `maxLogs` | number | Max logs to return (default: 100) |
| `regexp` | string | Regex pattern to filter logs |

## Example

```
1. Call getConnectedApps to find your app
2. Call readConsoleLogsFromApp with the app object
3. Use regexp to filter: "error|warning" or "MyComponent"
```

## License

MIT
