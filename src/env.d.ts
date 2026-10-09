/// <reference types="vite/client" />

// Enable `import './index.css'` and other asset side-effect imports under
// TypeScript 7 (which no longer tolerates them by default). Keep Vite's
// `import.meta.env` typings from vite/client available at the same time.
declare module '*.css';
