import {defineConfig} from 'tsdown'
import {baseConfig} from '../../tsdown.base.mjs'

export default defineConfig({
    ...baseConfig,
    entry: ['src/index.ts'],
    outDir: 'dist',
})