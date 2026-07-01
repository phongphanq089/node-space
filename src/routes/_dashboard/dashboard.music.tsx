import { createFileRoute } from '@tanstack/react-router'
import { useMusicStore } from '@/stores/useMusicStore'
import type { TrackItem } from '@/stores/useMusicStore'
import { useState } from 'react'
import {
  Plus,
  Trash2,
  Play,
  Pause,
  Music,
  Youtube,
  Image as ImageIcon,
  Tag,
  Radio,
  ExternalLink,
} from 'lucide-react'

export const Route = createFileRoute('/_dashboard/dashboard/music')({
  component: MusicManagerPage,
})

function MusicManagerPage() {
  const {
    playlist,
    currentTrackIndex,
    isPlaying,
    playTrack,
    setIsPlaying,
    addTrack,
    removeTrack,
    selectedCategory,
    setSelectedCategory,
  } = useMusicStore()

  // Form State
  const [addMode, setAddMode] = useState<'youtube' | 'mp3'>('youtube')
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [url, setUrl] = useState('')
  const [cover, setCover] = useState('')
  const [category, setCategory] = useState('Lofi') // Default group
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Unique categories for filtering
  const categories = [
    'All',
    ...Array.from(
      new Set(playlist.map((t) => t.category).filter((c): c is string => !!c))
    ),
  ]

  // Filtered playlist
  const filteredPlaylist =
    selectedCategory === 'All'
      ? playlist
      : playlist.filter((t) => t.category === selectedCategory)

  const handleModeChange = (mode: 'youtube' | 'mp3') => {
    setAddMode(mode)
    setError('')
    setTitle('')
    setArtist('')
    setUrl('')
    setCover('')
    setSelectedFile(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Auto fill Title from file name (removing extension)
      const baseName = file.name.replace(/\.[^/.]+$/, '')
      setTitle(baseName)
      // Generate Object URL
      const objectUrl = URL.createObjectURL(file)
      setUrl(objectUrl)
    }
  }

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!title.trim() || !url.trim()) {
      setError(
        addMode === 'youtube'
          ? 'Please provide at least a title and a valid YouTube URL.'
          : 'Please select a valid MP3 file to upload.'
      )
      return
    }

    const defaultCover =
      addMode === 'youtube'
        ? 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=150&auto=format&fit=crop&q=60'
        : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60'

    const newTrack: TrackItem = {
      title: title.trim(),
      artist:
        artist.trim() ||
        (addMode === 'youtube' ? 'YouTube Stream' : 'Local Audio File'),
      url: url.trim(),
      cover: cover.trim() || defaultCover,
      category: category.trim() || 'General',
    }

    addTrack(newTrack)
    setTitle('')
    setArtist('')
    setUrl('')
    setCover('')
    setSelectedFile(null)
    setSuccess('Track added successfully to the playlist!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handlePlayToggle = (idx: number) => {
    if (idx === currentTrackIndex) {
      setIsPlaying(!isPlaying)
    } else {
      playTrack(idx)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 bg-ns-bg pb-8">
      {/* Header section */}
      <section className="relative overflow-hidden rounded-xl border border-ns-border bg-ns-panel p-6 shadow-lg">
        <div className="ns-hero-blur-purple-25 pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full opacity-20" />
        <div className="relative">
          <p className="text-ns-primary-lt mb-1 text-[0.65rem] font-bold tracking-[0.12em] uppercase">
            Media Studio
          </p>
          <h1 className="mb-2 flex items-center gap-2 text-xl font-bold text-ns-text">
            <span>Music Manager</span>
            <Radio size={18} className="text-ns-primary-lt animate-pulse" />
          </h1>
          <p className="max-w-2xl text-xs leading-5 text-ns-muted">
            Upload new audio streams, configure group genres (Lofi, Chill,
            US-UK), and manage playlist tracks dynamically.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Add Track Form */}
        <div className="flex flex-col gap-4 rounded-xl border border-ns-border bg-ns-panel p-5 shadow-md lg:col-span-5">
          <div>
            <h2 className="text-xs font-bold tracking-wider text-ns-text uppercase">
              Add New Track
            </h2>
            <p className="mt-1 text-[0.65rem] text-ns-faint">
              Configure stream properties and assign it to a group category.
            </p>
          </div>

          {/* Source Mode Toggle */}
          <div className="flex rounded-lg border border-ns-border/30 bg-ns-input p-0.5">
            <button
              onClick={() => handleModeChange('youtube')}
              type="button"
              className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md py-1.5 text-[0.62rem] font-bold tracking-wider uppercase transition-all ${
                addMode === 'youtube'
                  ? 'text-ns-primary-lt bg-ns-active shadow-inner'
                  : 'text-ns-faint'
              }`}
            >
              <Youtube size={12} />
              <span>YouTube Link</span>
            </button>
            <button
              onClick={() => handleModeChange('mp3')}
              type="button"
              className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md py-1.5 text-[0.62rem] font-bold tracking-wider uppercase transition-all ${
                addMode === 'mp3'
                  ? 'text-ns-primary-lt bg-ns-active shadow-inner'
                  : 'text-ns-faint'
              }`}
            >
              <Music size={12} />
              <span>Local MP3 File</span>
            </button>
          </div>

          <form onSubmit={handleAddTrack} className="flex flex-col gap-3.5">
            {/* Title field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="track-title"
                className="text-[0.6rem] font-bold text-ns-muted uppercase"
              >
                Track Title *
              </label>
              <input
                id="track-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midnight Coding Beats"
                className="focus:border-ns-primary rounded-lg border border-ns-border-soft bg-ns-input px-3 py-2 text-xs text-ns-text placeholder-ns-placeholder transition-colors outline-none"
                required
              />
            </div>

            {/* Artist field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="track-artist"
                className="text-[0.6rem] font-bold text-ns-muted uppercase"
              >
                Artist / Creator
              </label>
              <input
                id="track-artist"
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="e.g. Lofi Girl"
                className="focus:border-ns-primary rounded-lg border border-ns-border-soft bg-ns-input px-3 py-2 text-xs text-ns-text placeholder-ns-placeholder transition-colors outline-none"
              />
            </div>

            {/* URL field or File Upload */}
            {addMode === 'youtube' ? (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="track-url"
                  className="text-[0.6rem] font-bold text-ns-muted uppercase"
                >
                  YouTube Video URL *
                </label>
                <input
                  id="track-url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="focus:border-ns-primary rounded-lg border border-ns-border-soft bg-ns-input px-3 py-2 text-xs text-ns-text placeholder-ns-placeholder transition-colors outline-none"
                  required
                />
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.6rem] font-bold text-ns-muted uppercase">
                  Upload MP3 File *
                </label>
                <div className="hover:border-ns-primary/50 relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ns-border-soft bg-ns-bg/30 p-4 text-center transition-all">
                  <input
                    type="file"
                    accept="audio/*,audio/mp3"
                    onChange={handleFileChange}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    required
                  />
                  <Music size={20} className="text-ns-ghost" />
                  <span className="max-w-full truncate px-2 text-[0.7rem] font-semibold text-ns-text">
                    {selectedFile
                      ? selectedFile.name
                      : 'Choose audio file or drag & drop'}
                  </span>
                  <span className="text-[0.58rem] text-ns-faint">
                    MP3, WAV, or OGG up to 20MB
                  </span>
                </div>
              </div>
            )}

            {/* Cover Image field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="track-cover"
                className="flex items-center gap-1 text-[0.6rem] font-bold text-ns-muted uppercase"
              >
                <ImageIcon size={10} />
                <span>Cover Image URL (Optional)</span>
              </label>
              <input
                id="track-cover"
                type="text"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="focus:border-ns-primary rounded-lg border border-ns-border-soft bg-ns-input px-3 py-2 text-xs text-ns-text placeholder-ns-placeholder transition-colors outline-none"
              />
            </div>

            {/* Category / Group field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="track-category"
                className="flex items-center gap-1 text-[0.6rem] font-bold text-ns-muted uppercase"
              >
                <Tag size={10} />
                <span>Group / Category</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="track-category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Lofi, Chill, US-UK"
                  className="focus:border-ns-primary flex-1 rounded-lg border border-ns-border-soft bg-ns-input px-3 py-2 text-xs text-ns-text placeholder-ns-placeholder transition-colors outline-none"
                />
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {['Lofi', 'Chill', 'US-UK', 'Focus', 'Coding'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setCategory(preset)}
                    type="button"
                    className={`cursor-pointer rounded border px-2 py-0.5 text-[0.58rem] font-bold transition-all ${
                      category === preset
                        ? 'border-ns-primary text-ns-primary-lt bg-ns-active/40'
                        : 'border-ns-border-soft bg-ns-bg/40 text-ns-faint hover:text-ns-muted'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/10 bg-red-500/5 p-2.5 text-[0.68rem] font-bold text-red-400">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-2.5 text-[0.68rem] font-bold text-emerald-400">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="from-ns-primary shadow-ns-primary/15 mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r to-ns-secondary py-2.5 text-xs font-bold text-white shadow-md transition-all hover:opacity-90"
            >
              <Plus size={14} />
              <span>Add Track</span>
            </button>
          </form>
        </div>

        {/* Right Column: Playlist Tracks Table */}
        <div className="flex flex-col gap-4 rounded-xl border border-ns-border bg-ns-panel p-5 shadow-md lg:col-span-7">
          <div className="flex items-center justify-between border-b border-ns-border-soft pb-3.5">
            <div>
              <h2 className="text-xs font-bold tracking-wider text-ns-text uppercase">
                Active Playlist
              </h2>
              <p className="mt-1 text-[0.65rem] text-ns-faint">
                Filtered: {filteredPlaylist.length} of {playlist.length} total
                tracks
              </p>
            </div>

            {/* Category tabs */}
            <div className="no-scrollbar flex max-w-[50%] gap-1 overflow-x-auto pb-0.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer rounded-lg px-2.5 py-1 text-[0.6rem] font-bold transition-all ${
                    selectedCategory === cat
                      ? 'text-ns-primary-lt bg-ns-active shadow-inner'
                      : 'text-ns-muted hover:bg-ns-hover/50 hover:text-ns-text-2'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tracks List */}
          <div className="no-scrollbar flex max-h-[500px] flex-col gap-2.5 overflow-y-auto pr-1">
            {filteredPlaylist.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-ns-ghost">
                <Music size={28} className="mb-3 animate-bounce stroke-1" />
                <p className="text-xs font-bold tracking-wider text-ns-muted uppercase">
                  No Tracks Found
                </p>
                <p className="mt-1 text-[0.65rem] text-ns-faint">
                  Add a new track in the left panel to get started.
                </p>
              </div>
            ) : (
              filteredPlaylist.map((track) => {
                const originalIndex = playlist.findIndex(
                  (t) => t.url === track.url
                )
                const isActive = originalIndex === currentTrackIndex

                return (
                  <div
                    key={`${track.title}-${originalIndex}`}
                    className={`animate-fade-in group flex items-center gap-4 rounded-xl border p-3 transition-all ${
                      isActive
                        ? 'border-ns-border-em bg-gradient-to-br from-ns-active/20 to-ns-hover/10'
                        : 'border-ns-border bg-ns-bg/30 hover:border-ns-border-md'
                    }`}
                  >
                    {/* Artwork / Play State Button */}
                    <div
                      onClick={() => handlePlayToggle(originalIndex)}
                      className="from-ns-primary/30 group/art relative h-11 w-11 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border border-ns-border bg-gradient-to-br to-ns-secondary/30 shadow-inner"
                    >
                      {track.cover && (
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url('${track.cover}')` }}
                        />
                      )}

                      {/* Play/Pause hover overlay */}
                      <div
                        className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-all ${
                          isActive
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100 group-hover/art:opacity-100'
                        }`}
                      >
                        {isActive && isPlaying ? (
                          <Pause
                            size={14}
                            fill="white"
                            className="animate-pulse text-white"
                          />
                        ) : (
                          <Play
                            size={14}
                            fill="white"
                            className="ml-0.5 text-white"
                          />
                        )}
                      </div>
                    </div>

                    {/* Track info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`truncate text-xs font-bold ${isActive ? 'text-ns-primary-lt' : 'text-ns-text'}`}
                        >
                          {track.title}
                        </span>
                        {track.category && (
                          <span className="text-ns-primary-lt flex-shrink-0 rounded-md border border-ns-border/40 bg-ns-hover/80 px-1.5 py-0.5 text-[0.55rem] font-bold">
                            {track.category}
                          </span>
                        )}
                      </div>
                      <span className="mt-0.5 block text-[0.62rem] font-medium text-ns-faint">
                        {track.artist}
                      </span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2.5">
                      {/* Open Source URL */}
                      <a
                        href={track.url}
                        target="_blank"
                        rel="noreferrer"
                        className="cursor-pointer rounded-lg p-1.5 text-ns-ghost transition-colors hover:bg-ns-hover hover:text-ns-text"
                        title="Open source URL"
                      >
                        <ExternalLink size={12} />
                      </a>

                      {/* Delete Track */}
                      <button
                        onClick={() => removeTrack(originalIndex)}
                        className="cursor-pointer rounded-lg border border-transparent p-1.5 text-ns-ghost transition-colors hover:border-red-500/10 hover:bg-red-500/5 hover:text-red-400"
                        title="Remove track"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
