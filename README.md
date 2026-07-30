# PC Builder Frontend

React + Vite client for browsing parts, viewing specs, signing in, and managing saved PC builds.

## Setup

1. `cd pc-builder-frontend`
2. `npm install`
3. `npm run dev`

## Deployment

Set `VITE_API_URL` to your Railway backend API, for example:

`https://your-railway-backend.up.railway.app/api`

For Netlify:

1. Set the publish directory to `dist`
2. Use `npm run build` as the build command
3. Add the `VITE_API_URL` environment variable in site settings

For Vercel:

1. Point the project root at `pc-builder-frontend`
2. Use `npm run build` as the build command
3. Set `VITE_API_URL` in the project environment variables

## Features

- Browse hardware by category
- View component specs
- Register and log in
- Create, rename, and delete saved builds
- Add and remove components from a build
