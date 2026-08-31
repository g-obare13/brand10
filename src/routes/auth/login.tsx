import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../../components/ui/button'
import { Logo } from '../../components/shared/Logo'
import { ThemeToggler } from '../../components/shared/theme-toggler'
import { IconSparkles, IconBrandGoogle, IconShieldCheck, IconArrowLeft } from '@tabler/icons-react'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const auth = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)
    const { error: googleError } = await auth.signInWithGoogle()
    if (googleError) {
      setError(googleError.message)
      setLoading(false)
    }
  }

  const handleGuest = () => {
    auth.continueAsGuest()
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-[140px] pointer-events-none rounded-full" />

      {/* Top Floating Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground p-2 rounded-xl bg-card/60 backdrop-blur-md border border-border transition-colors"
        >
          <IconArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
        <div className="bg-card/60 backdrop-blur-md p-1 rounded-full border border-border">
          <ThemeToggler />
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center justify-center mb-6 hover:opacity-90 transition-opacity">
          <Logo className="h-9 w-auto text-foreground" />
        </Link>

        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Sign in to Brand Studio</h2>
        <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto">
          Authenticate with your Google account to manage living brand guidelines, assets, and design tokens.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-card border border-border backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl sm:px-10 space-y-6 text-card-foreground">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {error}
            </div>
          )}

          {/* Single Primary Action: Google Authentication */}
          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-foreground hover:bg-foreground/90 text-background font-semibold text-xs py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 h-11"
            >
              <IconBrandGoogle size={18} />
              {loading ? 'Connecting to Google...' : 'Continue with Google'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleGuest}
              className="w-full border-border bg-muted/20 hover:bg-muted/50 text-foreground text-xs font-medium py-2.5 rounded-xl h-10 transition"
            >
              <IconSparkles size={16} className="mr-2 text-primary" />
              Continue as Guest (Demo Mode)
            </Button>
          </div>

          <div className="pt-4 border-t border-border/60 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <IconShieldCheck size={14} className="text-emerald-500" />
            <span>Encrypted Supabase OAuth session</span>
          </div>
        </div>
      </div>
    </div>
  )
}
