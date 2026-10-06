# Getting Started

## Prerequisites

- Node.js 20+ (recommended for Nuxt 4)
- npm (project includes `package-lock.json`)
- MongoDB instance (local or remote)

## Install dependencies

```bash
npm install
```

## Environment variables

StudentHub reads configuration from runtime config and environment variables.

| Variable | Required | Purpose |
| --- | --- | --- |
| `SHUB_ACCESS_TOKEN_SECRET` | Required in production | JWT signing secret used by `AuthorizationService` |
| `SHUB_DB_URI` | Optional | Preferred MongoDB URI used by Nitro plugin |
| `DB_URI` | Optional | Fallback MongoDB URI from `nuxt.config.ts` and scripts |
| `SHUB_TEAMS_CLIENT_SECRET` | Required for Teams integration | OAuth secret for Microsoft Teams integration |
| `NODE_ENV` | Optional | Affects token secret fallback and synchronization interval |

Notes:
- Development fallback for JWT secret exists (`test123`) but should not be used in production.
- If Teams credentials are missing, Teams integration is disabled at runtime.

## Run locally

```bash
npm run dev
```

App runs by default on `http://localhost:3000`.

## Build and preview production output

```bash
npm run build
npm run preview
```
