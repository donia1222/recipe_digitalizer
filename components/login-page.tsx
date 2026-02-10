"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Shield, UserCheck, ArrowLeft, Lock, User, Eye, EyeOff, ChefHat, ArrowRight, Sparkles, MessageCircle } from "lucide-react"
import { UserService } from "@/lib/services/userService"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

interface LoginPageProps {
  onLogin: (role: "admin" | "worker" | "guest") => void
  onBackToLanding?: () => void
}

export default function LoginPage({ onLogin, onBackToLanding }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<"admin" | "worker" | "guest" | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const { toast } = useToast()

  // Detect mobile keyboard
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        const viewportHeight = window.visualViewport?.height || window.innerHeight
        const windowHeight = window.screen.height
        const heightDifference = windowHeight - viewportHeight
        setKeyboardVisible(heightDifference > 150)
      }
    }

    if (typeof window !== "undefined" && window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize)
      return () => window.visualViewport?.removeEventListener("resize", handleResize)
    }
  }, [])

  const correctPassword = process.env.NEXT_PUBLIC_RECIPE
  const isPasswordCorrect = password === correctPassword && password.length > 0

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return

    setIsLoading(true)

    try {
      if (selectedRole === 'admin') {
        if (!username || !password) {
          toast({
            title: "Error",
            description: "Usuario y contraseña requeridos para administrador",
            variant: "destructive"
          })
          setIsLoading(false)
          return
        }

        const result = await UserService.login(username, password)

        if (result.success && result.user) {
          if (result.user.role === 'admin') {
            localStorage.setItem('recipe-auth', 'granted')
            localStorage.setItem('user-role', 'admin')
            localStorage.setItem('current-user', JSON.stringify(result.user))
            if (result.token) {
              localStorage.setItem('auth-token', result.token)
            }
            onLogin('admin')
          } else {
            toast({
              title: "Acceso denegado",
              description: "Este usuario no tiene permisos de administrador",
              variant: "destructive"
            })
          }
        } else if (username === 'admin' && isPasswordCorrect) {
          localStorage.setItem('recipe-auth', 'granted')
          localStorage.setItem('user-role', 'admin')
          onLogin('admin')
        } else {
          toast({
            title: "Error de autenticación",
            description: "Usuario o contraseña incorrectos",
            variant: "destructive"
          })
        }
      } else if (selectedRole === 'worker') {
        if (!username || !password) {
          toast({
            title: "Error",
            description: "Usuario y contraseña requeridos para trabajador",
            variant: "destructive"
          })
          setIsLoading(false)
          return
        }

        const result = await UserService.login(username, password)
        if (result.success && result.user) {
          const userRole = result.user.role

          if (userRole === 'worker') {
            localStorage.setItem('user-role', 'worker')
            localStorage.setItem('actual-role', userRole)
            localStorage.setItem('current-user', JSON.stringify(result.user))
            if (result.token) {
              localStorage.setItem('auth-token', result.token)
            }
            onLogin('worker')
          } else {
            toast({
              title: "Acceso denegado",
              description: "Este usuario no tiene permisos de trabajador",
              variant: "destructive"
            })
          }
        } else {
          toast({
            title: "Error de autenticación",
            description: result.error || "Usuario o contraseña incorrectos",
            variant: "destructive"
          })
        }
      } else {
        if (!username || !password) {
          toast({
            title: "Error",
            description: "Usuario y contraseña requeridos para invitado",
            variant: "destructive"
          })
          setIsLoading(false)
          return
        }

        const result = await UserService.login(username, password)
        if (result.success && result.user) {
          const userRole = result.user.role

          if (userRole === 'guest') {
            localStorage.setItem('user-role', 'guest')
            localStorage.setItem('actual-role', userRole)
            localStorage.setItem('current-user', JSON.stringify(result.user))
            if (result.token) {
              localStorage.setItem('auth-token', result.token)
            }
            onLogin('guest')
          } else {
            toast({
              title: "Acceso denegado",
              description: "Este usuario no tiene permisos de invitado",
              variant: "destructive"
            })
          }
        } else {
          toast({
            title: "Error de autenticación",
            description: result.error || "Usuario o contraseña incorrectos",
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Error",
        description: "Error al iniciar sesión. Intente nuevamente.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleSelect = (role: "admin" | "worker" | "guest") => {
    setSelectedRole(role)
  }

  const resetSelection = () => {
    setSelectedRole(null)
    setUsername("")
    setPassword("")
    setShowPassword(false)
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsInputFocused(true)
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 300)
    }
  }

  const handleInputBlur = () => {
    setIsInputFocused(false)
  }

  const roles = [
    {
      id: "admin" as const,
      icon: Shield,
      title: "Administrator",
      description: "Vollzugriff auf alle Funktionen und Einstellungen",
      gradient: "from-slate-600 to-slate-800",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-700",
      features: ["Benutzerverwaltung", "Rezepte genehmigen", "Systemstatistiken"]
    },
    {
      id: "worker" as const,
      icon: ChefHat,
      title: "Mitarbeiter",
      description: "Zugriff auf Rezeptverwaltung und Digitalisierung",
      gradient: "from-blue-500 to-blue-700",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      features: ["Rezepte erstellen", "KI-Digitalisierung", "Kommentare & Likes"]
    },
    {
      id: "guest" as const,
      icon: UserCheck,
      title: "Gast",
      description: "Eingeschränkter Zugriff zum Durchsuchen von Rezepten",
      gradient: "from-emerald-500 to-emerald-700",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      features: ["Rezepte ansehen", "Bibliothek durchsuchen", "Rezepte herunterladen"]
    }
  ]

  // ===== LOGIN FORM VIEW =====
  if (selectedRole) {
    const role = roles.find(r => r.id === selectedRole)!
    const IconComponent = role.icon

    return (
      <div
        className={`min-h-screen bg-white flex justify-center transition-all duration-300 ${isInputFocused || keyboardVisible ? "items-start pt-8 md:items-center md:pt-4" : "items-center"}`}
        style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
      >
        {/* Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50 -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md px-6"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className={`w-16 h-16 ${role.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm`}>
              <IconComponent className={`h-8 w-8 ${role.iconColor}`} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">{role.title}</h1>
            <p className="text-sm text-gray-500">Melden Sie sich mit Ihren Anmeldedaten an</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[20px] border border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8">
            <h2 className="text-lg font-bold text-gray-900 text-center mb-6">Anmeldung</h2>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-semibold text-gray-700">
                  Benutzername
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Benutzername eingeben"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="pl-11 h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-blue-100 text-[15px]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Passwort
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="pl-11 pr-11 h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-blue-100 text-[15px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={resetSelection}
                  className="flex-1 h-12 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-[15px] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Zurück
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !username || !password}
                  className={`flex-1 h-12 rounded-xl bg-gradient-to-r ${role.gradient} text-white font-semibold text-[15px] shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg`}
                >
                  {isLoading ? "Anmelden..." : "Anmelden"}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-8">
            Rezept Digitalisierung System · Lweb Schweiz
          </p>
        </motion.div>
      </div>
    )
  }

  // ===== ROLE SELECTION VIEW =====
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50 -z-10" />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 -z-10" />

      {/* Header */}
      {onBackToLanding && (
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center">
            <button
              onClick={onBackToLanding}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </button>
            <span className="ml-4 text-sm text-gray-500">Zurück zur Startseite</span>
          </div>
        </div>
      )}

      <div className={`flex items-center justify-center px-6 ${onBackToLanding ? 'pt-12 pb-16 min-h-[calc(100vh-64px)]' : 'min-h-screen py-16'}`}>
        <div className="w-full max-w-4xl">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Anmeldung</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              Anmeldung
            </h1>
            <p className="text-gray-500 text-lg">
              Wählen Sie Ihre Rolle, um fortzufahren
            </p>
          </motion.div>

          {/* Trial Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-10 bg-blue-50 border border-blue-200 rounded-[20px] p-7 sm:p-8 text-center"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Kostenlos testen</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto mb-6">
              Um dieses Programm zu testen, kontaktieren Sie Lweb Schweiz und fordern Sie eine kostenlose 3-Tage-Testversion an.
            </p>
            <a
              href="https://wa.me/41765608645?text=Hallo%20Lweb%2C%20ich%20m%C3%B6chte%20eine%203-Tage-Testversion%20der%20Rezept-App%20anfordern."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-emerald-500 text-white font-semibold text-[15px] shadow-lg hover:bg-emerald-400 hover:-translate-y-0.5 transition-all duration-200 gap-2"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Testversion anfordern
            </a>
          </motion.div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {roles.map((role, index) => {
              const IconComponent = role.icon

              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div
                    onClick={() => handleRoleSelect(role.id)}
                    className="group bg-white rounded-[20px] border border-gray-200 p-7 cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:border-blue-200 transition-all duration-300"
                  >
                    {/* Icon */}
                    <div className={`w-14 h-14 ${role.iconBg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                      <IconComponent className={`h-7 w-7 ${role.iconColor}`} />
                    </div>

                    {/* Text */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
                    <p className="text-sm text-gray-500 mb-5 leading-relaxed">{role.description}</p>

                    {/* Features */}
                    <div className="space-y-2.5 mb-6">
                      {role.features.map((feature, fi) => (
                        <div key={fi} className="flex items-center gap-2.5">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                            <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Button */}
                    <button className={`w-full h-11 rounded-xl bg-gradient-to-r ${role.gradient} text-white font-semibold text-sm shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}>
                      {role.id === "guest" ? "Als Gast fortfahren" : "Anmelden"}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="text-center mt-14">
            <p className="text-xs text-gray-400">Rezept Digitalisierung System · Lweb Schweiz</p>
          </div>
        </div>
      </div>
    </div>
  )
}
