import { useEffect, useState } from 'react'

interface TimeLeft {
  days: string
  hours: string
  minutes: string
  seconds: string
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

// Target: 2026-07-06T05:26:20Z
const TARGET_DATE = new Date('2026-07-06T05:26:20Z').getTime()

export function useCountdown(): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  useEffect(() => {
    const tick = () => {
      const diff = TARGET_DATE - Date.now()

      if (diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' })
        return
      }

      setTimeLeft({
        days: pad(Math.floor(diff / 86_400_000)),
        hours: pad(Math.floor((diff % 86_400_000) / 3_600_000)),
        minutes: pad(Math.floor((diff % 3_600_000) / 60_000)),
        seconds: pad(Math.floor((diff % 60_000) / 1_000)),
      })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return timeLeft
}
