"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Shield,
  Users,
  ChefHat,
  Bell,
  Eye,
  Clock,
  AlertTriangle,
  Brain,
  Sparkles,
  MessageCircle,
  Bot,
  Utensils,
} from "lucide-react"
import RecipeManagement from "./recipe-management"
import UserManagement from "./user-management"
import SubAdminManagement from "./sub-admin-management"
import PendingRecipes from "./pending-recipes"
import type { PendingRecipe, User, SubAdmin } from "@/types" // Declare types
import { UserService } from "@/lib/services/userService"
import { RecipeService } from "@/lib/services/recipeService"

export default function AdminDashboard() {
  const router = useRouter()

  const [currentView, setCurrentView] = useState<"dashboard" | "recipes" | "users" | "subadmins" | "pending">(
    "dashboard",
  )
  const [pendingRecipes, setPendingRecipes] = useState<PendingRecipe[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([])
  const [notifications, setNotifications] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [totalRecipes, setTotalRecipes] = useState(0)

  // Check URL parameters for direct navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const view = urlParams.get('view')
    if (view === 'pending') {
      setCurrentView('pending')
      console.log('🚀 Navigating directly to pending recipes from URL parameter')
    }
  }, [])

  // Load users and data from database on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Load users from database
        const usersFromDB = await UserService.getAllUsers()
        console.log('👥 Usuarios cargados desde BD:', usersFromDB)

        // Transform users to match the UI interface (filter out 'user' role)
        const transformedUsers = usersFromDB
          .filter(user => ['admin', 'worker', 'guest'].includes(user.role)) // Only include valid roles
          .map(user => ({
            id: user.id ? user.id.toString() : `user_${Date.now()}`,
            name: user.name || user.username || 'Sin nombre',
            email: user.email,
            role: user.role as 'admin' | 'worker' | 'guest',
            status: (user.active === 1 || user.active === true || user.status === 'active') ? 'active' : 'inactive' as 'active' | 'inactive',
            lastLogin: user.last_active || user.last_login || new Date().toISOString().split('T')[0],
            recipesCount: user.recipes_created || 0,
            joinDate: user.created_at ? user.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
          }))

        setUsers(transformedUsers)

        // Load sub-admins from database
        const subAdminsFromDB = await UserService.getAllSubAdmins()
        console.log('🛡️ Sub-admins cargados desde BD:', subAdminsFromDB)

        // Transform sub-admins to match UI interface
        const transformedSubAdmins = subAdminsFromDB.map(subAdmin => ({
          id: subAdmin.id?.toString() || subAdmin.sub_admin_id,
          name: subAdmin.name,
          email: subAdmin.email,
          permissions: subAdmin.permissions,
          createdDate: subAdmin.created_at ? subAdmin.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          status: subAdmin.status as 'active' | 'inactive',
          lastLogin: new Date().toISOString().split('T')[0]
        }))

        setSubAdmins(transformedSubAdmins)

        // Load approved recipes count
        const recipesFromDB = await RecipeService.getAll()
        const approvedCount = recipesFromDB.length // Todos los de 'recipes' son aprobados
        setTotalRecipes(approvedCount)

        // Load PENDING recipes from pending-recipes API
        try {
          const pendingResponse = await fetch('https://web.lweb.ch/recipedigitalizer/apis/pending-recipes.php', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-cache'
          })

          if (pendingResponse.ok) {
            const pendingResult = await pendingResponse.json()
            if (pendingResult.success && pendingResult.data) {
              const pendingCount = pendingResult.data.length
              setNotifications(pendingCount)

              // Set pending recipes for the component
              const pendingRecipesList = pendingResult.data.map((r: any) => ({
                id: r.id,
                title: r.title || 'Sin título',
                author: r.user_name || 'Desconocido',
                user: r.user_name || 'Desconocido',
                date: r.created_at || new Date().toISOString(),
                submittedAt: r.created_at || new Date().toISOString(),
                status: 'pending' as const,
                image: r.image_url || r.image_base64 || '',
                analysis: r.analysis || ''
              }))
              setPendingRecipes(pendingRecipesList)
            } else {
              console.log('No pending recipes found')
              setNotifications(0)
              setPendingRecipes([])
            }
          }
        } catch (pendingError) {
          console.error('Error loading pending recipes:', pendingError)
          setNotifications(0)
          setPendingRecipes([])
        }

      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleBackToMain = () => {
    setIsNavigating(true)
    router.push("/")
  }

  const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    color,
    onClick,
  }: {
    title: string
    value: string | number
    description: string
    icon: any
    color: string
    onClick?: () => void
  }) => (
    <div
      className={`bg-white rounded-[20px] p-7 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-[250ms] ${onClick ? "cursor-pointer" : ""} group`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-[250ms]`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-semibold">
          {value}
        </span>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-[15px] text-gray-500 leading-relaxed">{description}</p>
    </div>
  )

  const DashboardView = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
        <StatCard
          title="Ausstehende Rezepte"
          value={pendingRecipes.filter((r) => r.status === "pending").length}
          description="Neue Rezepte zur Überprüfung"
          icon={Clock}
          color="bg-amber-500"
          onClick={() => setCurrentView("pending")}
        />
        <StatCard
          title="Aktive Benutzer"
          value={users.filter((u) => u.status === "active").length}
          description="Registrierte Benutzer"
          icon={Users}
          color="bg-blue-500"
          onClick={() => setCurrentView("users")}
        />
        <StatCard
          title="Gesamte Rezepte"
          value={totalRecipes}
          description="Genehmigte Rezepte"
          icon={ChefHat}
          color="bg-green-500"
          onClick={() => router.push("/recipe-archive")}
        />

      </div>

      {notifications > 0 && (
        <div className="bg-white rounded-[20px] p-7 border border-blue-100/60">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Wichtige Benachrichtigungen</h3>
            <span className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded-full font-semibold">{notifications}</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-100/60">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="text-[15px] font-medium text-gray-800">{notifications} Rezepte warten auf Genehmigung</span>
              </div>
              <button
                onClick={() => setCurrentView("pending")}
                className="h-9 px-4 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
              >
                <Eye className="h-4 w-4" />
                Überprüfen
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[20px] p-7 border border-blue-100/60">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-gray-800">Letzte Aktivitäten</h3>
          <p className="text-[15px] text-gray-500">Neueste Aktionen im System</p>
        </div>
        <div className="space-y-3">
          {pendingRecipes.slice(0, 3).map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100/60"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <ChefHat className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{recipe.title}</p>
                  <p className="text-sm text-gray-500">Gesendet von {recipe.user}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">
                  Ausstehend
                </span>
                <span className="text-sm text-gray-500">{recipe.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
  )

  return (
    <div className="min-h-screen bg-blue-50 overflow-x-hidden">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToMain}
              disabled={isNavigating}
              className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors disabled:opacity-50"
              title="Zurück zur Startseite"
            >
              <ArrowLeft className={`h-5 w-5 text-blue-600 ${isNavigating ? "animate-pulse" : ""}`} />
            </button>
            <img src="/1e9739e5-a2a7-4218-8384-5602515adbb7.png" alt="RezeptApp" className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-cover" />
            <div className="leading-none">
              <span className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">Rezeptsammlung</span>
              <span className="text-lg sm:text-xl font-extrabold text-blue-600 tracking-tight"> App</span>
            </div>
          </div>
        </div>
        {/* Gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent translate-y-full pointer-events-none" />
      </div>

      {currentView !== "dashboard" && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm border-b border-blue-100/60">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView("dashboard")}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl px-3 py-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </button>
              <div className="text-sm font-medium text-gray-500">
                / {currentView === "recipes" && "Rezepteverwaltung"}
                {currentView === "users" && "Benutzerverwaltung"}
                {currentView === "subadmins" && "Sub-Administratoren"}
                {currentView === "pending" && "Ausstehende Rezepte"}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`relative max-w-7xl mx-auto px-6 pb-12 ${currentView !== "dashboard" ? "pt-32" : "pt-24"}`}>
        {currentView === "dashboard" && <DashboardView />}
        {currentView === "recipes" && <RecipeManagement />}
        {currentView === "users" && <UserManagement users={users} setUsers={setUsers} />}
        {currentView === "subadmins" && <SubAdminManagement subAdmins={subAdmins} setSubAdmins={setSubAdmins} />}
        {currentView === "pending" && (
          <PendingRecipes
            pendingRecipes={pendingRecipes}
            setPendingRecipes={setPendingRecipes}
            setNotifications={setNotifications}
          />
        )}
      </div>
    </div>
  )
}
