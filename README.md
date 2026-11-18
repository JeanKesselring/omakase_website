# Omakase Website

React website for the Omakase card game, bundled with esbuild.

## Commands

```sh
npm ci --ignore-scripts
npm run dev
npm run build
npm run preview
```

The development server uses `http://127.0.0.1:5173` and reloads on changes to bundled source. The production build writes `dist/index.html` and `dist/404.html` for GitHub Pages deep links. Preview serves the built files at `http://127.0.0.1:4173`.

For deployment under a subpath, set `VITE_BASE_PATH` to an absolute URL path such as `/omakase/` when building and previewing.

## Stores

Stores are maintained in `src/data/shops.json`. Add entries with this shape:

```json
{
  "id": "shop-id",
  "name": "Shop name",
  "country": "Switzerland",
  "city": "Zurich",
  "address": "Street 1",
  "lat": 47.3769,
  "lng": 8.5417,
  "websiteUrl": "https://example.com",
  "productUrl": "https://example.com/omakase",
  "sellsOnline": true,
  "logoId": "shop-logo-id",
  "notes": "Optional short note"
}
```

Entries with `lat` and `lng` appear as markers on the map. Entries with `productUrl` show a buy-online button.
Retailer logos are imported from `Assets/Web/retailers/`; set `logoId` to the matching imported key in `src/App.jsx`.

The map uses [OpenStreetMap standard tiles](https://operations.osmfoundation.org/policies/tiles/) by default. To use the original CARTO style, request a [CARTO Basemaps key](https://carto.com/basemaps/apikey/) and set `VITE_CARTO_BASEMAP_KEY` in your local environment or as a GitHub Actions repository variable before building. The key is visible in browser tile requests. Use a dedicated basemap key and restrict it to the site origins in the CARTO dashboard.

## Media

Original product assets remain in `Assets/`. Web-optimized derivatives used by the site live in `Assets/Web/`.

The tutorial video is embedded from:

```txt
https://www.youtube.com/watch?v=lOHlmx0hAdM
```

## Deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys to GitHub Pages from the `main` branch.

For a custom domain, configure it in the repository's GitHub Pages settings. If you want the domain committed in the repo, add a `public/CNAME` file containing only the domain name.
