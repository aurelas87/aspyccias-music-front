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
npm run build-only
```
