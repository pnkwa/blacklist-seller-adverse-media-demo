import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
import 'dotenv/config'

/** replace the %PUBLIC_URL% */
const cssPlugin = () => ({
  name: 'css-transform',
  transform(src, id) {
    if (!/\.(css)$/.test(id)) return src
    return src.replace(/%PUBLIC_URL%/g, process.env.PUBLIC_URL)
  },
})

// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr(), cssPlugin()],
  base: process.env.PUBLIC_URL ?? '/apps/bgc-dashboard',
  server: { port: Number(process.env.PORT) || 3000 },
  optimizeDeps: { esbuildOptions: { target: 'esnext' } },
  build: { target: 'esnext' },
})
