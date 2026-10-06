# Project Structure

## Top-level layout

- `app/`: client UI, pages, components, layouts, stores, composables
- `server/`: backend API routes, services, integrations, models, utilities
- `shared/`: shared TypeScript contracts used by both app and server
- `i18n/`: locale files (`cs.json`, `en.json`)
- `public/`: static assets (logos, integration metadata images)

## Frontend structure (`app/`)

- `pages/`: route-driven views (`dashboard`, `integrations`, `settings`, auth pages)
- `components/`: reusable UI blocks (cards, settings, integration setup, modals)
- `stores/`: Pinia stores for events, providers, profile, origins, sources
- `composables/`: reusable frontend logic
- `middleware/auth.ts`: route protection for authenticated pages

## Backend structure (`server/`)

- `api/`: HTTP endpoints
- `services/`: business logic (auth, user management, source/event handling)
- `integrations/`: external platform adapters (Bakaláři, Teams, SSPS Cajthaml)
- `models/`: Mongoose models and integration payload models
- `plugins/MongoDatabase.ts`: MongoDB connection bootstrap
- `utilities/`: validation, authorization helper, error handling
- `openapi/`: reusable API response definitions

## Shared contracts (`shared/`)

`shared/types` defines request and response schemas used between frontend and backend, reducing API contract drift.
