import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'VueShortcutManager',
            fileName: (format) => `vue-shortcut-manager.${format}.js`,
            formats: ['es', 'cjs', 'umd']
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: { vue: 'Vue' },
                exports: 'named'
            }
        }
    }
})