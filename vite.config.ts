import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default ({ mode }: { mode: string }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

    return defineConfig({
        plugins: [react()],
        base: './',
        build: {
            outDir: 'dist-react',
        },
        server: {
            port: parseInt(process.env.VITE_DEVELOPMENT_PORT!),
            strictPort: true,
        },
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['./vitest.setup.ts'],
            exclude: ['dist/**', 'dist-react/**', 'dist-electron/**', 'node_modules/**'],
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
}
