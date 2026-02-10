import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link
            href="/"
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900 truncate">Impressum</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-8 text-[15px] text-gray-600 leading-relaxed space-y-5">
        <h2 className="text-base font-bold text-gray-900">Angaben gemäss Schweizer Recht</h2>

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

        <h2 className="text-base font-bold text-gray-900">Haftungsausschluss</h2>
        <p>Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen. Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen entstanden sind, werden ausgeschlossen.</p>

        <h2 className="text-base font-bold text-gray-900">Urheberrechte</h2>
        <p>Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf dieser Anwendung gehören ausschliesslich Lweb Schweiz oder den speziell genannten Rechtsinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung der Urheberrechtsträger im Voraus einzuholen.</p>

        <h2 className="text-base font-bold text-gray-900">Kontakt</h2>
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
      </main>
    </div>
  )
}
