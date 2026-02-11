"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Camera,
  Upload,
  Scan,
  ChefHat,
  ArrowRight,
  Users,
  Heart,
  BookOpen,
  LogOut,
  Shield,
  Plus,
  Send,
  Utensils,
  MessageCircle,
  Bot,
  Brain,
  Search,
  Download,
  Sparkles,
  Edit,
} from "lucide-react"

interface HomeDashboardProps {
  onStartDigitalization: () => void
  handleLogout: () => void
  onOpenArchive: () => void
  onOpenUsers: () => void
  onOpenManualRecipes?: () => void
  userRole: "admin" | "worker" | "guest" | null
  onBackToLanding?: () => void
}

export default function HomeDashboard({
  onStartDigitalization,
  handleLogout,
  onOpenArchive,
  onOpenUsers,
  onOpenManualRecipes,
  userRole,
  onBackToLanding,
}: HomeDashboardProps) {
  const router = useRouter()
  const [pendingNotifications, setPendingNotifications] = useState(0)
  const [pendingRecipes, setPendingRecipes] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  // Load pending recipes notifications (only for admin)
  useEffect(() => {
    const loadPendingRecipes = async () => {
      if (userRole !== 'admin') return

      try {
        const response = await fetch('https://web.lweb.ch/recipedigitalizer/apis/pending-recipes.php', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-cache'
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            const pendingCount = result.data.length

            // Fix user names - convert "Usuario #3182" to proper names
            const fixedRecipes = result.data.map((recipe: any) => {
              let displayUserName = recipe.user_name || 'Unbekannt'

              // SIEMPRE convertir Usuario # a Admin
              if (displayUserName.includes('Usuario #') || displayUserName.startsWith('Usuario #')) {
                displayUserName = 'Admin'
                console.log('Converting', recipe.user_name, 'to Admin in notifications')
              }

              return {
                ...recipe,
                user_name: displayUserName
              }
            })

            setPendingNotifications(pendingCount)
            setPendingRecipes(fixedRecipes)
          } else {
            setPendingNotifications(0)
            setPendingRecipes([])
          }
        }
      } catch (error) {
        console.error('Error loading pending recipes:', error)
        setPendingNotifications(0)
        setPendingRecipes([])
      }
    }

    loadPendingRecipes()
  }, [userRole])

  const handleNotificationClick = () => {
    // Close dropdown and navigate to admin panel pending recipes view
    setShowNotifications(false)
    router.push('/admin?view=pending')
  }

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications) {
        const target = event.target as HTMLElement
        if (!target.closest('[data-notification-dropdown]')) {
          setShowNotifications(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  return (
    <div className="min-h-screen bg-blue-50 overflow-x-hidden">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-indigo-100/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/1e9739e5-a2a7-4218-8384-5602515adbb7.png" alt="RezeptApp" className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-cover" />
            <div className="leading-none">
              <span className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">Rezeptsammlung</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Bell - Only for Admin */}
            {userRole === 'admin' && pendingNotifications > 0 && (
              <div className="relative" data-notification-dropdown>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
                >
                  <Shield className="h-5 w-5 text-blue-600" />
                  {pendingNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 font-semibold">
                      {pendingNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-[20px] shadow-[0_12px_32px_rgba(0,0,0,0.1)] border border-blue-100/60 z-50">
                    <div className="p-5 border-b border-gray-100">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        Ausstehende Rezepte
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {pendingRecipes.length === 0 ? (
                        <div className="p-5 text-center text-gray-500">
                          Keine ausstehenden Rezepte
                        </div>
                      ) : (
                        pendingRecipes.slice(0, 5).map((recipe: any) => (
                          <div
                            key={recipe.id}
                            onClick={handleNotificationClick}
                            className="p-4 border-b border-gray-50 cursor-pointer hover:bg-blue-50/40 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                                <ChefHat className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">
                                  {recipe.title || 'Neues Rezept'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Von: {recipe.user_name || 'Unbekannt'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(recipe.created_at || Date.now()).toLocaleDateString('de-DE')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {pendingRecipes.length > 0 && (
                      <div className="p-4 border-t border-gray-100">
                        <button
                          onClick={handleNotificationClick}
                          className="w-full h-10 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Alle anzeigen ({pendingNotifications})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Admin Panel Chip - Only for Admin */}
            {userRole === "admin" && (
              <button
                onClick={() => router.push("/admin")}
                className="h-10 px-4 rounded-xl bg-blue-50 flex items-center gap-2 hover:bg-blue-100 transition-colors border border-blue-100"
              >
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Admin</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
            >
              <LogOut className="h-5 w-5 text-red-500" />
            </button>
          </div>
        </div>
        {/* Gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent translate-y-full pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-12">
        {/* Hero badge */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Powered by Chat GPT</span>
          </div>
        </div>

        {/* Digitalisieren & Manuelle cards (admin/worker only) */}
        {(userRole === "admin" || userRole === "worker") && (
          <div className="mb-8">
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
              {/* Rezepte Digitalisieren */}
              <div
                className="bg-white rounded-[20px] p-7 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-[250ms] cursor-pointer group"
                onClick={onStartDigitalization}
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-[250ms]">
                  <Scan className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Rezepte Digitalisieren</h3>
                <p className="text-[15px] text-gray-500 leading-relaxed mb-5">
                  Scannen oder fotografieren Sie Ihre Rezepte, um sie zu digitalisieren
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[15px] text-gray-500">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                      <Camera className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <span>Foto machen</span>
                  </div>
                  <div className="flex items-center gap-3 text-[15px] text-gray-500">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                      <Upload className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <span>Bild hochladen</span>
                  </div>
                  <div className="flex items-center gap-3 text-[15px] text-gray-500">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                      <Scan className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <span>Scannen</span>
                  </div>
                </div>
              </div>

              {/* Manuelle Rezepte */}
              {onOpenManualRecipes && (
                <div
                  className="bg-white rounded-[20px] p-7 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-[250ms] cursor-pointer group"
                  onClick={onOpenManualRecipes}
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-[250ms]">
                    <Edit className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Manuelle Rezepte</h3>
                  <p className="text-[15px] text-gray-500 leading-relaxed mb-5">
                    Erstellen Sie Rezepte von Hand mit unserem benutzerfreundlichen Formular
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[15px] text-gray-500">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                        <Edit className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <span>Rezept schreiben</span>
                    </div>
                    <div className="flex items-center gap-3 text-[15px] text-gray-500">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                        <Plus className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <span>Zutaten hinzufügen</span>
                    </div>
                    <div className="flex items-center gap-3 text-[15px] text-gray-500">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                        <Send className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <span>An Admin senden</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rezept Archiv - Full width, green pastel */}
        <div className="mb-8">
          <div
            className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-[20px] p-7 border border-emerald-100/60 hover:border-emerald-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-[250ms] cursor-pointer group"
            onClick={onOpenArchive}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-[250ms]">
                  <BookOpen className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Rezept Archiv</h3>
                  <p className="text-[15px] text-gray-500 leading-relaxed">
                    {userRole === 'guest'
                      ? 'Rezepte ansehen und durchsuchen'
                      : 'Ihre digitalisierten Rezepte nach Kategorien organisieren und bearbeiten'
                    }
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {userRole === 'guest' ? (
                  <>
                    <div className="flex items-center gap-2 text-[14px] text-gray-500">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                        <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                      </div>
                      <span>Rezepte ansehen</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px] text-gray-500">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Search className="h-3.5 w-3.5 text-emerald-500" />
                      </div>
                      <span>Durchsuchen</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px] text-gray-500">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                      </div>
                      <span>Kommentare</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px] text-gray-500">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Download className="h-3.5 w-3.5 text-emerald-500" />
                      </div>
                      <span>Herunterladen</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-[14px] text-gray-500">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                        <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                      </div>
                      <span>Rezepte verwalten</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px] text-gray-500">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                        <ChefHat className="h-3.5 w-3.5 text-emerald-500" />
                      </div>
                      <span>Kategorien</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px] text-gray-500">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Heart className="h-3.5 w-3.5 text-emerald-500" />
                      </div>
                      <span>Favoriten</span>
                    </div>
                  </>
                )}
              </div>
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 flex-shrink-0 group-hover:bg-emerald-200 transition-colors">
                <ArrowRight className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Profil cards */}
        <div
          className={`grid gap-5 mb-8 ${
            userRole === "worker"
              ? "grid-cols-1 max-w-2xl mx-auto"
              : "hidden"
          }`}
        >

          {/* Benutzer Profil (worker) */}
          {userRole === "worker" && (
            <div
              className="bg-white rounded-[20px] p-7 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-[250ms] cursor-pointer group"
              onClick={onOpenUsers}
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-[250ms]">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Benutzer Profil</h3>
              <p className="text-[15px] text-gray-500 leading-relaxed mb-5">
                Eigene Rezepte erstellen, verwalten und zur Sammlung beitragen
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[15px] text-gray-500">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                    <Plus className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <span>Rezepte erstellen</span>
                </div>
                <div className="flex items-center gap-3 text-[15px] text-gray-500">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                    <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <span>Eigene Sammlung</span>
                </div>
                <div className="flex items-center gap-3 text-[15px] text-gray-500">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                    <Send className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <span>Admin Freigabe</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* KI-Funktionen Section (admin only) */}
        {userRole === "admin" && (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-blue-50 via-sky-50/60 to-indigo-50 rounded-[20px] border border-blue-100/60 p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      KI-Funktionen
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Künstliche Intelligenz für Ihre Küche</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-full">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">Admin</span>
                </div>
              </div>

              {/* KI Sub-cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Rezepte mit KI erstellen */}
                <div className="bg-white rounded-[20px] p-7 border border-transparent hover:border-blue-100 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-[250ms] cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">
                        Rezepte mit KI erstellen
                      </h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full mb-3">
                        <Sparkles className="h-3 w-3 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700">Bald verfügbar</span>
                      </div>
                      <p className="text-[15px] text-gray-500 leading-relaxed">
                        Lassen Sie unsere KI neue, kreative Rezepte für Sie entwickeln
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gericht Analysieren */}
                <div className="bg-white rounded-[20px] p-7 border border-transparent hover:border-blue-100 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-[250ms] cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Utensils className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">
                        Gericht Analysieren
                      </h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full mb-3">
                        <Utensils className="h-3 w-3 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700">Bald verfügbar</span>
                      </div>
                      <p className="text-[15px] text-gray-500 leading-relaxed">
                        Fotografieren Sie ein Gericht und erhalten Sie das passende Rezept
                      </p>
                    </div>
                  </div>
                </div>

                {/* Koch-Experte Chat */}
                <div className="bg-white rounded-[20px] p-7 border border-transparent hover:border-blue-100 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-[250ms] cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">
                        Koch-Experte Chat
                      </h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full mb-3">
                        <Bot className="h-3 w-3 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700">Bald verfügbar</span>
                      </div>
                      <p className="text-[15px] text-gray-500 leading-relaxed">
                        Stellen Sie Fragen an unseren KI-Koch-Experten
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
