export default function SettingsLoading() {
  return (
    <div className="space-y-6 max-w-2xl animate-pulse">
      <div>
        <div className="h-3 w-16 bg-white/5 rounded mb-2" />
        <div className="h-8 w-48 bg-white/5 rounded" />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/5 rounded-xl" />
            <div>
              <div className="h-4 w-24 bg-white/5 rounded mb-1" />
              <div className="h-3 w-40 bg-white/5 rounded" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-11 bg-white/5 rounded-xl" />
            <div className="h-11 bg-white/5 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}
