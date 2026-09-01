import React, { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "../../store/authStore"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Logo } from "./Logo"
import {
  IconBrandGoogle,
  IconSparkles,
  IconShieldCheck,
} from "@tabler/icons-react"
import { Google } from "@boxicons/react"

export interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onOpenChange,
}) => {
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
    onOpenChange(false)
    navigate({ to: "/dashboard/projects" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 sm:max-w-md sm:p-8">
        <DialogHeader className="items-center space-y-3 text-center">
          <div className="mb-1 flex justify-center">
            <Logo className="h-7 w-auto text-foreground" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Sign in to Brand Studio
          </DialogTitle>
          <DialogDescription className="max-w-xs text-center text-base text-foreground">
            Authenticate with your Google account to manage your system.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-center text-xs text-destructive">
              {error}
            </div>
          )}

          {/* Primary Action: Google Authentication */}
          <div className="space-y-2.5">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              icon={<Google />}
              variant={"outline"}
              size={"pill"}
              className={"w-full rounded-full"}
            >
              {loading ? "Connecting to Google..." : "Continue with Google"}
            </Button>

            <Button
              type="button"
              onClick={handleGuest}
              icon={<IconSparkles size={16} />}
              variant={"shiny"}
              size={"pill"}
              className={"w-full rounded-full"}
            >
              Continue as Guest (Demo Mode)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
