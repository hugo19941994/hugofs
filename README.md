# HugoFS website

[![continuous-delivery](https://github.com/hugo19941994/hugofs/actions/workflows/cd.yml/badge.svg)](https://github.com/hugo19941994/hugofs/actions/workflows/cd.yml)
[![continuous-integration](https://github.com/hugo19941994/hugofs/actions/workflows/ci.yml/badge.svg)](https://github.com/hugo19941994/hugofs/actions/workflows/ci.yml)

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

