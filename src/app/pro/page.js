"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for professional dashboard
  const businessStats = {
    totalBookings: 156,
    monthlyBookings: 42,
    revenue: 3240,
    rating: 4.8,
    reviews: 127,
    profileViews: 892
  };

  const recentBookings = [
    {
      id: 1,
      customerName: "Marie Dupont",
      service: "Lavage complet",
      date: "2024-01-20",
      time: "14:00",
      price: 25,
      status: "confirmed"
    },
    {
      id: 2,
      customerName: "Jean Martin",
      service: "Vidange + filtre",
      date: "2024-01-20",
      time: "16:30",
      price: 80,
      status: "pending"
    },
    {
      id: 3,
      customerName: "Sophie Bernard",
      service: "Lavage extérieur",
      date: "2024-01-21",
      time: "10:00",
      price: 15,
      status: "confirmed"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Espace Professionnel</h1>
              <p className="text-gray-600">O&apos;G Automobiles</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/business/1"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voir ma page
              </Link>
              <Link 
                href="/"
                className="text-gray-600 hover:text-gray-800"
              >
                Retour au site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "overview" 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    📊 Vue d&apos;ensemble
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "bookings" 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    📅 Réservations
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("services")}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "services" 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    🔧 Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "profile" 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    🏪 Mon profil
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "reviews" 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    ⭐ Avis clients
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "analytics" 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    📈 Statistiques
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <span className="text-2xl">📅</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Réservations ce mois</p>
                        <p className="text-2xl font-bold text-gray-800">{businessStats.monthlyBookings}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <span className="text-2xl">💰</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Chiffre d&apos;affaires</p>
                        <p className="text-2xl font-bold text-gray-800">{businessStats.revenue}€</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <span className="text-2xl">⭐</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Note moyenne</p>
                        <p className="text-2xl font-bold text-gray-800">{businessStats.rating}/5</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Réservations récentes</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2">Client</th>
                          <th className="text-left py-2">Service</th>
                          <th className="text-left py-2">Date</th>
                          <th className="text-left py-2">Prix</th>
                          <th className="text-left py-2">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map(booking => (
                          <tr key={booking.id} className="border-b border-gray-100">
                            <td className="py-3">{booking.customerName}</td>
                            <td className="py-3">{booking.service}</td>
                            <td className="py-3">{booking.date} {booking.time}</td>
                            <td className="py-3">{booking.price}€</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Customization Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-6">Personnaliser mon profil</h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de l&apos;entreprise
                      </label>
                      <input
                        type="text"
                        defaultValue="O'G Automobiles"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Garage Automobile</option>
                        <option>Garage Moto</option>
                        <option>Carrosserie</option>
                        <option>Pneumatiques</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description courte
                    </label>
                    <input
                      type="text"
                      defaultValue="Spécialiste du lavage automobile et de la mécanique"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description détaillée
                    </label>
                    <textarea
                      rows={4}
                      defaultValue="O'G Automobiles est votre partenaire de confiance pour l'entretien et la réparation de votre véhicule..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        defaultValue="604 Route de Genève, 01700 Beynost"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        defaultValue="07 45 82 08 94"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spécialités (séparées par des virgules)
                    </label>
                    <input
                      type="text"
                      defaultValue="Lavage haute pression, Mécanique générale, Diagnostic électronique"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Enregistrer les modifications
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Services Management Tab */}
            {activeTab === "services" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Gestion des services</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    + Ajouter un service
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">Lavage extérieur</h4>
                        <p className="text-gray-600 text-sm">Lavage complet de la carrosserie</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-blue-600 font-semibold">15€</span>
                          <span className="text-gray-500 text-sm">30 min</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Actif</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Modifier</button>
                        <button className="text-red-600 hover:text-red-800">Supprimer</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">Lavage complet</h4>
                        <p className="text-gray-600 text-sm">Lavage intérieur + extérieur</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-blue-600 font-semibold">25€</span>
                          <span className="text-gray-500 text-sm">60 min</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Actif</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Modifier</button>
                        <button className="text-red-600 hover:text-red-800">Supprimer</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs can be added here */}
            {activeTab === "bookings" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-6">Gestion des réservations</h3>
                <p className="text-gray-600">Interface de gestion des réservations à développer...</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-6">Avis clients</h3>
                <p className="text-gray-600">Interface de gestion des avis à développer...</p>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-6">Statistiques détaillées</h3>
                <p className="text-gray-600">Tableau de bord analytique à développer...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}