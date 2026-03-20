/** Centered layout shared by the Clerk sign-in and sign-up pages */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background px-4">
      <div className="flex items-center gap-2 text-white">
        {/* Logo mark */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
          className="text-violet-500"
        >
          <rect width="28" height="28" rx="6" fill="currentColor" />
          <path
            d="M8 20L14 8l6 12"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xl font-bold tracking-tight">RNDR</span>
      </div>
      {children}
    </div>
  );
}
