export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-primary border-b border-white/10 z-50">
      <div className="h-full max-w-[1920px] mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <span className="text-white text-xl font-bold tracking-tight">
            HotelApp
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center cursor-pointer hover:border-secondary transition-colors">
            <span className="text-secondary font-medium">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
