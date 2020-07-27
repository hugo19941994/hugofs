# HugoFS website

| ![Frontend CI](https://github.com/hugo19941994/hugofs/workflows/Frontend%20CI/badge.svg) | ![Frontend Deployment](https://github.com/hugo19941994/hugofs/workflows/Frontend%20Deployment/badge.svg) |
| --- | --- |
| ![Backend CI](https://github.com/hugo19941994/hugofs/workflows/Backend%20CI/badge.svg) | ![Backend Deployment](https://github.com/hugo19941994/hugofs/workflows/Backend%20Deployment/badge.svg) |

## Run

```bash
cd frontend

npm install
npm run build:ssr && npm run serve:ssr
```

```bash
cd backend

npm install
npm run compile && npm run start
```

## Comments

To use comments configure an account in [Disqus](https://disqus.com/) and change the shortname in `./frontend/src/app/blog/disqus.component.ts`

## Google Maps

Substitute API key in `./frontend/src/index.html`

