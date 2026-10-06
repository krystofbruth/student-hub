# Testing and Quality

## Test framework

The project uses Vitest with two projects configured in `vitest.config.ts`:

- `unit`: Node environment, tests in `test/unit/*.{test,spec}.ts`
- `nuxt`: Nuxt environment, tests in `test/nuxt/*.{test,spec}.ts`

## Test commands

```bash
npm test
npm run test:unit
npm run test:nuxt
npm run test:watch
```

## Build checks

```bash
npm run build
```

This runs `nuxt typecheck` and then a production build.

## Linting

Nuxt ESLint integration is configured in `eslint.config.mjs`.
If you want to run lint manually, use:

```bash
npx eslint .
```
