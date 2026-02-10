import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AGBPage() {
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
          <h1 className="text-lg font-bold text-gray-900 truncate">Allgemeine Geschäftsbedingungen</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-8 text-[15px] text-gray-600 leading-relaxed space-y-5">
        <p className="text-sm text-gray-400">Gültig ab: Januar 2025</p>

        <h2 className="text-base font-bold text-gray-900">1. Geltungsbereich</h2>
        <p>Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Software «Recipe Digitizer», entwickelt und bereitgestellt von Lweb Schweiz.</p>

        <h2 className="text-base font-bold text-gray-900">2. Leistungsbeschreibung</h2>
        <p>Recipe Digitizer ist eine webbasierte Anwendung (PWA) zur Digitalisierung, Verwaltung und Organisation von Rezepten mittels künstlicher Intelligenz. Die Software umfasst:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>KI-gestützte Rezeptdigitalisierung aus Bildern</li>
          <li>Rezeptverwaltung mit Bibliothek und Suchfunktion</li>
          <li>Rollenbasiertes Benutzersystem (Administrator, Mitarbeiter, Gast)</li>
          <li>Kommentar- und Bewertungssystem</li>
          <li>Intelligenter Portionsrechner</li>
          <li>Offline-Funktionalität als PWA</li>
        </ul>

        <h2 className="text-base font-bold text-gray-900">3. Nutzungsrechte</h2>
        <p>Der Kunde erhält ein nicht-exklusives, nicht übertragbares Nutzungsrecht an der Software für den vereinbarten Einsatzzweck. Die Software darf nicht ohne schriftliche Genehmigung weiterverkauft, kopiert oder verändert werden.</p>

        <h2 className="text-base font-bold text-gray-900">4. Verfügbarkeit</h2>
        <p>Lweb Schweiz bemüht sich um eine hohe Verfügbarkeit der Anwendung. Eine Garantie von 100% Verfügbarkeit kann nicht gewährleistet werden. Wartungsarbeiten werden nach Möglichkeit im Voraus angekündigt.</p>

        <h2 className="text-base font-bold text-gray-900">5. Haftung</h2>
        <p>Lweb Schweiz haftet nicht für Datenverluste durch unsachgemässe Nutzung, höhere Gewalt oder Ausfälle von Drittanbietern (z.B. KI-Dienste). Die Haftung beschränkt sich auf den Vertragswert der Software.</p>

        <h2 className="text-base font-bold text-gray-900">6. Zahlungsbedingungen</h2>
        <p>Die Zahlungsbedingungen werden im individuellen Angebot festgelegt. Standardmässig gelten 30 Tage Zahlungsfrist ab Rechnungsstellung. Alle Preise verstehen sich in CHF und exklusive MwSt.</p>

        <h2 className="text-base font-bold text-gray-900">7. Kündigung</h2>
        <p>Der Vertrag kann von beiden Seiten mit einer Frist von 30 Tagen schriftlich gekündigt werden. Bei Kündigung werden alle Kundendaten auf Wunsch exportiert und anschliessend gelöscht.</p>

        <h2 className="text-base font-bold text-gray-900">8. Anwendbares Recht</h2>
        <p>Es gilt Schweizer Recht. Gerichtsstand ist der Sitz von Lweb Schweiz.</p>
      </main>
    </div>
  )
}
