import { createLogger, defineConfig } from "vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import tailwindcss from "@tailwindcss/vite"
import viteReact from "@vitejs/plugin-react"

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
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
})

export default config
