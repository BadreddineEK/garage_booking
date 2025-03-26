"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';

export default function DashboardLayout({ children }) {
  const [activeSection, setActiveSection] = useState('overview');
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
        </div>
        <nav className="mt-4">
          <button
            onClick={() => scrollToSection('overview')}
            className={`w-full text-left px-4 py-2 text-sm font-medium ${
              activeSection === 'overview'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => scrollToSection('appointments')}
            className={`w-full text-left px-4 py-2 text-sm font-medium ${
              activeSection === 'appointments'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Rendez-vous
          </button>
          <button
            onClick={() => scrollToSection('availabilities')}
            className={`w-full text-left px-4 py-2 text-sm font-medium ${
              activeSection === 'availabilities'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Disponibilités
          </button>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
          >
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
} 