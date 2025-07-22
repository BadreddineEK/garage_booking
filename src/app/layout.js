import Link from "next/link";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-white">
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="text-2xl">🔧</span>
                  <span className="text-xl font-bold text-gray-800">GarageBooking</span>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Accueil
                </Link>
                <Link 
                  href="/search" 
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Rechercher
                </Link>
                <Link 
                  href="/how-it-works" 
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Comment ça marche
                </Link>
              </div>

              {/* Right side buttons */}
              <div className="flex items-center space-x-4">
                <Link 
                  href="/pro"
                  className="hidden sm:inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors duration-200"
                >
                  <span className="mr-1">💼</span>
                  Espace Pro
                </Link>
                <Link 
                  href="/login" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  title="Connexion"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2" 
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
                  <span className="hidden sm:inline">Connexion</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile menu - can be expanded later */}
          <div className="md:hidden px-6 py-3 border-t border-gray-200">
            <Link 
              href="/pro"
              className="inline-flex items-center text-green-600 hover:text-green-700"
            >
              <span className="mr-1">💼</span>
              Espace Professionnel
            </Link>
          </div>
        </nav>
        
        <main>
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">GarageBooking</h3>
                <p className="text-gray-300 text-sm">
                  La marketplace qui connecte les automobilistes aux meilleurs professionnels près de chez eux.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Pour les clients</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link href="/" className="hover:text-white">Rechercher un garage</Link></li>
                  <li><Link href="/how-it-works" className="hover:text-white">Comment ça marche</Link></li>
                  <li><Link href="/contact" className="hover:text-white">Support</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Pour les professionnels</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link href="/pro/register" className="hover:text-white">Créer mon compte</Link></li>
                  <li><Link href="/pro" className="hover:text-white">Espace pro</Link></li>
                  <li><Link href="/pro/help" className="hover:text-white">Aide professionnels</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Légal</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link href="/terms" className="hover:text-white">Conditions d&apos;utilisation</Link></li>
                  <li><Link href="/privacy" className="hover:text-white">Politique de confidentialité</Link></li>
                  <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
              <p>&copy; 2024 GarageBooking. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
        
        <Analytics />
      </body>
    </html>
  );
}