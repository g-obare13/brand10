import WordReveal from "@/components/shared/WordReveal"
import { cn } from "@/lib/utils"
import { useBrandStore } from "@/store/brandStore"
import { IconCheck, IconPhoto } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { IMAGERY_MOOD_OPTIONS, IMAGERY_MOOD_IMAGE_ARRAYS } from "@/data/wizard"
import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized"

/**
 * Step 5 Wizard form component for configuring brand photography mood and lighting treatments.
 * Features:
 * - Selectable mood directions (Minimal, Cinematic, Vibrant, Editorial).
 * - Automatic persistence of the selected style and its related image asset links.
 * - Real-time sync with brand imagery tokens in brandStore.
 * - Visual gallery of active style photography assets.
 *
 * @component
 * @returns {React.ReactElement} The rendered imagery configuration form.
 */
export function StepImagery() {
  const brand = useBrandStore()

  const currentMood =
    brand.imageryMood in IMAGERY_MOOD_IMAGE_ARRAYS
      ? brand.imageryMood
      : "minimal"
  const currentImages =
    brand.imageryLinks.length > 0
      ? brand.imageryLinks
      : IMAGERY_MOOD_IMAGE_ARRAYS[currentMood]

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
                  onClick={() =>
                    brand.setImagery({
                      mood: mood.id,
                      links: IMAGERY_MOOD_IMAGE_ARRAYS[mood.id],
                    })
                  }
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

        {/* Selected Style Image Assets Gallery */}
        <div className="space-y-3 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">Saved Style Assets</span>
            </div>
            <Badge variant="ghost" className="rounded-full text-xs">
              {currentImages.length} Photos
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {currentImages.map((imgUrl, idx) => (
              <div
                key={idx}
                className="group relative aspect-4/3 overflow-hidden rounded-xl border border-border/60 bg-muted"
              >
                <ImageComponentOptimized
                  src={imgUrl}
                  alt={`Style reference asset ${idx + 1}`}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  imageClassName="size-full object-cover"
                />
                <span className="absolute bottom-1.5 left-1.5 rounded-md bg-primary-900/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                  #{idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
