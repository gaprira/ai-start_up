export default function BillingLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-3 w-16 bg-white/5 rounded mb-2" />
        <div className="h-8 w-48 bg-white/5 rounded" />
      </div>
      <div className="glass-card rounded-2xl p-6">
        <div className="h-5 w-32 bg-white/5 rounded mb-2" />
        <div className="h-3 w-64 bg-white/5 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-8">
            <div className="h-5 w-16 bg-white/5 rounded mb-4" />
            <div className="h-10 w-20 bg-white/5 rounded mb-2" />
            <div className="h-3 w-32 bg-white/5 rounded mb-6" />
            <div className="space-y-3 mb-8">
              {[0, 1, 2, 3].map((j) => (
                <div key={j} className="h-3 bg-white/5 rounded" style={{ width: `${80 + j * 5}%` }} />
              ))}
            </div>
            <div className="h-11 bg-white/5 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}
