/**
 * @file AiGuidelinesTab.tsx
 * @description Interactive canvas tab for managing brand Do's and Don'ts,
 * clearspace instructions, and asset usage guidelines.
 */

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAiAgentStore } from "@/store/aiAgentStore"
import { IconCheck, IconX, IconPlus, IconTrash, IconListCheck } from "@tabler/icons-react"
import { useState } from "react"
import type React from "react"
import type { BrandDoDontItem } from "@/data/presets"

/**
 * Interactive guidelines canvas component.
 *
 * @component
 * @returns {React.ReactElement}
 */
export function AiGuidelinesTab(): React.ReactElement {
  const { draft, updateDraftField } = useAiAgentStore()
  const [newRuleTitle, setNewRuleTitle] = useState("")
  const [newRuleDetail, setNewRuleDetail] = useState("")
  const [newRuleType, setNewRuleType] = useState<"do" | "dont">("do")

  const handleAddRule = () => {
    if (!newRuleTitle.trim()) return
    const newRule: BrandDoDontItem = {
      id: `rule-${Date.now()}`,
      rule: newRuleTitle.trim(),
      detail: newRuleDetail.trim() || newRuleTitle.trim(),
      type: newRuleType,
    }
    updateDraftField("dosAndDonts", [...draft.dosAndDonts, newRule])
    setNewRuleTitle("")
    setNewRuleDetail("")
  }

  const handleRemoveRule = (id: string) => {
    updateDraftField(
      "dosAndDonts",
      draft.dosAndDonts.filter((r) => r.id !== id)
    )
  }

  const dos = draft.dosAndDonts.filter((r) => r.type === "do")
  const donts = draft.dosAndDonts.filter((r) => r.type === "dont")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconListCheck size={16} className="text-primary" />
          <h6 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Usage Guidelines &amp; Directives ({draft.dosAndDonts.length} Rules)
          </h6>
        </div>
      </div>

      {/* Add Rule Inline Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2 rounded-xl border border-border/80 bg-card p-3 shadow-xs">
        <select
          value={newRuleType}
          onChange={(e) => setNewRuleType(e.target.value as "do" | "dont")}
          className="h-8 rounded-md border border-border bg-background px-2 text-xs font-semibold text-foreground w-full sm:w-auto"
        >
          <option value="do">Do</option>
          <option value="dont">Don&apos;t</option>
        </select>

        <Input
          value={newRuleTitle}
          onChange={(e) => setNewRuleTitle(e.target.value)}
          placeholder="Directive Title (e.g. Maintain clearspace)"
          className="h-8 text-xs flex-1"
        />

        <Input
          value={newRuleDetail}
          onChange={(e) => setNewRuleDetail(e.target.value)}
          placeholder="Explanation / rule details"
          className="h-8 text-xs flex-1"
        />

        <Button
          type="button"
          size="sm"
          onClick={handleAddRule}
          disabled={!newRuleTitle.trim()}
          className="h-8 text-xs w-full sm:w-auto"
        >
          <IconPlus size={14} className="mr-1" />
          Add Directive
        </Button>
      </div>

      {/* Two Column Grid: Dos vs Donts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Recommended Dos */}
        <div className="space-y-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <IconCheck size={18} />
            <h6 className="text-xs font-bold uppercase tracking-wider">
              Recommended Practices (Do)
            </h6>
          </div>

          <div className="space-y-2">
            {dos.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-emerald-500/20 bg-card p-3 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="text-[10px] py-0 px-1.5 font-mono uppercase">
                      DO
                    </Badge>
                    <span className="text-xs font-bold text-foreground">
                      {item.rule}
                    </span>
                  </div>
                  {item.detail && item.detail !== item.rule && (
                    <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                      {item.detail}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveRule(item.id)}
                  className="text-muted-foreground transition hover:text-destructive shrink-0 p-1"
                  title="Remove rule"
                >
                  <IconTrash size={14} />
                </button>
              </div>
            ))}
            {dos.length === 0 && (
              <p className="text-xs text-muted-foreground italic p-2">
                No recommended practices generated yet.
              </p>
            )}
          </div>
        </div>

        {/* Forbidden Don'ts */}
        <div className="space-y-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-destructive">
            <IconX size={18} />
            <h6 className="text-xs font-bold uppercase tracking-wider">
              Forbidden Violations (Don&apos;t)
            </h6>
          </div>

          <div className="space-y-2">
            {donts.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-destructive/20 bg-card p-3 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-[10px] py-0 px-1.5 font-mono uppercase">
                      DON&apos;T
                    </Badge>
                    <span className="text-xs font-bold text-foreground">
                      {item.rule}
                    </span>
                  </div>
                  {item.detail && item.detail !== item.rule && (
                    <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                      {item.detail}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveRule(item.id)}
                  className="text-muted-foreground transition hover:text-destructive shrink-0 p-1"
                  title="Remove rule"
                >
                  <IconTrash size={14} />
                </button>
              </div>
            ))}
            {donts.length === 0 && (
              <p className="text-xs text-muted-foreground italic p-2">
                No violation rules generated yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
