import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
       <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link
            href="/"
            className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5 text-gray-100" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900 truncate">Datenschutzerklärung</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-8 text-[15px] text-gray-600 leading-relaxed space-y-5">
        <p className="text-sm text-gray-400">Gültig ab: Januar 2025</p>

        <h2 className="text-base font-bold text-gray-900">1. Verantwortliche Stelle</h2>
        <p>Lweb Schweiz, Roberto Mendez, Schweiz. Kontakt: info@lweb.ch</p>

        <h2 className="text-base font-bold text-gray-900">2. Erhobene Daten</h2>
        <p>Bei der Nutzung von Recipe Digitizer werden folgende Daten verarbeitet:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Benutzername und gewählte Rolle (Administrator, Mitarbeiter, Gast)</li>
          <li>Hochgeladene Rezeptbilder zur KI-Analyse</li>
          <li>Erstellte Rezepte, Kommentare und Bewertungen</li>
          <li>Technische Daten (Browser-Typ, Geräteinformationen) für die PWA-Funktionalität</li>
        </ul>

        <h2 className="text-base font-bold text-gray-900">3. Zweck der Datenverarbeitung</h2>
        <p>Die Daten werden ausschliesslich für folgende Zwecke verwendet:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Bereitstellung und Verbesserung der Rezeptverwaltung</li>
          <li>KI-gestützte Digitalisierung von Rezepten</li>
          <li>Verwaltung von Benutzerkonten und Berechtigungen</li>
          <li>Ermöglichung des Kommentar- und Bewertungssystems</li>
        </ul>

        <h2 className="text-base font-bold text-gray-900">4. Datenspeicherung</h2>
        <p>Rezeptdaten werden in einer geschützten MySQL-Datenbank auf Schweizer Servern (Hostpoint) gespeichert. Lokale Daten werden im Browser-Cache (localStorage) abgelegt und können vom Benutzer jederzeit gelöscht werden.</p>

        <h2 className="text-base font-bold text-gray-900">5. Drittanbieter-Dienste</h2>
        <p>Für die KI-Analyse von Rezeptbildern wird der Dienst FoodScan AI verwendet. Dabei werden ausschliesslich die hochgeladenen Bilder zur Verarbeitung übermittelt. Es werden keine personenbezogenen Daten an Dritte weitergegeben.</p>

        <h2 className="text-base font-bold text-gray-900">6. Cookies & localStorage</h2>
        <p>Die Anwendung verwendet localStorage zur Speicherung von Sitzungsdaten und Benutzereinstellungen. Es werden keine Tracking-Cookies oder Analyse-Tools von Drittanbietern eingesetzt.</p>

        <h2 className="text-base font-bold text-gray-900">7. Ihre Rechte</h2>
        <p>Gemäss dem Schweizer Datenschutzgesetz (DSG) haben Sie das Recht auf Auskunft, Berichtigung und Löschung Ihrer Daten. Kontaktieren Sie uns unter info@lweb.ch.</p>
      </main>
    </div>
  )
}
