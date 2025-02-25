import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        exclude: [
          'dev-dist/**',
          'dist/**',
          'src/stories/**',
          '*.config.{js,ts,cjs,mjs}',
          '.*.{js,ts,cjs,mjs}',
        ],
      },
    },
  }),
)
