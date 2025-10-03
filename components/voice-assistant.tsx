"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX, Languages, Loader2 } from "lucide-react"
import { voiceService, type SpeechRecognitionResult } from "@/lib/voice-service"
import { useTranslation } from "@/lib/i18n"

interface VoiceAssistantProps {
  onCommand?: (command: string, language: string) => void
  className?: string
}

export function VoiceAssistant({ onCommand, className }: VoiceAssistantProps) {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language
  const setLanguage = (lng: string) => i18n.changeLanguage(lng)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [voiceLanguage, setVoiceLanguage] = useState<"en-US" | "rw-RW">("en-US")

  useEffect(() => {
    setVoiceLanguage(currentLanguage === "en" ? "en-US" : "rw-RW")
  }, [currentLanguage])

  const startListening = async () => {
    try {
      setError(null)
      setTranscript("")
      setConfidence(0)

      await voiceService.startListening(
        { language: voiceLanguage },
        (result: SpeechRecognitionResult) => {
          setTranscript(result.transcript)
          setConfidence(result.confidence)

          if (result.isFinal && result.transcript.trim()) {
            console.log("[v0] Final transcript:", result.transcript)
            if (onCommand) {
              onCommand(result.transcript, voiceLanguage)
            }
            processVoiceCommand(result.transcript)
          }
        },
        (error) => {
          // Map common errors to localized, user-friendly messages
          const message =
            error === "mic-permission-denied"
              ? t("Microphone permission denied. Please allow mic access and try again.")
              : error === "speech-recognition-not-available"
              ? t("Speech recognition is not available in this browser.")
              : error === "recognition-network-error"
              ? t("Network error during recognition. Check your connection.")
              : t("An error occurred with speech recognition.")
          setError(message)
          setIsListening(false)
        },
      )

      setIsListening(true)
    } catch (error) {
      setError("Speech recognition not supported")
      console.error("[v0] Voice recognition error:", error)
    }
  }

  const stopListening = () => {
    voiceService.stopListening()
    setIsListening(false)
  }

  const processVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase()

    // Basic voice commands
    if (lowerCommand.includes("market") || lowerCommand.includes("isoko")) {
      await speak(t("Opening marketplace"))
      window.location.href = "/marketplace"
    } else if (lowerCommand.includes("dashboard") || lowerCommand.includes("ikibaho")) {
      await speak(t("Opening dashboard"))
      window.location.href = "/dashboard"
    } else if (lowerCommand.includes("payment") || lowerCommand.includes("kwishyura")) {
      await speak(t("Opening payments"))
      window.location.href = "/transactions"
    } else if (lowerCommand.includes("help") || lowerCommand.includes("ubufasha")) {
      await speak(t("How can I help you with your farming needs?"))
    } else {
      await speak(t("I didn't understand that command. Try saying 'market', 'dashboard', or 'help'"))
    }
  }

  const speak = async (text: string) => {
    try {
      setIsSpeaking(true)
      await voiceService.speak(text, { language: voiceLanguage })
    } catch (error) {
      console.error("[v0] Speech synthesis error:", error)
    } finally {
      setIsSpeaking(false)
    }
  }

  const toggleLanguage = () => {
    const newLang = currentLanguage === "en" ? "rw" : "en"
    setLanguage(newLang)
    speak(
      newLang === "en"
        ? t("Language changed to English")
        : t("Language changed to Kinyarwanda")
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">{t("Voice Assistant")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {currentLanguage === "en" ? "English" : "Kinyarwanda"}
            </Badge>
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="h-6 w-6 p-0">
              <Languages className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {transcript && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm">{transcript}</p>
            {confidence > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {t("Confidence")}: {Math.round(confidence * 100)}%
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="sm"
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
            className="flex-1"
          >
            {isSpeaking ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : isListening ? (
              <MicOff className="h-4 w-4 mr-2" />
            ) : (
              <Mic className="h-4 w-4 mr-2" />
            )}
            {isSpeaking ? t("Speaking...") : isListening ? t("Stop Listening") : t("Start Listening")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => speak(t("Hello! I'm your farming assistant. How can I help you today?"))}
            disabled={isSpeaking || isListening}
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>
            {t("Try saying")}: "{t("Open marketplace")}", "{t("Show dashboard")}", "{t("Help")}"
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
