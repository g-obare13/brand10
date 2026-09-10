import {
  HeadContent,
  Scripts,
  createRootRoute,
  redirect,
} from "@tanstack/react-router"

import { GeneralErrorComponent } from "@/components/shared/ErrorComponent"
import { NotFoundComponent } from "@/components/shared/NotFoundComponent"
import { ThemeProvider } from "@/components/shared/theme-provider"
import { initConsole } from "@/lib/console"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/store/authStore"
import { Toaster } from "sonner"
import "sonner/dist/styles.css"
import "@/styles.css"
import { ProgressiveBlur } from "@/components/shared/ProgressiveBlur"
import { PUBLIC_ROUTES } from "@/data/navigation"
import { DEFAULT_OG_IMAGE, SITE_URL, buildSeoMeta } from "@/data/seo"
import Footer from "@/components/shared/Footer"

initConsole()

export const Route = createRootRoute({
  head: () => ({
    meta: buildSeoMeta({ includeCharsetViewport: true }),
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
      {
        rel: "canonical",
        href: SITE_URL,
      },
      {
        rel: "image_src",
        href: DEFAULT_OG_IMAGE,
      },
    ],
  }),
  beforeLoad: async (ctx) => {
    const { location } = ctx
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      route === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(route)
    )

    if (isPublicRoute) {
      return
    }

    // Check store state first
    const { user } = useAuthStore.getState()
    if (user) {
      return
    }

    // Validate active Supabase session
    if (supabase) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          useAuthStore.setState({
            user: session.user,
            session,
            loading: false,
          })
          return
        }
      } catch (err) {
        console.warn("[Root beforeLoad] Session check failed:", err)
      }
    }

    // Protected route with no valid session -> redirect to home/login
    throw redirect({
      to: "/",
      search: {
        redirect: location.href,
      },
    })
  },
  errorComponent: GeneralErrorComponent,
  notFoundComponent: NotFoundComponent,
  shellComponent: RootDocument,
})

/**
 * Root HTML shell document wrapping the entire TanStack Router application.
 * Features:
 * - Immediate theme flash prevention script for dark/light mode hydration.
 * - Global ThemeProvider context and Sonner toast notifications container.
 * - TanStack devtools panels.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - Router outlet children.
 * @returns {React.ReactElement} The root HTML document structure.
 */
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = localStorage.getItem("ui-theme");
                if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                  document.documentElement.classList.add("dark");
                  document.documentElement.style.colorScheme = "dark";
                } else {
                  document.documentElement.classList.remove("dark");
                  document.documentElement.style.colorScheme = "light";
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="relative min-h-screen bg-background text-foreground antialiased transition-colors duration-150 selection:bg-primary/20 selection:text-primary"
      >
        <ProgressiveBlur
          className="z-40"
          direction="top"
          gradient
          layers={4}
          maxBlur={16}
          position="fixed"
          size="7rem"
        />
        {/* <ScrollManager> */}
        <ThemeProvider>
          {children}
          <Footer />
          <Toaster
            position="bottom-right"
            closeButton
            richColors
            toastOptions={{
              className: "font-sans",
            }}
          />
        </ThemeProvider>
        {/* </ScrollManager> */}

        <ProgressiveBlur
          className="z-40"
          direction="bottom"
          layers={4}
          maxBlur={16}
          position="fixed"
          size="5rem"
        />

        {/* <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        /> */}
        <Scripts />
      </body>
    </html>
  )
}
