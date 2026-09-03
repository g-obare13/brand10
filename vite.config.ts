import { createLogger, defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import tailwindcss from "@tailwindcss/vite"
import viteReact from "@vitejs/plugin-react"

const config = defineConfig({
  plugins: [
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  ssr: {
    noExternal: [
      "@tanstack/react-store",
      "@tanstack/store",
      "@tabler/icons-react",
      /^gsap/,
      "@boxicons/react",
      "@base-ui/react",
      "sonner",
    ],
  },
  build: {
    sourcemap: false,
  },
  css: {
    devSourcemap: false,
  },
  optimizeDeps: {
    include: ["@tabler/icons-react"],
  },
  customLogger: {
    ...createLogger(),
    warn: (msg, options) => {
      if (msg.includes("points to missing source files")) return
      createLogger().warn(msg, options)
    },
  },
  esbuild: {
    // Deliberately do NOT drop console: `console.error` is the only trace of
    // Supabase/export failures in production, and Vite's typed Drop list only
    // supports "console" (which would strip errors too). Keep all output.
    // @ts-expect-error: 'drop' is supported by esbuild at runtime but may be missing in older TypeScript definitions
    drop: ["debugger"],
  },
})

export default config
