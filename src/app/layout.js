import Link from "next/link";
import "./globals.css"; // Assure-toi d'avoir un fichier de styles globaux
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-white">
        <nav className="bg-gray-50 border-b border-gray-100 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex gap-6">
              <Link href="/" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">Accueil</Link>
              <Link href="/appointments" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">Rendez-vous</Link>
            </div>
            <Link 
              href="/login" 
              className="p-2 text-gray-800 hover:text-blue-600 transition-colors duration-200"
              title="Accès espace pro"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </Link>
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