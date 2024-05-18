import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig((test) => {

  let options = {
    rollupOptions: {
      output: {
        manualChunks: {
          // Define the chunks for splitting
          react: ['react', 'react-dom'],
          utility: ['lodash', 'moment'],
        },
      },
    },
  }

  // warning:
  // --mode flag is used to determine the environment mode during the build process. However, there is an issue with using custom modes other than the default modes ("development" and "production") with Vite.


  let finalEnv = process.env.NODE_ENV

  console.log("[process.env.NODE_ENV]", finalEnv)

  // build into different folders depending on the `mode`.
  const outDir = (finalEnv === "staging") ? "./dist/staging/" : "./dist/production/";

  if (finalEnv != "development") {
    console.log('[build dir]', outDir)

    options = {
      ...options,
      build: { outDir },
      server: { https: true },
      plugins: [react(), mkcert()],

    }
  }

  let alias = {
    resolve: {
      alias: {
        '@app': '/src', // also in ts-config
      },
    }
  }

  return {
    plugins: [react()],
    ...alias,
    mode: process.env.NODE_ENV,
    ...options,

  }
})