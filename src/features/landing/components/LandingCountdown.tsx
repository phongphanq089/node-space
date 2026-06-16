import { useCountdown } from '../hooks/useCountdown'

const UNITS = [
  { key: 'days', label: 'Ngày' },
  { key: 'hours', label: 'Giờ' },
  { key: 'minutes', label: 'Phút' },
  { key: 'seconds', label: 'Giây' },
] as const

export default function LandingCountdown() {
  const timeLeft = useCountdown()

  return (
    <footer className="relative z-10 w-full px-6 pb-12 md:pb-16">
      <div className="mx-auto flex max-w-[800px] flex-col items-center">
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          {UNITS.map((unit, i) => (
            <div key={unit.key} className="contents">
              <div className="flex flex-col items-center">
                <div className="ns-countdown-card flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-extrabold text-white sm:h-24 sm:w-24 sm:text-3xl">
                  {timeLeft[unit.key]}
                </div>
                <span className="mt-2 text-xs font-semibold tracking-wider text-ns-muted">
                  {unit.label}
                </span>
              </div>

              {i < UNITS.length - 1 && (
                <span className="text-xl font-bold text-ns-muted/70 sm:text-2xl">
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

