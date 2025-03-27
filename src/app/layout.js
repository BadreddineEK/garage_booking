import Link from "next/link";
import "./globals.css"; // Assure-toi d'avoir un fichier de styles globaux
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-white">
        <nav className="bg-gray-50 border-b border-gray-100 p-4">
          <div className="max-w-7xl mx-auto flex gap-6">
            <Link href="/" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">Accueil</Link>
            <Link href="/appointments" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">Rendez-vous</Link>
            <Link href="/dashboard" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">Dashboard</Link>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}