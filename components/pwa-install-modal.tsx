"use client"

import React, { useState, useEffect } from "react"
import { X, Share, Plus, Download } from "lucide-react"

export default function PwaInstallModal() {
  const [show, setShow] = useState(false)
  const [platform, setPlatform] = useState<"ios" | "android" | null>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Don't show if already installed as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) return
    // Don't show if already dismissed
    if (localStorage.getItem("pwa-install-dismissed")) return

    // Detect platform
    const ua = navigator.userAgent
    const isIos = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    const isAndroid = /Android/.test(ua)

    if (isIos) {
      setPlatform("ios")
      // Small delay so page loads first
      setTimeout(() => setShow(true), 1500)
    } else if (isAndroid) {
      setPlatform("android")
    }

    // Listen for Android install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setPlatform("android")
      setTimeout(() => setShow(true), 1500)
    }
    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstallAndroid = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === "accepted") {
      handleDismiss()
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem("pwa-install-dismissed", "true")
  }

  if (!show || !platform) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm mx-4 mb-4 sm:mb-0 bg-white rounded-[24px] shadow-2xl overflow-hidden animate-slideUp">
        {/* Background image */}
        <div className="relative h-44 overflow-hidden">
          <img
            src="/top-view-food-ingredients-with-notebook-pumpkin.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>

          {/* App icon */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 shadow-xl flex items-center justify-center border-4 border-white">
              <img src="/chef-hat-icon.svg" alt="RecipeApp" className="w-8 h-8 brightness-0 invert" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-12 pb-6 text-center">
          <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-1">
            RecipeApp installieren
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Schneller Zugriff direkt vom Startbildschirm
          </p>

          {platform === "android" ? (
            /* Android: Install button */
            <button
              onClick={handleInstallAndroid}
              className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold text-[15px] shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mb-3"
            >
              <Download className="h-5 w-5" />
              App installieren
            </button>
          ) : (
            /* iOS: Instructions */
            <div className="space-y-4 mb-3">
              <div className="flex items-start gap-4 text-left">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">
                    Teilen-Button antippen
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>Tippen Sie auf</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100">
                      <Share className="h-3.5 w-3.5 text-blue-600" />
                    </span>
                    <span>in der Browserleiste</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">
                    &quot;Zum Home-Bildschirm&quot;
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>Wählen Sie</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100">
                      <Plus className="h-3.5 w-3.5 text-gray-600" />
                    </span>
                    <span>&quot;Zum Home-Bildschirm&quot;</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleDismiss}
            className="w-full h-10 rounded-xl text-gray-500 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Später
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
