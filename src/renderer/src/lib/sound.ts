// src/renderer/src/lib/sound.ts
// Offline Web Audio API Synthesizer for notifications and Pomodoro chimes

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioCtx = new AudioContextClass()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Phát âm thanh chuông "Ting" to, trong trẻo, vang tự nhiên (bell/chime harmonic sound)
 * Hoạt động 100% offline không cần file mp3/wav ngoài.
 */
export function playTingSound(volume: number = 0.9): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // Master Gain
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.001, now)
    masterGain.gain.exponentialRampToValueAtTime(Math.min(1.0, Math.max(0.1, volume)), now + 0.02)
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8)
    masterGain.connect(ctx.destination)

    // Primary bell tone (C6: ~1046.5 Hz)
    const osc1 = ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(1046.5, now)
    // slight natural pitch bend down
    osc1.frequency.exponentialRampToValueAtTime(1040.0, now + 1.8)

    const gain1 = ctx.createGain()
    gain1.gain.setValueAtTime(0.8, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.6)

    osc1.connect(gain1)
    gain1.connect(masterGain)

    // Secondary harmonic (C7: ~2093 Hz) - gives the crisp "Ting" chime sparkle
    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(2093.0, now)

    const gain2 = ctx.createGain()
    gain2.gain.setValueAtTime(0.5, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2)

    osc2.connect(gain2)
    gain2.connect(masterGain)

    // Third crystalline overtone (E7: ~2637 Hz) - bright attack
    const osc3 = ctx.createOscillator()
    osc3.type = 'triangle'
    osc3.frequency.setValueAtTime(2637.0, now)

    const gain3 = ctx.createGain()
    gain3.gain.setValueAtTime(0.25, now)
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    osc3.connect(gain3)
    gain3.connect(masterGain)

    // Start & Stop
    osc1.start(now)
    osc2.start(now)
    osc3.start(now)

    osc1.stop(now + 1.9)
    osc2.stop(now + 1.9)
    osc3.stop(now + 1.9)
  } catch (err) {
    console.error('Failed to play chime sound:', err)
  }
}
