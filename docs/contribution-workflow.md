# Contribution Workflow

## Before you start

1. Read `docs/getting-started.md`.
2. Confirm your feature or fix scope.
3. Check affected app/server/shared contracts to avoid API drift.

## While implementing

1. Keep changes focused and minimal.
2. Reuse existing patterns:
   - Shared API types in `shared/types`
   - Service-layer logic in `server/services`
   - Store-driven state updates in `app/stores`
3. Update docs when behavior or contributor workflow changes.

## Validation checklist

Before opening or updating a PR:

1. Run tests relevant to your changes.
2. Run `npm run build` to catch type/build regressions.
3. Verify auth- and integration-related changes with required env vars configured.
4. Ensure no secrets are committed.

## Pull request guidance

- Explain *what* changed and *why*.
- List any manual verification steps for reviewers.
- Highlight new environment variables or integration side effects.
- Keep PRs scoped so they are reviewable end-to-end.
