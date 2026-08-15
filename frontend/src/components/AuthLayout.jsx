export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen w-full bg-white md:grid-cols-2">
      {/* Info / branding side — hidden on small screens so there's one box, not two */}
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-10 text-white md:flex lg:p-14">
        <div>
          <span className="flex items-center gap-2 text-xl font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-base font-bold backdrop-blur-sm">
              S
            </span>
            StoreRate
          </span>

          <h2 className="mt-10 text-2xl font-semibold leading-snug lg:text-3xl">
            Find, rate, and track your favorite stores.
          </h2>
          <p className="mt-3 text-sm text-brand-100 lg:text-base">
            A simple place to discover local stores and share honest ratings
            with everyone else looking for the same thing.
          </p>
        </div>

        <ul className="space-y-3 text-sm text-brand-100 lg:text-base">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Browse and search stores near you
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Rate stores from 1 to 5 stars
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Store owners can track their ratings
          </li>
        </ul>

        <p className="text-xs text-brand-200/80">© {new Date().getFullYear()} StoreRate</p>
      </div>

      {/* Form side */}
      <div className="flex flex-col justify-center px-6 py-10 sm:px-10 md:px-14 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          {/* App name shown here only on small screens, since the brand panel is hidden */}
          <span className="mb-6 flex items-center gap-2 text-lg font-semibold text-brand-700 md:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-base font-bold text-white shadow-sm">
              S
            </span>
            StoreRate
          </span>

          <h1 className="mb-1 text-2xl font-semibold text-slate-800">{title}</h1>
          {subtitle && <p className="mb-8 text-sm text-slate-500">{subtitle}</p>}

          {children}
        </div>
      </div>
    </div>
  )
}