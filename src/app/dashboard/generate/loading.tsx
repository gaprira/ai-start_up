export default function GenerateLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
      <div className="h-4 w-32 bg-white/5 rounded" />
      <div>
        <div className="h-3 w-20 bg-white/5 rounded mb-2" />
        <div className="h-8 w-64 bg-white/5 rounded mb-2" />
        <div className="h-4 w-80 bg-white/5 rounded" />
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-4 bg-white/5 rounded" />
            <div className="h-4 w-24 bg-white/5 rounded" />
          </div>
          <div className="h-3 w-40 bg-white/5 rounded mb-3" />
          <div className="h-20 bg-white/5 rounded-xl" />
        </div>
      ))}
      <div className="h-14 bg-white/5 rounded-2xl" />
    </div>
  )
}
