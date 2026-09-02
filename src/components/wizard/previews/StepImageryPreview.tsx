import { useBrandStore } from "@/store/brandStore"
import { IMAGERY_BENTO_SHOWCASES } from "@/data/wizard"
import chroma from "chroma-js"
import ImageComponentOptimized from "@/components/shared/image-component-optimized"
import { Badge } from "@/components/ui/badge"

export function StepImageryPreview() {
  const brand = useBrandStore()

  // Retrieve swatch colors configured in StepColors
  const primaryColor =
    brand.colorPalette.find((c) => c.role === "primary")?.hex || "#6366f1"
  const secondaryColor =
    brand.colorPalette.find((c) => c.role === "secondary")?.hex || "#06b6d4"
  const accentColor =
    brand.colorPalette.find((c) => c.role === "accent")?.hex ||
    brand.colorPalette[2]?.hex ||
    "#10b981"

  const moodKey =
    brand.imageryMood in IMAGERY_BENTO_SHOWCASES ? brand.imageryMood : "minimal"
  const showcase = IMAGERY_BENTO_SHOWCASES[moodKey]

  // Dynamic luminance calculations for Card 1
  const primaryLum = chroma.valid(primaryColor)
    ? chroma(primaryColor).luminance()
    : 0.5
  const card1TextColor = primaryLum > 0.45 ? "#111827" : "#ffffff"
  const card1SubtextColor =
    primaryLum > 0.45 ? "rgba(17, 24, 39, 0.75)" : "rgba(255, 255, 255, 0.8)"
  const circleBorderColor =
    primaryLum > 0.45 ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.15)"

  // Dynamic colors for Card 2 (frosted panel uses secondary color)
  const secondaryDark = chroma.valid(secondaryColor)
    ? chroma(secondaryColor).darken(1.2).hex()
    : "#16444f"

  // Dynamic colors for Card 4 (campaign gradient overlay uses primary / accent)
  const overlayDark = chroma.valid(primaryColor)
    ? chroma(primaryColor).darken(1.8).hex()
    : "#3b0764"
  const overlayMid = chroma.valid(primaryColor)
    ? chroma(primaryColor).darken(0.8).hex()
    : "#6b2513"

  return (
    <div className="space-y-4">
      {/* 4-Card Bento Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Card 1: Brand Primary Tinted App Card with Photo Preview */}
        <div
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300"
          style={{
            backgroundColor: primaryColor,
            borderColor: chroma.valid(primaryColor)
              ? chroma(primaryColor).alpha(0.35).css()
              : "rgba(255, 255, 255, 0.1)",
            color: card1TextColor,
          }}
        >
          {/* Subtle decorative concentric circles */}
          <div
            className="pointer-events-none absolute -right-16 -bottom-16 size-64 rounded-full border"
            style={{ borderColor: circleBorderColor }}
          />
          <div
            className="pointer-events-none absolute -right-8 -bottom-8 size-48 rounded-full border"
            style={{ borderColor: circleBorderColor }}
          />

          <div className="relative z-10 p-5">
            {/* Inner Photo Window */}
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl">
              <ImageComponentOptimized
                src={showcase.heroFeature.image}
                alt={showcase.heroFeature.title}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                imageClassName="w-full h-full"
              />
              <Badge className="absolute top-2 left-2 rounded-full bg-primary-950 text-primary-50">
                {showcase.heroFeature.badge}
              </Badge>
            </div>

            {/* Typography Bottom */}
            <div className="mt-4 space-y-1">
              <h5 style={{ color: card1TextColor }}>
                {showcase.heroFeature.title}
              </h5>
              <p style={{ color: card1SubtextColor }}>
                {showcase.heroFeature.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Full-Bleed Portrait Photo with Secondary-Tinted Frosted Overlay Badge */}
        <div className="group relative flex min-h-85 flex-col justify-end overflow-hidden rounded-3xl bg-card transition-all duration-300">
          <ImageComponentOptimized
            src={showcase.scaleCard.image}
            alt={showcase.scaleCard.headline}
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
            imageClassName="w-full h-full"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary-950/80 via-primary-50/25 to-transparent" />

          {/* Floating Category Tag */}

          <Badge className="absolute top-4 right-2 rounded-full bg-primary-950 text-primary-50">
            {showcase.scaleCard.tag}
          </Badge>

          {/* Frosted Text Box Card Tinted by Secondary Palette Color */}
          <div className="relative z-10 m-3.5 rounded-2xl p-5 backdrop-blur-md">
            <h5 className="text-primary-50">
              {showcase.scaleCard.headline}{" "}
              <span
                className="block font-normal"
                style={{
                  color: chroma.valid(secondaryColor)
                    ? chroma(secondaryColor).brighten(0.7).hex()
                    : "rgba(255, 255, 255, 0.9)",
                }}
              >
                {showcase.scaleCard.highlight}
              </span>
            </h5>
          </div>
        </div>

        {/* Card 3: Editorial / Blog List Card with Accent Color Badges */}
        <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card/90 p-5 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between pb-3">
              <h5>{showcase.articleList.header}</h5>

              <Badge className="rounded-full" variant={"outline"}>
                Live Feed
              </Badge>
            </div>

            <div className="divide-y divide-border/60">
              {showcase.articleList.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3.5 py-3 first:pt-1 last:pb-0"
                >
                  <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <ImageComponentOptimized
                      src={item.image}
                      alt={item.title}
                      className="size-full object-cover"
                      imageClassName="w-full h-full"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="line-clamp-2 text-sm">{item.title}</p>
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-primary-50"
                      style={{
                        backgroundColor: chroma.valid(secondaryDark)
                          ? chroma(secondaryDark).alpha(0.82).css()
                          : "rgba(245, 158, 11, 0.15)",
                        // color: accentColor,
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 4: High Impact Portrait Campaign Card with Primary-Tinted Gradient Overlay */}
        <div className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-3xl border border-border/80 bg-card transition-all duration-300">
          <ImageComponentOptimized
            src={showcase.campaignCard.image}
            alt={showcase.campaignCard.headline}
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
            imageClassName="w-full h-full"
          />
          {/* Dynamic Ambient Gradient Wash mapped to Primary Color */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${chroma.valid(overlayDark) ? chroma(overlayDark).alpha(0.95).css() : "rgba(107, 37, 19, 0.95)"} 0%, ${chroma.valid(overlayMid) ? chroma(overlayMid).alpha(0.4).css() : "rgba(143, 54, 26, 0.4)"} 50%, transparent 100%)`,
            }}
          />

          {/* Accent Label Top */}
          <Badge className="absolute top-4 left-4 rounded-full bg-primary-950 text-primary-50">
            {showcase.campaignCard.accentLabel}
          </Badge>

          <div className="relative z-10 space-y-1 p-5">
            <h5 className="text-primary-50">
              {showcase.campaignCard.headline}
            </h5>
            <p className="text-primary-200">
              {showcase.campaignCard.subheadline}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
