# Omakase Website

React + Vite website for the Omakase card game.

## Commands

```sh
npm install
npm run dev
npm run build
```

The production build writes `dist/index.html` and copies it to `dist/404.html` for GitHub Pages deep-link fallback.

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

## Media

Original product assets remain in `Assets/`. Web-optimized derivatives used by the site live in `Assets/Web/`.

The tutorial video is embedded from:

```txt
https://www.youtube.com/watch?v=lOHlmx0hAdM
```

## Deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys to GitHub Pages from the `main` branch.

For a custom domain, configure it in the repository's GitHub Pages settings. If you want the domain committed in the repo, add a `public/CNAME` file containing only the domain name.
