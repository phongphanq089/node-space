import LandingHero from './components/LandingHero'

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-ns-bg font-sans text-ns-text-2">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{ backgroundImage: "url('/hero-banner.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-linear-to-b from-black/40 via-transparent to-ns-bg/80" />

      <LandingHero />
    </div>
  )
}
