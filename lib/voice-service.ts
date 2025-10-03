// Voice service for bilingual speech recognition and synthesis
export interface VoiceConfig {
  language: "en-US" | "rw-RW"
  voice?: string
  rate?: number
  pitch?: number
  volume?: number
}

export interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

class VoiceService {
  private synthesis: SpeechSynthesis | null = null
  private recognition: any = null
  private isListening = false
  private currentLanguage: "en-US" | "rw-RW" = "en-US"

  constructor() {
    if (typeof window !== "undefined") {
      this.synthesis = window.speechSynthesis
      this.initializeSpeechRecognition()
    }
  }

  private initializeSpeechRecognition() {
    if (typeof window === "undefined") return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = true
      this.recognition.maxAlternatives = 1
    }
  }

  private async ensureMicPermission(): Promise<void> {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) return
    try {
      // Trigger permission prompt; must be called from a user gesture upstream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Immediately stop tracks to free the mic
      stream.getTracks().forEach((t) => t.stop())
    } catch (err: any) {
      // Surface a standardized error so callers can inform the user
      const code = err?.name || err?.message || "mic-permission-denied"
      throw new Error(code)
    }
  }

  isRecognitionAvailable(): boolean {
    return !!this.recognition
  }

  async speak(text: string, config: VoiceConfig = { language: "en-US" }): Promise<void> {
    if (!this.synthesis) {
      console.warn("[v0] Speech synthesis not available")
      return
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text)

      // Configure voice settings
      utterance.lang = config.language
      utterance.rate = config.rate || 1
      utterance.pitch = config.pitch || 1
      utterance.volume = config.volume || 1

      // Try to find appropriate voice
      const voices = this.synthesis!.getVoices()
      const voice = voices.find(
        (v) =>
          v.lang.startsWith(config.language.split("-")[0]) || (config.language === "rw-RW" && v.lang.includes("sw")), // Fallback to Swahili for Kinyarwanda
      )

      if (voice) {
        utterance.voice = voice
      }

      utterance.onend = () => resolve()
      utterance.onerror = (error) => reject(error)

      this.synthesis!.speak(utterance)
    })
  }

  async startListening(
    config: VoiceConfig = { language: "en-US" },
    onResult?: (result: SpeechRecognitionResult) => void,
    onError?: (error: any) => void,
  ): Promise<void> {
    if (!this.recognition) {
      const msg = "speech-recognition-not-available"
      if (onError) onError(msg)
      throw new Error(msg)
    }

    if (this.isListening) {
      this.stopListening()
    }

    // Request mic permission first (must be invoked in a user gesture context by caller)
    try {
      await this.ensureMicPermission()
    } catch (permErr: any) {
      const code = typeof permErr?.message === "string" ? permErr.message : "mic-permission-denied"
      console.warn("[v0] Mic permission error:", code)
      this.isListening = false
      if (onError) onError(code)
      return
    }

    this.recognition.lang = config.language
    this.currentLanguage = config.language

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1]
      const transcript = result[0].transcript
      const confidence = result[0].confidence

      console.log("[v0] Speech recognition result:", { transcript, confidence, isFinal: result.isFinal })

      if (onResult) {
        onResult({
          transcript,
          confidence,
          isFinal: result.isFinal,
        })
      }
    }

    this.recognition.onerror = (event: any) => {
      const err = event?.error || "unknown"
      // Map common browser errors to friendlier codes
      const mapped = err === "not-allowed"
        ? "mic-permission-denied"
        : err === "aborted"
          ? "recognition-aborted"
          : err === "network"
            ? "recognition-network-error"
            : err
      console.error("[v0] Speech recognition error:", mapped)
      this.isListening = false
      if (onError) onError(mapped)
    }

    this.recognition.onend = () => {
      this.isListening = false
    }

    this.recognition.start()
    this.isListening = true
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening
  }

  // Translate text between English and Kinyarwanda (mock implementation)
  async translateText(text: string, from: string, to: string): Promise<string> {
    type Lang = "en" | "rw"
    type TranslationTable = Record<Lang, Record<Lang, Record<string, string>>>

    // In a real implementation, this would use Google Translate API or similar
    const translations: TranslationTable = {
      en: {
        rw: {
          Hello: "Muraho",
          "Good morning": "Mwaramutse",
          "Good evening": "Mwiriwe",
          "Thank you": "Murakoze",
          Welcome: "Murakaza neza",
          Farm: "Igikoni",
          Crop: "Igihingwa",
          Market: "Isoko",
          Price: "Igiciro",
          Payment: "Kwishyura",
          Farmer: "Umuhinzi",
          Harvest: "Gusarura",
        },
        en: {},
      },
      rw: {
        en: {
          Muraho: "Hello",
          Mwaramutse: "Good morning",
          Mwiriwe: "Good evening",
          Murakoze: "Thank you",
          "Murakaza neza": "Welcome",
          Igikoni: "Farm",
          Igihingwa: "Crop",
          Isoko: "Market",
          Igiciro: "Price",
          Kwishyura: "Payment",
          Umuhinzi: "Farmer",
          Gusarura: "Harvest",
        },
        rw: {},
      },
    }

    const f = (from?.slice(0, 2) || "en") as Lang
    const t = (to?.slice(0, 2) || "en") as Lang
    const translation: string | undefined = translations[f]?.[t]?.[text]
    return translation || text
  }

  // Get available voices for each language
  getAvailableVoices(): { language: string; voices: SpeechSynthesisVoice[] }[] {
    if (!this.synthesis) return []

    const voices = this.synthesis.getVoices()
    const groupedVoices = voices.reduce(
      (acc, voice) => {
        const lang = voice.lang.split("-")[0]
        if (!acc[lang]) acc[lang] = []
        acc[lang].push(voice)
        return acc
      },
      {} as Record<string, SpeechSynthesisVoice[]>,
    )

    return Object.entries(groupedVoices).map(([language, voices]) => ({
      language,
      voices,
    }))
  }
}

export const voiceService = new VoiceService()
