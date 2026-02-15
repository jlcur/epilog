
A robust Express.js boilerplate built with TypeScript featuring vertical slice architecture, structured logging, error handling, request validation, and manual dependency injection. Following patterns and best practices for building scalable APIs. 
## Features

- **Vertical slice architecture** - feature-based folders with co-located files.
- **Typescript** - strong typing across all layers.
- **Database integration** - uses in-memory array for example purposes, replaceable with database of choice.
- **Dependency injection** - manual DI using factory pattern for easy testing and swapping of infrastructure (e.g., in-memory database to PostgreSQL).
- **Security**
	- Helmet for security headers.
	- Request validation with Zod.
- **Logging**
	- Structured logging with Pino.
- **Testing**
	- Node test runner for unit and integration tests.

## Getting started

### 1. Prerequisites

- Node.js (v20.x or higher)
- npm or pnpm

### 2. Installation

```bash
git clone https://github.com/jlcur/express-boilerplate.git
cd express-boilerplate
npm install
```

### 3. Environment setup

Copy the example environment file and fill in your details:

```bash
cp .env.example .env
```

### 4. Running the app


```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## Testing and linting

```bash
# Run all tests
npm test

# Lint & format check with Biome
npm run lint
```

## Project structure


```
├── src/
│   ├── api/
│   │   └── comment/
│   │       ├── comment-handler.ts
│   │       ├── comment-repository.ts
│   │       ├── comment-routes.ts
│   │       ├── comment-schema.ts
│   │       ├── comment-service.ts
│   │       ├── comment-service.test.ts
│   │       └── index.ts
│   ├── app/
│   │   └── config/
│   │   ├── app.ts
│   │   └── routes.ts
│   ├── middleware/
│   ├── shared/
│   │   └── errors/
│   │   └── logging/
│   └── server.ts
├── tests/
│   └── integration/
```
