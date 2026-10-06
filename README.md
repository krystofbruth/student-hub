![StudentHub dark mode logo](https://raw.githubusercontent.com/krystofbruth/student-hub/refs/heads/main/public/logo-dark.svg)

## What?

StudentHub is an aggregation tool (a dashboard, if you will) for getting an overview of your upcoming assignments, events and other study-related information. While the tool was made primarily for students of Smíchov Secondary Technical School, it's still very modular and in-development. If your school utilizes systems such as Microsoft 365, Bakaláři or the system uses RSS (upcoming feature!), you're in luck - StudentHub probably supports it.

**Disclaimer: For actual integration, refer to your school IT department and get in touch with me, as there are specific approval processes needed for accessing sensitive information such as your assignments, timetable and the like.**

### Technologies

The project is built on the Nuxt meta-framework, utilizing TypeScript, Vue, MongoDB, JWT tokens (custom auth implemented!) and various other libraries. Refer to `package.json` for the full list of deps.

### User usage

A user registers and creates an account, then links the services they'd like.

## Why?

I've been frustrated with my school's various information systems, especially their apparent redundancy in many cases. However once upon a time, an important piece of information (such as assignment or exam date) lands on this system, and then bad luck that you're not checking every single system every single day.

That's exactly what StudentHub solves - instead of checking every single system individually, it compiles for you in a comprehensive dashboard every piece of information you might need.

## How (to use)?

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

### Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## Contributor documentation

For contributor onboarding, project structure, configuration details and contribution workflow, see [`/docs`](./docs/README.md).
