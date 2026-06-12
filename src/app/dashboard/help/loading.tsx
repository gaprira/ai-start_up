export default function HelpLoading() {
  return (
    <div className="space-y-6 max-w-3xl animate-pulse">
      <div>
        <div className="h-3 w-16 bg-white/5 rounded mb-2" />
        <div className="h-8 w-48 bg-white/5 rounded" />
      </div>
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white/5 rounded-xl" />
          <div className="h-4 w-48 bg-white/5 rounded" />
        </div>
        <div className="space-y-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
