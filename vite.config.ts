import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
import 'dotenv/config'

// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  optimizeDeps: { esbuildOptions: { target: 'esnext' } },
  build: { target: 'esnext' },
  server: {
    port: 3000,
  },
})
