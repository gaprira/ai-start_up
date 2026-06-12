export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-3 w-24 bg-white/5 rounded mb-3" />
        <div className="h-8 w-64 bg-white/5 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-6">
            <div className="h-3 w-20 bg-white/5 rounded mb-4" />
            <div className="h-8 w-16 bg-white/5 rounded mb-1" />
            <div className="h-3 w-32 bg-white/5 rounded" />
          </div>
        ))}
      </div>
      <div className="glass-card rounded-2xl p-8">
        <div className="h-6 w-48 bg-white/5 rounded mb-2" />
        <div className="h-4 w-72 bg-white/5 rounded" />
      </div>
    </div>
  )
}
