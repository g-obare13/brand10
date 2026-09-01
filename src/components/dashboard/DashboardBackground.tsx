import Auralis from "../shared/Auralis"

export function DashboardBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-screen w-full overflow-hidden [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_85%)] opacity-70 dark:opacity-85">
      <Auralis
        className="absolute inset-0 h-full w-full opacity-10"
        colors={["#6366f1", "#a855f7", "#38bdf8"]}
        speed={0.05}
        grain={0.35}
      />
      <div className="absolute -top-32 -left-20 h-[80vh] w-[80vw] rounded-full bg-linear-to-br from-indigo-500/20 via-sky-400/15 to-purple-500/20 blur-[150px]" />
      <div className="absolute -top-24 right-0 h-[80vh] w-[80vw] rounded-full bg-linear-to-bl from-orange-400/15 via-rose-400/15 to-amber-300/10 blur-[140px]" />
    </div>
  )
}
