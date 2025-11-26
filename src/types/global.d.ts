/**
 * Tipos globales para la librería
 */

declare module '*.css' {
  const content: string;
  export default content;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_FE_URL?: "https://facturacionelectronicatt.tecnotics.co";
  readonly VITE_COMPANY_ID?: string;
  readonly VITE_SIMBA_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

