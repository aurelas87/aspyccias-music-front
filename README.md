# aspyccias-music-front

FrontEnd part of aspyccias-music.com website

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Maintenance Mode

A maintenance mode is available to display a temporary page while modifying the website.<br>
The mode can be activated via the `mode` option in `vite.config.ts` by adding the line as follows:

```ts
mode: 'maintenance'
```

This mode will by applied for all the following commands: 

```sh
npm run dev
npm run build
npm run preview
npm run test:e2e
npm run test:e2e:dev
npm run build-only
```

<div style="background-color: #082f49;">

> The maintenance mode is currently activated during all the development process

</div>
