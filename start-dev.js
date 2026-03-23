#!/usr/bin/env node
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function start() {
  try {
    console.log('[Vite] Starting development server...');
    const server = await createServer({
      root: __dirname,
      server: {
        middlewareMode: false,
        port: 5173,
        host: 'localhost'
      }
    });

    await server.listen();
    console.log('\n✓ Portfolio app running at: http://localhost:5173\n');
    console.log('Ready for development - make changes and browser will reload!\n');
  } catch (err) {
    console.error('Error starting server:', err.message);
    process.exit(1);
  }
}

start();
