"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  ChefHat,
  Users,
  Shield,
  Brain,
  Archive,
  MessageSquare,
  Smartphone,
  ArrowRight,
  Sparkles,
  Utensils,
  CheckCircle,
  Star,
  Eye,
  Zap,
  BookOpen,
  Camera,
  Menu,
  X,
  HelpCircle,
  ChevronDown,
  CircleDollarSign,
  Check,
  Minus
} from "lucide-react"
import { motion } from "framer-motion"

interface LandingPageProps {
  onAccessApp: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onAccessApp }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [legalModal, setLegalModal] = useState<"datenschutz" | "agb" | "impressum" | null>(null)

  const toggleFaq = useCallback((index: number) => {
    setOpenFaq(prev => prev === index ? null : index)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: "Funktionen", href: "#funktionen", icon: Zap },
    { label: "So funktioniert es", href: "#workflow", icon: BookOpen },
    { label: "KI-Technologie", href: "#ki", icon: Brain },
    { label: "Rollen", href: "#rollen", icon: Users },
    { label: "Preise", href: "#preise", icon: CircleDollarSign },
    { label: "FAQ", href: "#faq", icon: HelpCircle },
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const features = [
    {
      icon: Brain,
      title: "KI-Digitalisierung",
      description: "Fotografieren Sie handgeschriebene Rezepte und lassen Sie unsere KI sie automatisch digitalisieren"
    },
    {
      icon: Users,
      title: "Drei Benutzerrollen",
      description: "Administrator, Mitarbeiter und Gast - jeder mit spezifischen Berechtigungen und Funktionen"
    },
    {
      icon: Archive,
      title: "Intelligente Bibliothek",
      description: "Organisieren Sie Rezepte in Ordnern, setzen Sie Favoriten und nutzen Sie die erweiterte Suche"
    },
    {
      icon: MessageSquare,
      title: "Kommentarsystem",
      description: "Bewerten, kommentieren und liken Sie Rezepte mit unserem vollständigen Interaktionssystem"
    },
    {
      icon: Shield,
      title: "Rezept-Genehmigung",
      description: "Administratoren prüfen und genehmigen alle Rezepte vor der Veröffentlichung"
    },
    {
      icon: Smartphone,
      title: "PWA-Technologie",
      description: "Installierbar, offline-fähig und funktioniert perfekt auf allen Geräten"
    }
  ]

  const roles = [
    {
      icon: Shield,
      name: "Administrator",
      description: "Vollzugriff auf Systemverwaltung",
      features: ["Rezepte genehmigen", "Benutzerverwaltung", "Systemstatistiken", "Ausstehende Rezepte"]
    },
    {
      icon: ChefHat,
      name: "Mitarbeiter",
      description: "Erstellen und verwalten von Rezepten",
      features: ["Rezepte erstellen", "Zur Genehmigung senden", "KI-Digitalisierung", "Persönliche Bibliothek"]
    },
    {
      icon: Eye,
      name: "Gast",
      description: "Rezepte ansehen und durchsuchen",
      features: ["Rezepte ansehen", "Bibliothek durchsuchen", "Kommentare lesen", "Rezepte herunterladen"]
    }
  ]

  const steps = [
    {
      number: "01",
      icon: Camera,
      title: "Rezept fotografieren",
      description: "Fotografieren Sie ein handgeschriebenes Rezept oder laden Sie ein Bild hoch"
    },
    {
      number: "02",
      icon: Brain,
      title: "KI-Analyse",
      description: "Unsere KI erkennt automatisch Zutaten, Mengen und Zubereitungsschritte"
    },
    {
      number: "03",
      icon: Shield,
      title: "Admin-Prüfung",
      description: "Administratoren prüfen eingereichte Rezepte auf Qualität und Vollständigkeit"
    },
    {
      number: "04",
      icon: BookOpen,
      title: "Veröffentlichung",
      description: "Genehmigte Rezepte werden in der Bibliothek für alle Nutzer verfügbar"
    }
  ]

  const faqs = [
    {
      question: "Was ist Recipe Digitizer und für wen ist es gedacht?",
      answer: "Recipe Digitizer ist eine intelligente Web-App zur Digitalisierung handgeschriebener und gedruckter Rezepte. Speziell entwickelt für Gastronomiebetriebe, Altersheime und Küchenteams, die ihre Rezeptsammlung einfach und effizient digital verwalten möchten."
    },
    {
      question: "Wie funktioniert die KI-Digitalisierung von Rezepten?",
      answer: "Fotografieren Sie ein Rezept oder laden Sie ein Bild hoch. Unsere KI (powered by GPT-4.1) analysiert das Bild automatisch und erkennt Titel, Zutaten mit Mengenangaben und Zubereitungsschritte. Das Ergebnis können Sie direkt bearbeiten und in Ihrer Bibliothek speichern."
    },
    {
      question: "Welche Benutzerrollen gibt es und was können sie?",
      answer: "Es gibt drei Rollen: Administrator (vollständige Systemverwaltung, Rezeptgenehmigung, Benutzerverwaltung), Mitarbeiter (Rezepte erstellen, digitalisieren und eigene Bibliothek verwalten) und Gast (Rezepte ansehen, durchsuchen und herunterladen)."
    },
    {
      question: "Funktioniert die App auch ohne Internet?",
      answer: "Ja! Recipe Digitizer ist eine Progressive Web App (PWA) und kann auf Ihrem Gerät installiert werden. Bereits gespeicherte Rezepte sind auch ohne Internetverbindung verfügbar — perfekt für den Einsatz direkt in der Küche."
    },
    {
      question: "Wie funktioniert der intelligente Portionsrechner?",
      answer: "Geben Sie die gewünschte Portionszahl ein und unsere KI berechnet alle Zutatenmengen automatisch neu. So können Sie jedes Rezept flexibel an Ihre Bedürfnisse anpassen — ob für 2 oder 200 Personen."
    },
    {
      question: "Kann ich Rezepte kommentieren und bewerten?",
      answer: "Ja! Eingeloggte Benutzer (Administrator und Mitarbeiter) können Rezepte kommentieren und mit Likes bewerten. Sie sehen auch, wer ein Rezept geliked hat, und können Ihre eigenen Kommentare bearbeiten oder löschen."
    },
    {
      question: "Auf welchen Geräten kann ich die App nutzen?",
      answer: "Recipe Digitizer funktioniert auf allen modernen Geräten — Smartphones, Tablets und Desktop-Computern. Als PWA kann sie direkt vom Browser installiert werden, ohne App Store. Optimiert für iOS, Android, Windows und macOS."
    },
    {
      question: "Wie sicher sind meine Rezeptdaten?",
      answer: "Ihre Daten werden in einer geschützten MySQL-Datenbank gespeichert. Der Zugang ist durch ein rollenbasiertes Berechtigungssystem geschützt. Administratoren haben die volle Kontrolle über Benutzer und Inhalte."
    }
  ]

  return (
    <div className="min-h-screen bg-blue-50 overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* ===== HEADER ===== */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-sm" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <img src="/1e9739e5-a2a7-4218-8384-5602515adbb7.png" alt="RezeptApp" className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-cover" />
            <div className="leading-none">
              <span className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">Rezeptsammlung</span>
              <span className="text-lg sm:text-xl font-extrabold text-blue-600 tracking-tight"> App</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-[15px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={onAccessApp}
              className="ml-3 h-10 px-5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Zur Anwendung
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <Menu className="h-5 w-5 text-white" />
          </button>
        </div>
        {/* Gradient fade from white to transparent */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent translate-y-full pointer-events-none" />
      </header>

      {/* ===== MOBILE MENU MODAL ===== */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-300 ${menuOpen ? "visible" : "invisible"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />
        {/* Panel */}
        <div className={`absolute top-0 right-0 w-[280px] h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <img src="/1e9739e5-a2a7-4218-8384-5602515adbb7.png" alt="RezeptApp" className="w-8 h-8 rounded-lg object-cover" />
              <div className="leading-none">
                <span className="text-base font-extrabold text-gray-900">Rezept</span>
                <span className="text-base font-extrabold text-blue-600">App</span>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          {/* Nav Links */}
          <nav className="flex-1 px-3 py-5 space-y-1">
            {navItems.map((item) => {
              const NavIcon = item.icon
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 text-[15px] font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <NavIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  {item.label}
                </a>
              )
            })}
          </nav>
          {/* Trial Banner */}
          <div className="px-4 mt-auto mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
              <p className="text-sm font-bold text-gray-900 mb-1">Kostenlos testen</p>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">3-Tage-Testversion anfordern</p>
              <a
                href="https://wa.me/41765608645?text=Hallo%20Lweb%2C%20ich%20m%C3%B6chte%20eine%203-Tage-Testversion%20der%20Rezept-App%20anfordern."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="w-full h-10 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Demo
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="px-4 pb-6">
            <button
              onClick={() => {
                setMenuOpen(false)
                onAccessApp()
              }}
              className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold text-[15px] shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Utensils className="h-4 w-4" />
              Zur Anwendung
            </button>
          </div>
        </div>
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-blue-50/60 to-white" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-indigo-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-20 sm:pt-20 sm:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-8">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Powered by Chat GPT</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
                <span className="inline-flex items-center gap-2 sm:gap-3">
                  Digitale
                  <span className="relative inline-block">
                    <motion.span
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                      className="inline-block"
                    >
                      <ChefHat className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-600" />
                    </motion.span>
                    {/* Sparkles around chef hat - constant */}
                    <motion.span
                      animate={{ scale: [0.7, 1.4, 0.7], opacity: [0.5, 1, 0.5], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                      className="absolute -top-3 -right-3 text-yellow-400 text-xl"
                    >
                      ✦
                    </motion.span>
                    <motion.span
                      animate={{ scale: [0.7, 1.4, 0.7], opacity: [0.5, 1, 0.5], rotate: [0, -180, -360] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                      className="absolute -top-2 -left-4 text-blue-400 text-lg"
                    >
                      ✦
                    </motion.span>
                    <motion.span
                      animate={{ scale: [0.7, 1.4, 0.7], opacity: [0.5, 1, 0.5], rotate: [0, 180, 360] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                      className="absolute -bottom-2 -right-4 text-cyan-400 text-lg"
                    >
                      ✦
                    </motion.span>
                    <motion.span
                      animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4], rotate: [0, -180, -360] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                      className="absolute top-1/2 -right-5 text-yellow-300 text-base"
                    >
                      ✦
                    </motion.span>
                  </span>
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Rezeptsammlung
                </span>
              </h1>

              <p className="text-lg text-gray-500 leading-relaxed mb-8">
                Handgeschriebene Rezepte in Sekunden digitalisieren, verwalten und mit dem ganzen Team teilen — powered by künstlicher Intelligenz.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={onAccessApp}
                  className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-blue-600 text-white font-semibold text-lg shadow-[0_6px_30px_rgba(37,99,235,0.35)] hover:bg-blue-700 hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 transition-all duration-200 gap-2"
                >
                  <Utensils className="h-5 w-5" />
                  Zur Anwendung
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  "KI-gestützte Rezepterkennung in Sekunden",
                  "Offline-fähig als installierbare App",
                  "Rollenbasiertes Zugangssystem",
                  "Ideal für Gastronomie & Betriebe"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-600 text-[15px]">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right image */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-200/50 to-cyan-200/50 rounded-[40px] blur-2xl" />
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=520&h=600&fit=crop&crop=center"
                  alt="Rezepte digitalisieren"
                  className="relative w-full max-w-[480px] rounded-[32px] shadow-2xl object-cover aspect-[4/5]"
                />
                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">KI-Analyse</p>
                    <p className="text-xs text-gray-500">Automatisch erkannt</p>
                  </div>
                </div>
                {/* Floating card top right */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Rezepte</p>
                    <p className="text-xs text-gray-500">digitalisiert</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section id="funktionen" className="py-24 bg-gray-50/80 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-4xl sm:text-[44px] font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
              Leistungsstarke Funktionen
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Entdecken Sie alle Möglichkeiten unserer modernen Rezeptverwaltung
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group bg-white rounded-[20px] p-7 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-250 cursor-default hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-250">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="workflow" className="py-24 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-4xl sm:text-[44px] font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
              So funktioniert es
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              In vier einfachen Schritten vom handgeschriebenen Rezept zur digitalen Sammlung
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative px-6 py-8"
              >
                <span className="text-[64px] font-extrabold text-blue-50 leading-none block mb-4">
                  {step.number}
                </span>
                <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg">
                  <step.icon className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-3">{step.title}</h4>
                <p className="text-[15px] text-gray-500 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AI SECTION (Dark) ===== */}
      <section id="ki" className="py-24 bg-gradient-to-br from-blue-50 via-sky-50/60 to-indigo-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-4xl sm:text-[44px] font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
              Künstliche Intelligenz
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Modernste KI-Technologie für perfekte Rezepterkennung und intelligente Portionsberechnung
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=500&h=300&fit=crop",
                icon: Camera,
                title: "Bilderkennung",
                description: "Fotografieren Sie jedes Rezept - handgeschrieben oder gedruckt. Unsere KI erkennt den Inhalt zuverlässig."
              },
              {
                img: "https://images.unsplash.com/photo-1495546968767-f0573cca821e?w=500&h=300&fit=crop",
                icon: Zap,
                title: "Sofortige Analyse",
                description: "In Sekunden werden Titel, Zutaten mit Mengenangaben und Zubereitungsschritte extrahiert."
              },
              {
                img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&h=300&fit=crop",
                icon: Utensils,
                title: "Portionsrechner",
                description: "Passen Sie Rezepte automatisch an beliebige Portionsgrössen an - die KI berechnet alle Zutaten neu."
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-[20px] overflow-hidden border border-blue-100/60 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                <div className="aspect-[3/2] overflow-hidden">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-7">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <card.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{card.title}</h3>
                  <p className="text-[15px] text-gray-500 leading-relaxed">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ROLES SECTION ===== */}
      <section id="rollen" className="py-24 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-4xl sm:text-[44px] font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
              Benutzerrollen & Berechtigungen
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Jede Rolle hat spezifische Funktionen für optimale Zusammenarbeit
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-[20px] border border-gray-200 p-8 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-250"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <role.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {role.features.map((feature, fi) => (
                    <div key={fi} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </div>
                      <span className="text-[15px] font-medium text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS BANNER ===== */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: "127+", label: "Digitalisierte Rezepte" },
              { number: "12", label: "Aktive Benutzer" },
              { number: "3", label: "Benutzerrollen" },
              { number: "24/7", label: "Offline verfügbar" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <p className="text-5xl sm:text-[56px] font-extrabold leading-none mb-2">{stat.number}</p>
                <p className="text-base font-medium text-blue-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PWA SECTION ===== */}
      <section className="py-24 bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-4xl sm:text-[44px] font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
              Überall verfügbar
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Als Progressive Web App funktioniert Recipe Digitizer auf jedem Gerät - auch ohne Internet
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Smartphone,
                title: "Installierbar",
                description: "Installieren Sie die App direkt auf Ihrem Smartphone oder Desktop - wie eine native App, ohne App Store."
              },
              {
                icon: Zap,
                title: "Offline-Modus",
                description: "Greifen Sie auch ohne Internetverbindung auf Ihre gespeicherten Rezepte zu. Perfekt für die Küche."
              },
              {
                icon: Star,
                title: "Blitzschnell",
                description: "Dank intelligenter Cache-Strategie laden Seiten sofort. Optimiert für mobile Geräte und Desktop."
              }
            ].map((pwa, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-[20px] p-10 text-center hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-250"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
                  <pwa.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">{pwa.title}</h4>
                <p className="text-[15px] text-gray-500 leading-relaxed">{pwa.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING COMPARISON ===== */}
      <section id="preise" className="py-24 bg-gray-50/80 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-6">
              <CircleDollarSign className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Transparente Preise</span>
            </div>
            <h2 className="text-4xl sm:text-[44px] font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
              Preisvergleich
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Für das gleiche Projekt würden Sie zahlen
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* Lweb Schweiz - Highlighted */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="relative lg:-mt-4"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-5 py-2 rounded-full shadow-[0_4px_16px_rgba(37,99,235,0.3)]">
                  Empfohlen
                </span>
              </div>
              <div className="bg-gradient-to-b from-blue-50/80 to-white rounded-[24px] border-2 border-blue-200 p-8 pt-10 shadow-[0_16px_48px_rgba(37,99,235,0.12)] hover:-translate-y-1 transition-all duration-250">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_rgba(37,99,235,0.3)]">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Lweb Schweiz</h3>
                  <p className="text-sm text-blue-500 font-medium">(Freelancer)</p>
                </div>

                <div className="text-center mb-8">
                  {/* Launch offer badge */}
                  <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1 mb-4">
                    <Sparkles className="h-3.5 w-3.5 text-red-500" />
                    <span className="text-xs font-bold text-red-600">Lancierungsangebot — nur bis Ende Februar!</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-400 line-through mb-1">
                    CHF 6&apos;500
                  </p>
                  <p className="text-5xl sm:text-[52px] font-extrabold text-gray-900 tracking-tight">
                    CHF 5&apos;500
                  </p>
                  <div className="inline-flex items-center gap-2 mt-3">
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">−15%</span>
                    <span className="text-xs font-semibold text-gray-400">Sie sparen CHF 1&apos;000</span>
                  </div>
                </div>

                <div className="space-y-3.5 mb-8">
                  {[
                    "Direkter Kontakt",
                    "Flexible Anpassungen",
                    "Schnelle Umsetzung",
                    "Persönlicher Support",
                    "95 Stunden Arbeit"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-sm">
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-[15px] font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://wa.me/41765608645?text=Hallo%20Lweb%2C%20ich%20interessiere%20mich%20f%C3%BCr%20die%20Rezept-App."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-500 text-white font-bold text-base shadow-[0_8px_30px_rgba(37,99,235,0.35)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.5)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2.5 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-700 to-cyan-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2.5">
                    Jetzt anfragen
                    <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </span>
                </a>
              </div>
            </motion.div>

            {/* Andere Freelancer */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white rounded-[24px] border border-gray-100 p-8 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-250">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Andere Freelancer</h3>
                  <p className="text-sm text-gray-400 font-medium">(Schweiz)</p>
                </div>

                <div className="text-center mb-8">
                  <p className="text-5xl sm:text-[52px] font-extrabold text-gray-400 tracking-tight">
                    CHF 11&apos;400
                  </p>
                  <div className="inline-flex items-center gap-1.5 mt-3 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
                    <span className="text-xs font-semibold text-gray-400">Stundensatz: CHF 120/h</span>
                  </div>
                </div>

                <div className="space-y-3.5 mb-8">
                  {[
                    "Variable Qualität",
                    "Oft Verzögerungen",
                    "Weniger Garantie",
                    "Basis-Support",
                    "95 Stunden Arbeit"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <Minus className="w-3.5 h-3.5 text-gray-300" strokeWidth={3} />
                      </div>
                      <span className="text-[15px] font-medium text-gray-400">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full h-12 rounded-xl bg-orange-50 border border-orange-100 text-orange-400 font-semibold text-sm flex items-center justify-center">
                  +75% teurer
                </div>
              </div>
            </motion.div>

            {/* Web-Agentur */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-[24px] border border-gray-100 p-8 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-250">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Web-Agentur</h3>
                  <p className="text-sm text-gray-400 font-medium">(Schweiz)</p>
                </div>

                <div className="text-center mb-8">
                  <p className="text-5xl sm:text-[52px] font-extrabold text-gray-400 tracking-tight">
                    CHF 18&apos;500
                  </p>
                  <div className="inline-flex items-center gap-1.5 mt-3 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
                    <span className="text-xs font-semibold text-gray-400">Stundensatz: CHF 195/h</span>
                  </div>
                </div>

                <div className="space-y-3.5 mb-8">
                  {[
                    "Hohe Overhead-Kosten",
                    "Längere Prozesse",
                    "Weniger flexibel",
                    "Team-Koordination",
                    "95 Stunden Arbeit"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <Minus className="w-3.5 h-3.5 text-gray-300" strokeWidth={3} />
                      </div>
                      <span className="text-[15px] font-medium text-gray-400">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full h-12 rounded-xl bg-red-50 border border-red-100 text-red-400 font-semibold text-sm flex items-center justify-center">
                  +185% teurer
                </div>
              </div>
            </motion.div>
          </div>

          {/* Savings highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-14 text-center"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="inline-flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-full px-6 py-3 shadow-sm">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-[15px] font-semibold text-emerald-700">
                  Sie sparen bis zu CHF 12&apos;000 mit Lweb Schweiz
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-4 py-3 shadow-sm">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-[15px] font-semibold text-blue-600">Stundensatz: CHF 87/h</span>
              </div>
            </div>
          </motion.div>

          {/* API cost note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-[16px] border border-blue-100 p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-bold text-gray-800">Hinweis zur OpenAI API</span>
              </div>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Die oben genannten Preise beinhalten nicht die Kosten der OpenAI API für die KI-Funktionen.
                Sie haben zwei Optionen: <span className="font-semibold text-gray-700">Ihren eigenen API-Schlüssel</span> hinterlegen
                oder <span className="font-semibold text-gray-700">unseren API-Zugang nutzen</span> — in diesem Fall wird der Verbrauch monatlich abgerechnet.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section id="faq" className="py-24 bg-white scroll-mt-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-6">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Häufige Fragen</span>
            </div>
            <h2 className="text-4xl sm:text-[44px] font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
              FAQ
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Antworten auf die häufigsten Fragen rund um Recipe Digitizer
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div
                  className={`bg-gray-50 rounded-[16px] border transition-all duration-250 ${
                    openFaq === index
                      ? "border-blue-200 bg-blue-50/40 shadow-[0_4px_20px_rgba(37,99,235,0.08)]"
                      : "border-transparent hover:border-gray-200 hover:bg-gray-100/60"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left"
                  >
                    <span className={`text-[15px] sm:text-base font-semibold transition-colors duration-200 ${
                      openFaq === index ? "text-blue-700" : "text-gray-800"
                    }`}>
                      {faq.question}
                    </span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-250 ${
                      openFaq === index
                        ? "bg-blue-600 rotate-180"
                        : "bg-gray-200"
                    }`}>
                      <ChevronDown className={`h-4 w-4 transition-colors duration-200 ${
                        openFaq === index ? "text-white" : "text-gray-500"
                      }`} />
                    </div>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      openFaq === index
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-7 pb-6 text-[15px] text-gray-500 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-blue-100/60 to-sky-50 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl sm:text-[44px] font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
              Jetzt starten
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed mb-10">
              Digitalisieren Sie Ihre Rezeptsammlung noch heute. Einfach, schnell und intelligent.
            </p>
            <button
              onClick={onAccessApp}
              className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-blue-600 text-white font-semibold text-lg shadow-[0_6px_30px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:-translate-y-0.5 transition-all duration-200 gap-2"
            >
              <Utensils className="h-5 w-5" />
              Zur Anwendung
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <img src="/1e9739e5-a2a7-4218-8384-5602515adbb7.png" alt="RezeptApp" className="w-8 h-8 rounded-lg object-cover opacity-80" />
              <div className="leading-none">
                <span className="text-base font-bold text-gray-400">Rezeptsammlung</span>
                <span className="text-base font-bold text-blue-400"> App</span>
              </div>
            </div>

            {/* Legal links */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6">
              <button
                onClick={() => setLegalModal("datenschutz")}
                className="text-sm text-gray-500 hover:text-blue-400 transition-colors"
              >
                Datenschutz
              </button>
              <span className="text-gray-700 hidden sm:inline">·</span>
              <button
                onClick={() => setLegalModal("agb")}
                className="text-sm text-gray-500 hover:text-blue-400 transition-colors"
              >
                AGB
              </button>
              <span className="text-gray-700 hidden sm:inline">·</span>
              <button
                onClick={() => setLegalModal("impressum")}
                className="text-sm text-gray-500 hover:text-blue-400 transition-colors"
              >
                Impressum
              </button>
              <span className="text-gray-700 hidden sm:inline">·</span>
              <a
                href="https://www.lweb.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-blue-400 transition-colors"
              >
                Kontakt
              </a>
            </div>

            {/* Divider */}
            <div className="w-full max-w-xs h-px bg-gray-800" />

            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Entwickelt von{" "}
              <a href="https://www.lweb.ch" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                Lweb Schweiz
              </a>
              . Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>

      {/* ===== LEGAL MODALS ===== */}
      {legalModal && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setLegalModal(null)}
          />
          {/* Modal */}
          <div className="relative bg-white rounded-t-[20px] sm:rounded-[20px] shadow-2xl w-full max-w-lg max-h-[70vh] flex flex-col overflow-hidden">
            {/* Header - sticky */}
            <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {legalModal === "datenschutz" && "Datenschutzerklärung"}
                {legalModal === "agb" && "Allgemeine Geschäftsbedingungen"}
                {legalModal === "impressum" && "Impressum"}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 text-[14px] text-gray-600 leading-relaxed space-y-4">

              {/* ── Datenschutz ── */}
              {legalModal === "datenschutz" && (
                <>
                  <p className="text-sm text-gray-400">Gültig ab: Januar 2025</p>

                  <h4 className="text-base font-bold text-gray-900">1. Verantwortliche Stelle</h4>
                  <p>Lweb Schweiz, Roberto Mendez, Schweiz. Kontakt: info@lweb.ch</p>

                  <h4 className="text-base font-bold text-gray-900">2. Erhobene Daten</h4>
                  <p>Bei der Nutzung von Recipe Digitizer werden folgende Daten verarbeitet:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Benutzername und gewählte Rolle (Administrator, Mitarbeiter, Gast)</li>
                    <li>Hochgeladene Rezeptbilder zur KI-Analyse</li>
                    <li>Erstellte Rezepte, Kommentare und Bewertungen</li>
                    <li>Technische Daten (Browser-Typ, Geräteinformationen) für die PWA-Funktionalität</li>
                  </ul>

                  <h4 className="text-base font-bold text-gray-900">3. Zweck der Datenverarbeitung</h4>
                  <p>Die Daten werden ausschliesslich für folgende Zwecke verwendet:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Bereitstellung und Verbesserung der Rezeptverwaltung</li>
                    <li>KI-gestützte Digitalisierung von Rezepten</li>
                    <li>Verwaltung von Benutzerkonten und Berechtigungen</li>
                    <li>Ermöglichung des Kommentar- und Bewertungssystems</li>
                  </ul>

                  <h4 className="text-base font-bold text-gray-900">4. Datenspeicherung</h4>
                  <p>Rezeptdaten werden in einer geschützten MySQL-Datenbank auf Schweizer Servern (Hostpoint) gespeichert. Lokale Daten werden im Browser-Cache (localStorage) abgelegt und können vom Benutzer jederzeit gelöscht werden.</p>

                  <h4 className="text-base font-bold text-gray-900">5. Drittanbieter-Dienste</h4>
                  <p>Für die KI-Analyse von Rezeptbildern wird der Dienst FoodScan AI verwendet. Dabei werden ausschliesslich die hochgeladenen Bilder zur Verarbeitung übermittelt. Es werden keine personenbezogenen Daten an Dritte weitergegeben.</p>

                  <h4 className="text-base font-bold text-gray-900">6. Cookies & localStorage</h4>
                  <p>Die Anwendung verwendet localStorage zur Speicherung von Sitzungsdaten und Benutzereinstellungen. Es werden keine Tracking-Cookies oder Analyse-Tools von Drittanbietern eingesetzt.</p>

                  <h4 className="text-base font-bold text-gray-900">7. Ihre Rechte</h4>
                  <p>Gemäss dem Schweizer Datenschutzgesetz (DSG) haben Sie das Recht auf Auskunft, Berichtigung und Löschung Ihrer Daten. Kontaktieren Sie uns unter info@lweb.ch.</p>
                </>
              )}

              {/* ── AGB ── */}
              {legalModal === "agb" && (
                <>
                  <p className="text-sm text-gray-400">Gültig ab: Januar 2025</p>

                  <h4 className="text-base font-bold text-gray-900">1. Geltungsbereich</h4>
                  <p>Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Software «Recipe Digitizer», entwickelt und bereitgestellt von Lweb Schweiz.</p>

                  <h4 className="text-base font-bold text-gray-900">2. Leistungsbeschreibung</h4>
                  <p>Recipe Digitizer ist eine webbasierte Anwendung (PWA) zur Digitalisierung, Verwaltung und Organisation von Rezepten mittels künstlicher Intelligenz. Die Software umfasst:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>KI-gestützte Rezeptdigitalisierung aus Bildern</li>
                    <li>Rezeptverwaltung mit Bibliothek und Suchfunktion</li>
                    <li>Rollenbasiertes Benutzersystem (Administrator, Mitarbeiter, Gast)</li>
                    <li>Kommentar- und Bewertungssystem</li>
                    <li>Intelligenter Portionsrechner</li>
                    <li>Offline-Funktionalität als PWA</li>
                  </ul>

                  <h4 className="text-base font-bold text-gray-900">3. Nutzungsrechte</h4>
                  <p>Der Kunde erhält ein nicht-exklusives, nicht übertragbares Nutzungsrecht an der Software für den vereinbarten Einsatzzweck. Die Software darf nicht ohne schriftliche Genehmigung weiterverkauft, kopiert oder verändert werden.</p>

                  <h4 className="text-base font-bold text-gray-900">4. Verfügbarkeit</h4>
                  <p>Lweb Schweiz bemüht sich um eine hohe Verfügbarkeit der Anwendung. Eine Garantie von 100% Verfügbarkeit kann nicht gewährleistet werden. Wartungsarbeiten werden nach Möglichkeit im Voraus angekündigt.</p>

                  <h4 className="text-base font-bold text-gray-900">5. Haftung</h4>
                  <p>Lweb Schweiz haftet nicht für Datenverluste durch unsachgemässe Nutzung, höhere Gewalt oder Ausfälle von Drittanbietern (z.B. KI-Dienste). Die Haftung beschränkt sich auf den Vertragswert der Software.</p>

                  <h4 className="text-base font-bold text-gray-900">6. Zahlungsbedingungen</h4>
                  <p>Die Zahlungsbedingungen werden im individuellen Angebot festgelegt. Standardmässig gelten 30 Tage Zahlungsfrist ab Rechnungsstellung. Alle Preise verstehen sich in CHF und exklusive MwSt.</p>

                  <h4 className="text-base font-bold text-gray-900">7. Kündigung</h4>
                  <p>Der Vertrag kann von beiden Seiten mit einer Frist von 30 Tagen schriftlich gekündigt werden. Bei Kündigung werden alle Kundendaten auf Wunsch exportiert und anschliessend gelöscht.</p>

                  <h4 className="text-base font-bold text-gray-900">8. Anwendbares Recht</h4>
                  <p>Es gilt Schweizer Recht. Gerichtsstand ist der Sitz von Lweb Schweiz.</p>
                </>
              )}

              {/* ── Impressum ── */}
              {legalModal === "impressum" && (
                <>
                  <h4 className="text-base font-bold text-gray-900">Angaben gemäss Schweizer Recht</h4>

                  <div className="bg-gray-50 rounded-xl p-5 space-y-2">
                    <p><span className="font-semibold text-gray-800">Firma:</span> Lweb Schweiz</p>
                    <p><span className="font-semibold text-gray-800">Inhaber:</span> Roberto Mendez</p>
                    <p><span className="font-semibold text-gray-800">Land:</span> Schweiz</p>
                    <p><span className="font-semibold text-gray-800">E-Mail:</span> info@lweb.ch</p>
                    <p><span className="font-semibold text-gray-800">Webseite:</span>{" "}
                      <a href="https://www.lweb.ch" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500 transition-colors">
                        www.lweb.ch
                      </a>
                    </p>
                  </div>

                  <h4 className="text-base font-bold text-gray-900">Haftungsausschluss</h4>
                  <p>Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen. Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen entstanden sind, werden ausgeschlossen.</p>

                  <h4 className="text-base font-bold text-gray-900">Urheberrechte</h4>
                  <p>Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf dieser Anwendung gehören ausschliesslich Lweb Schweiz oder den speziell genannten Rechtsinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung der Urheberrechtsträger im Voraus einzuholen.</p>

                  <h4 className="text-base font-bold text-gray-900">Kontakt</h4>
                  <p>Bei Fragen oder Anliegen erreichen Sie uns unter:</p>
                  <div className="bg-gray-50 rounded-xl p-5 space-y-2">
                    <p><span className="font-semibold text-gray-800">E-Mail:</span> info@lweb.ch</p>
                    <p><span className="font-semibold text-gray-800">WhatsApp:</span> +41 76 560 86 45</p>
                    <p><span className="font-semibold text-gray-800">Web:</span>{" "}
                      <a href="https://www.lweb.ch" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500 transition-colors">
                        www.lweb.ch
                      </a>
                    </p>
                  </div>
                </>
              )}

            </div>
            {/* Footer - sticky */}
            <div className="sticky bottom-0 bg-white px-6 py-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="h-10 px-6 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Schliessen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LandingPage
