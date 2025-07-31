// start.mjs
import { register } from 'ts-node';
import { pathToFileURL } from 'url';

// Registra suporte para TS em ESM
register();

// Importa o app.ts via URL para garantir compatibilidade ESM
await import(pathToFileURL('./app.ts').href);
