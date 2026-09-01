import Auralis from "../shared/Auralis"

export function DashboardBackground() {
  return (
    <div className="pointer-events-none absolute top-0 right-0 z-0 h-screen w-full overflow-hidden [mask-image:radial-gradient(ellipse_at_top_right,black_35%,transparent_75%)] opacity-70 md:w-[60vw] dark:opacity-85">
      <Auralis
        className="absolute inset-0 h-full w-full opacity-50"
        colors={["#6366f1", "#a855f7", "#38bdf8"]}
        speed={0.05}
        grain={0.35}
      />
      <div className="absolute -top-24 right-0 h-screen w-screen rounded-full bg-linear-to-br from-indigo-500/20 via-sky-400/15 to-purple-500/20 blur-[140px]" />
      <div className="absolute top-48 -right-12 h-screen w-screen rounded-full bg-linear-to-bl from-orange-400/15 via-rose-400/15 to-amber-300/10 blur-[120px]" />
    </div>
  )
}
