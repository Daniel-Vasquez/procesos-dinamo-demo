/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly CLICKUP_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
