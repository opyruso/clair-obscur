# clair-obscur

This project is a simple static helper for Clair Obscur pictos. The source files
are located in `src/` and the production build is generated in `dist/`.
The site is now a small React single-page application using React Router. All
third-party assets (fonts, icons and scripts) are installed locally through NPM
so the app works offline without any CDN.

Available routes:

- `/index` - simple welcome page
- `/pictos` - pictos inventory
- `/weapons` - weapons inventory
- `/404` - not found page

## Development

Run the development server:

```bash
npm start
```

## Build

Create the distributable files under `dist/`:

```bash
npm run build
```
