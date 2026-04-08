"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"

// Usamos la ruta local. Si renombras el archivo a musica.mp3, cambialo acá.
const AUDIO_URL = "/PAWSA - BANG BANG (feat. Malachiii).mp3"

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(AUDIO_URL)
    audio.loop = true
    audio.volume = 0.2 // Le subí un poquito el volumen (estaba en 0.1)
    
    // Quitamos el inicio en el segundo 150 para que el nuevo tema empiece de cero
    audio.onloadedmetadata = () => {
      audio.currentTime = 0
    }

    audioRef.current = audio

    return () => {
      if (audio) {
        audio.pause()
        audioRef.current = null
      }
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(console.error)
    }
    setIsPlaying(!isPlaying)
    setHasInteracted(true)
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.5 }}
      onClick={togglePlay}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 rounded-full bg-card border border-border hover:border-primary/50 transition-all duration-300 shadow-lg group"
      aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
    >
      <div className="flex items-center gap-1 h-4">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-0.5 bg-primary rounded-full"
            animate={
              isPlaying
                ? { height: [4, 16, 8, 12, 4] }
                : { height: 4 }
            }
            transition={
              isPlaying
                ? {
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }
                : { duration: 0.3 }
            }
          />
        ))}
      </div>

      {isPlaying ? (
        <Volume2 className="w-5 h-5 text-primary" />
      ) : (
        <VolumeX className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      )}

      {!hasInteracted && (
        <span className="text-sm text-muted-foreground hidden md:block">
          Música
        </span>
      )}
    </motion.button>
  )
}