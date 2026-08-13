import { createFileRoute } from '@tanstack/react-router'
import { Headphones, Waves, Mic } from 'lucide-react'
import { ComingSoon } from '@/shared/ui'
import type { FeatureTeaser } from '@/shared/ui'

export const Route = createFileRoute('/_workspace/workspace/music')({
  component: MusicComingSoonPage,
})

const MUSIC_FEATURES: FeatureTeaser[] = [
  {
    icon: Headphones,
    title: 'Lofi & Ambient Streams',
    description:
      'Curated YouTube streams & lofi chillhop stations directly inside PiP player.',
  },
  {
    icon: Waves,
    title: 'Binaural Alpha Waves',
    description:
      'Brainwave entrainment soundscapes engineered to enhance focus & memory.',
  },
  {
    icon: Mic,
    title: 'Voice Note Transcriber',
    description:
      'Speak your thoughts naturally and let AI transcribe them straight into notes.',
  },
]

function MusicComingSoonPage() {
  return (
    <ComingSoon
      featureName="Audio Studio"
      version="v2.0"
      badge="NodeSpace Audio Studio · Coming Soon v2.0"
      title={
        <>
          Elevate Your Deep Work with <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-ns-primary-lt via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Soundscapes & Focus Audio
          </span>
        </>
      }
      description="We are building an integrated background audio engine, binaural focus frequencies, and voice note transcription directly inside your NodeSpace workspace."
      features={MUSIC_FEATURES}
    />
  )
}
