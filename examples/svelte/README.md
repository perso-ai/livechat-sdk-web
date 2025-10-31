# Perso AI Live Chat SDK example(svelte)

## Development Environment
Visual Studio Code  
Node.js (This example was developed in Node.js v20.11.0)  

## Components
routes/+page.svelte - Main page  
hooks.server.ts - Server side configuration  
lib/\*.ts - Live Chat configuration  
lib/components/\*.svelte - Svelte components  
static/favicon.png, static/global.css - Components of routes/+page.svelte  
https://perso-ai.github.io/livechat-sdk-web/core/1.0.0/perso-ai-livechat-sdk.js - Perso AI Live Chat SDK (v1.0.0)  

## Developing
Installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server.
```bash
npm install
npm run dev
# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Enter the Live Chat API key in 'lib/constant.ts'.  

Enter the parameters required to create a session in 'hooks.server.ts'.  

## Building
To create a production version of this example:
```bash
npm run build
```

You can preview the production build with `npm run preview`.
```bash
npm run preview
```

## Perso AI Live Chat SDK
[[Perso AI Live Chat SDK v1.0.0 README](https://perso-ai.github.io/livechat-sdk-web/core/1.0.0/)]  