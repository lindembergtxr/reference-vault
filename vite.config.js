import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
    return defineConfig({
        plugins: [react()],
        base: './',
        build: {
            outDir: 'dist-react',
        },
        server: {
            port: parseInt(process.env.VITE_DEVELOPMENT_PORT),
            strictPort: true,
        },
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['./vitest.setup.ts'],
        },
    })
}
