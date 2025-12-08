/// <reference types="vitest" />
import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@core': path.resolve(__dirname, './src/app/core'),
      '@guards': path.resolve(__dirname, './src/app/core/guards'),
      '@interceptors': path.resolve(__dirname, './src/app/core/interceptors'),
      '@constants': path.resolve(__dirname, './src/app/core/constants'),
      '@features': path.resolve(__dirname, './src/app/features'),
      '@models/cart': path.resolve(__dirname, './src/app/features/cart/models/cart.models.ts'),
      '@models/product': path.resolve(__dirname, './src/app/features/products/models/product.model.ts'),
      '@layout': path.resolve(__dirname, './src/app/layout'),
      '@shared': path.resolve(__dirname, './src/app/shared'),
      '@models': path.resolve(__dirname, './src/app/shared/models'),
      '@api-models': path.resolve(__dirname, './src/app/shared/models/generated/api-models.ts'),
      '@components': path.resolve(__dirname, './src/app/shared/ui/components'),
      '@validators': path.resolve(__dirname, './src/app/shared/validators'),
      '@state': path.resolve(__dirname, './src/app/state'),
      '@env': path.resolve(__dirname, './src/environments'),
    },
  },
  test: {
    include: ['src/**/*.spec.ts'],
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.config.ts', 'src/main.ts', 'src/environments/**'],
    },
  },
});
