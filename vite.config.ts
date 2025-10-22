import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    base: "./",
    build: {
      outDir: "dist-react",
    },
    server: {
      port: parseInt(process.env.VITE_DEVELOPMENT_PORT!),
      strictPort: true,
    },
  });
};
