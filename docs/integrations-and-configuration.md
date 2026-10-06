# Integrations and Configuration

## Implemented integrations

- Bakaláři (`server/integrations/BakalariIntegration.ts`)
- SSPS Cajthaml (`server/integrations/CajthamlIntegration.ts`)
- Microsoft Teams (`server/integrations/TeamsIntegration.ts`)

Integration registration and available providers are exposed through:
- `GET /api/provider`
- `GET /api/origin`
- `GET /api/source`
- `POST /api/source`
- `DELETE /api/source/[source_id]`

## Authentication and sessions

Core auth/session endpoints:
- `POST /api/session`
- `PATCH /api/session/refresh`
- `POST /api/user`
- `POST /api/user/verify`
- `GET /api/user/me`
- `PATCH /api/user/me`
- `PUT /api/user/me/password`

Important behavior:
- Access tokens are short-lived (15 minutes).
- Refresh tokens are persisted in MongoDB sessions.
- Production requires `SHUB_ACCESS_TOKEN_SECRET`.

## Synchronization behavior

`DataAggregationService` synchronizes user events from each linked source.

- Production interval: every 5 minutes
- Non-production interval: effectively unrestricted for local iteration
- Event reconciliation includes upsert-like updates and stale event cleanup

## Runtime configuration highlights

From `nuxt.config.ts`:
- SSR is disabled (`ssr: false`)
- Default locale is Czech (`cs`)
- Browser language auto-detection cookie is disabled
- Nitro OpenAPI metadata exists but `experimental.openAPI` is disabled
