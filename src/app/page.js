"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for businesses (in real app, this would come from Supabase)
  const mockBusinesses = [
    {
      id: 1,
      name: "O'G Automobiles",
      category: "Garage Automobile",
      description: "Spécialiste du lavage automobile et de la mécanique",
      location: "Beynost, 01700",
      rating: 4.8,
      reviews: 127,
      image: "/api/placeholder/300/200",
      services: ["Lavage", "Mécanique", "Réparation"],
      priceRange: "€€",
      verified: true
    },
    {
      id: 2,
      name: "AutoCare Plus",
      category: "Garage Automobile",
      description: "Entretien complet et réparations automobiles",
      location: "Lyon, 69000",
      rating: 4.6,
      reviews: 89,
      image: "/api/placeholder/300/200",
      services: ["Entretien", "Diagnostic", "Pneumatiques"],
      priceRange: "€€€",
      verified: true
    },
    {
      id: 3,
      name: "Moto Service Lyon",
      category: "Garage Moto",
      description: "Réparation et entretien motos et scooters",
      location: "Villeurbanne, 69100",
      rating: 4.7,
      reviews: 156,
      image: "/api/placeholder/300/200",
      services: ["Moto", "Scooter", "Entretien"],
      priceRange: "€€",
      verified: false
    },
    {
      id: 4,
      name: "Carrosserie Express",
      category: "Carrosserie",
      description: "Réparation carrosserie et peinture automobile",
      location: "Meyzieu, 69330",
      rating: 4.5,
      reviews: 74,
      image: "/api/placeholder/300/200",
      services: ["Carrosserie", "Peinture", "Débosselage"],
      priceRange: "€€€",
      verified: true
    },
    {
      id: 5,
      name: "Pneus & Services",
      category: "Pneumatiques",
      description: "Vente et montage de pneumatiques",
      location: "Décines, 69150",
      rating: 4.3,
      reviews: 92,
      image: "/api/placeholder/300/200",
      services: ["Pneumatiques", "Jantes", "Parallélisme"],
      priceRange: "€",
      verified: true
    },
    {
      id: 6,
      name: "Contrôle Technique Rhône",
      category: "Contrôle Technique",
      description: "Contrôle technique automobile rapide",
      location: "Bron, 69500",
      rating: 4.4,
      reviews: 203,
      image: "/api/placeholder/300/200",
      services: ["Contrôle technique", "Contre-visite"],
      priceRange: "€",
      verified: true
    }
  ];

  useEffect(() => {
    setBusinesses(mockBusinesses);
  }, []);

  const categories = [
    { id: "all", name: "Tous les services" },
    { id: "Garage Automobile", name: "Garages Automobile" },
    { id: "Garage Moto", name: "Garages Moto" },
    { id: "Carrosserie", name: "Carrosserie" },
    { id: "Pneumatiques", name: "Pneumatiques" },
    { id: "Contrôle Technique", name: "Contrôle Technique" }
  ];

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || business.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBusinessClick = (businessId) => {
    router.push(`/business/${businessId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Trouvez le garage parfait près de chez vous
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Découvrez et réservez chez les meilleurs professionnels automobiles
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-2 shadow-lg">
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                placeholder="Rechercher un garage, service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 text-gray-800 rounded-md border-0 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 text-gray-800 rounded-md border-0 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Business Listings */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {filteredBusinesses.length} professionnel{filteredBusinesses.length > 1 ? 's' : ''} trouvé{filteredBusinesses.length > 1 ? 's' : ''}
          </h2>
          
          {/* Professional CTA */}
          <Link 
            href="/pro/register"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
          >
            Vous êtes professionnel ?
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBusinesses.map(business => (
              <div 
                key={business.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
                onClick={() => handleBusinessClick(business.id)}
              >
                {/* Business Image */}
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <span className="text-white text-6xl">🔧</span>
                  </div>
                  {business.verified && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      ✓ Vérifié
                    </div>
                  )}
                </div>

                {/* Business Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{business.name}</h3>
                    <span className="text-sm font-semibold text-gray-600">{business.priceRange}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{business.description}</p>
                  
                  <div className="flex items-center mb-3">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="font-semibold">{business.rating}</span>
                    <span className="text-gray-500 ml-1">({business.reviews} avis)</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 mb-4">
                    <span className="mr-1">📍</span>
                    <span>{business.location}</span>
                  </div>
                  
                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {business.services.slice(0, 3).map((service, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                    Voir les disponibilités
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredBusinesses.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>

      {/* How it works section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Comment ça marche ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Recherchez</h3>
              <p className="text-gray-600">
                Trouvez le professionnel qui correspond à vos besoins près de chez vous
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Réservez</h3>
              <p className="text-gray-600">
                Choisissez votre créneau et réservez en ligne en quelques clics
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Profitez</h3>
              <p className="text-gray-600">
                Rendez-vous chez votre professionnel et profitez du service
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <SpeedInsights />
    </div>
  );
}