import { useBrandStore } from "@/store/brandStore"
import { Label } from "@/components/ui/label"
import { IconCheck } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import WordReveal from "@/components/shared/WordReveal"

import { IMAGERY_MOOD_OPTIONS } from "@/data/wizard"
import { Badge } from "@/components/ui/badge"

export function StepImagery() {
  const brand = useBrandStore()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <WordReveal
          as="h4"
          stagger={0.03}
          duration={1.2}
          disableScrollTrigger={true}
          className="mb-2"
        >
          Visual Mood &amp; Treatment
        </WordReveal>
        <WordReveal
          as="p"
          stagger={0.03}
          duration={1.2}
          disableScrollTrigger={true}
          className="mb-2"
        >
          Establish photography guidelines and ambient lighting direction.
        </WordReveal>
      </div>

      <div className="space-y-5">
        {/* Photography Mood Direction */}
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {IMAGERY_MOOD_OPTIONS.map((mood) => {
              const isSelected = brand.imageryMood === mood.id

              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => brand.setImagery({ mood: mood.id })}
                  className={cn(
                    "flex cursor-pointer flex-col justify-between rounded-2xl border p-4 text-left transition-all",
                    isSelected ? "bg-primary/5" : "bg-card/60"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="rounded-full"
                      icon={
                        isSelected && (
                          <IconCheck size={16} className="text-primary" />
                        )
                      }
                    >
                      {mood.badge}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-1">
                    <h6>{mood.title}</h6>
                    <p className="text-sm text-muted-foreground">{mood.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
