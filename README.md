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
- `/outfits` - outfits inventory
- `/build` - team builder
- `/404` - not found page

## Development

Run the development server:

```bash
npm start
```

## Build

Create the distributable files under `dist/`. This command transpiles the JSX
sources with Babel, copies the required packages locally and rewrites `index.html`
so everything works from the `dist` folder alone:

```bash
npm run build
```

## Configuration

Runtime options are provided by a `config.js` file loaded by the page. Three
variants are available in `src/`:

- `config.dev.js`
- `config.rec.js`
- `config.pro.js`

The build script copies the appropriate file to the distribution directory based
on the `APP_ENV` environment variable (`dev` by default). After building you can
still edit `dist/config.js` to adjust the values:

- `clairobscur-api-url`
- `auth-url`
- `auth-client-id`

Example for a production build:

```bash
APP_ENV=pro npm run build
```
