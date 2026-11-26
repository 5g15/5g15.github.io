# Isaac Chong (`5g15.github.io`)

Personal brand, research writing, and achievement website for **Isaac Chong (`@5g15isaac`)**, built with React, TypeScript, Vite, Tailwind CSS v4, and Framer Motion.

## Local Development

```bash
npm install
npm run dev
```

## Production Build & Typecheck

```bash
npm run typecheck
npm run build
npm run preview
```

## Updating Content

All profile metadata, research essays, project case studies, and academic accolades live in a single strongly typed module:

- `src/data/portfolioData.ts`
- `src/types/portfolio.ts`

## GitHub Pages Deployment (`5g15.github.io`)

1. Push this repository to `https://github.com/5g15/5g15.github.io` on the `main` branch.
2. In **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
3. The included workflow at `.github/workflows/deploy.yml` installs dependencies, runs `npm run build` (`base: '/'`), and publishes `dist/` automatically on every push to `main`.
