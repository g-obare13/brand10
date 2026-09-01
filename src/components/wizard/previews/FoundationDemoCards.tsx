import { Badge } from "@/components/ui/badge"
import type { PreviewStyleConfig } from "./previewTheme"
import { Circle } from "@boxicons/react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface DemoCardsProps {
  theme: PreviewStyleConfig
  primaryColor: string
}

export function MovementClaimableBalance({
  theme,
  primaryColor,
}: DemoCardsProps) {
  return (
    <div className={theme.interactiveCard}>
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">Claimable Balance</span>
          <Badge
            className={theme.badge}
            showDivider={true}
            icon={<Circle />}
            iconPosition="left"
          >
            Live Wallet
          </Badge>
        </div>
        <div className={theme.statValue}>$14,850.00</div>
      </div>

      {/* Breakdown */}
      <div className={`space-y-2 border-t pt-3 ${theme.divider}`}>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Net Royalties</span>
          <span className="font-mono font-medium text-foreground">
            $15,200.00
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Platform Fee (2.3%)</span>
          <span className="font-mono font-medium text-foreground">
            -$350.00
          </span>
        </div>
        <div
          className={`flex items-center justify-between border-t pt-2 text-xs font-semibold ${theme.divider}`}
        >
          <span className="text-foreground">Total Ready to Claim</span>
          <span className="font-mono font-bold text-foreground">
            $14,850.00 USD
          </span>
        </div>
      </div>

      {/* Action */}
      <div className="pt-1">
        <Button
          type="button"
          className={theme.buttonPrimary}
          style={
            theme.id !== "minimalism"
              ? { backgroundColor: primaryColor }
              : undefined
          }
        >
          Withdraw to Bank
        </Button>
      </div>
    </div>
  )
}

export function MovementNewMilestone({ theme, primaryColor }: DemoCardsProps) {
  return (
    <div className={theme.interactiveCard}>
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className={"font-medium"}>Next Milestone Goal</span>
          <Badge className={theme.accentPill}>Q3 2026</Badge>
        </div>
        <h6>Scale Global Infrastructure</h6>
        <p>Pace your team towards key operational and financial targets.</p>
      </div>

      {/* Form Fields Simulation */}
      <div className="space-y-3 pt-1">
        <div className="space-y-1">
          <Label className={theme.typographyLabel}>Target Name</Label>
          <Input
            readOnly
            className={theme.input}
            defaultValue="Series A Expansion"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className={theme.typographyLabel}>Target Amount</Label>
            <Input readOnly className={theme.input} defaultValue="$500,000" />
          </div>
          <div className="space-y-1">
            <Label className={theme.typographyLabel}>Target Date</Label>
            <Input readOnly className={theme.input} defaultValue="Nov 2026" />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button
          type="button"
          className={theme.buttonPrimary}
          style={
            theme.id !== "minimalism"
              ? { backgroundColor: primaryColor }
              : undefined
          }
        >
          Create Goal
        </Button>
        <Button type="button" className={theme.buttonSecondary}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
