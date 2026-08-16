export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <span className="flex items-center gap-2 text-lg font-semibold text-brand-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-base font-bold text-white shadow-sm">
              S
            </span>
            StoreRate
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-9 shadow-sm">
          <h1 className="mb-1 text-2xl font-semibold text-slate-800">{title}</h1>
          {subtitle && <p className="mb-8 text-sm text-slate-500">{subtitle}</p>}

          {children}
        </div>
      </div>
    </div>
  )
}