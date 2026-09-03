import { Link } from "@tanstack/react-router"
import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized"
import AnimatedUnderline from "@/components/ui/animated-underline"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { InsightPost } from "@/data/insights"

interface InsightCardProps {
  item: InsightPost
  index: number
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function InsightCard({
  item,
  onMouseEnter,
  onMouseLeave,
}: InsightCardProps) {
  return (
    <Link
      to="/insights/$slug"
      params={{ slug: item.slug }}
      className="insight-item group grid cursor-pointer grid-cols-1 gap-8 border-t border-border py-12 text-foreground no-underline hover:text-foreground lg:grid-cols-12 lg:gap-16"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Left: Title, Author, Date */}
      <div className="flex flex-col gap-4 lg:col-span-5">
        <h4>
          <AnimatedUnderline>{item.title}</AnimatedUnderline>
        </h4>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {item.avatar && (
                <AvatarImage src={item.avatar} alt={item.author} />
              )}
              <AvatarFallback>
                {item.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <h6>{item.author}</h6>
          </div>
          <p>{item.date}</p>
        </div>
      </div>

      {/* Middle: Excerpt */}
      <div className="lg:col-span-3">
        <p>{item.excerpt}</p>
      </div>

      {/* Right: Image */}
      <div className="overflow-hidden rounded-xl lg:col-span-4">
        <div className="relative aspect-16/10 w-full transition-transform duration-700 ease-out group-hover:scale-110">
          <ImageComponentOptimized
            src={item.image}
            alt={item.title}
            className="absolute inset-[-15%] h-[130%] w-[130%]"
            imageClassName="insight-image w-full h-full object-cover"
            layout="fullWidth"
          />
        </div>
      </div>
    </Link>
  )
}
