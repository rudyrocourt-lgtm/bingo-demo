# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bingo-demo is an early-stage project integrating with Linear (issue tracking) via MCP. It uses varlock for secure environment variable management.

## Environment Variables

Environment variables are managed with [varlock](https://varlock.dev) using the `@env-spec` schema format.

- **Schema**: `.env.schema` defines required variables with types and sensitivity annotations
- **Never read `.env` directly** — use `varlock load` to validate with masked output
- **Never echo secrets** — use `varlock load | grep VAR_NAME` to check specific variables
- Validate environment: `export PATH="$HOME/.varlock/bin:$PATH" && varlock load`

### Required Variables

| Variable | Sensitive | Description |
|----------|-----------|-------------|
| `LINEAR_API_KEY` | Yes | Linear API key (prefix: `lin_api_`) |

## Integrations

- **Linear MCP**: HTTP MCP server at `https://mcp.linear.app/mcp`, configured in `~/.claude/plugins/.../linear/.mcp.json`, authenticated via `LINEAR_API_KEY`
- **Varlock skill**: Installed at `~/.claude/skills/varlock/` — enforces secure secret handling patterns
