export default function ResultsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-4 w-32 bg-white/5 rounded mb-2" />
        <div className="h-3 w-24 bg-white/5 rounded mb-1" />
        <div className="h-8 w-56 bg-white/5 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <div className="h-3 w-24 bg-white/5 rounded" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass-card rounded-xl p-4">
              <div className="h-3 w-12 bg-white/5 rounded mb-2" />
              <div className="h-4 w-32 bg-white/5 rounded mb-1" />
              <div className="h-3 w-full bg-white/5 rounded" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-3">
          <div className="glass-card rounded-2xl p-8">
            <div className="flex justify-between mb-6">
              <div>
                <div className="h-7 w-48 bg-white/5 rounded mb-2" />
                <div className="h-4 w-72 bg-white/5 rounded" />
              </div>
              <div className="h-8 w-16 bg-white/5 rounded-full" />
            </div>
            <div className="h-10 bg-white/5 rounded-xl mb-6" />
            <div className="space-y-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-white/5 rounded" style={{ width: `${100 - i * 15}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
