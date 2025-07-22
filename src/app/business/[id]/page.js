"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function BusinessPage() {
  const params = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock business data - in real app, this would come from Supabase
  const mockBusinessData = {
    1: {
      id: 1,
      name: "O'G Automobiles",
      category: "Garage Automobile",
      description: "Spécialiste du lavage automobile et de la mécanique à Beynost depuis 2015",
      fullDescription: "O'G Automobiles est votre partenaire de confiance pour l'entretien et la réparation de votre véhicule. Notre équipe de professionnels qualifiés vous accueille dans un cadre moderne et équipé des dernières technologies. Nous proposons une gamme complète de services, du simple lavage à la réparation mécanique complexe.",
      location: "Beynost, 01700",
      address: "604 Route de Genève, 01700 Beynost",
      phone: "07 45 82 08 94",
      email: "contact@og-automobiles.fr",
      website: "https://og-automobiles.fr",
      rating: 4.8,
      reviews: 127,
      images: ["/api/placeholder/800/400", "/api/placeholder/400/300", "/api/placeholder/400/300"],
      priceRange: "€€",
      verified: true,
      openingHours: {
        monday: "8h00 - 19h00",
        tuesday: "8h00 - 19h00", 
        wednesday: "8h00 - 19h00",
        thursday: "8h00 - 19h00",
        friday: "8h00 - 19h00",
        saturday: "9h00 - 17h00",
        sunday: "9h00 - 12h00"
      },
      services: [
        {
          id: 1,
          category: "Lavage",
          name: "Lavage extérieur",
          description: "Lavage complet de la carrosserie",
          price: 15,
          duration: 30
        },
        {
          id: 2,
          category: "Lavage", 
          name: "Lavage intérieur + extérieur",
          description: "Formule complète avec aspirateur et nettoyage intérieur",
          price: 25,
          duration: 60,
          featured: true
        },
        {
          id: 3,
          category: "Mécanique",
          name: "Vidange + filtre",
          description: "Vidange moteur avec changement du filtre à huile",
          price: 80,
          duration: 45
        },
        {
          id: 4,
          category: "Mécanique",
          name: "Contrôle technique",
          description: "Préparation et passage du contrôle technique",
          price: 120,
          duration: 90
        }
      ],
      reviews: [
        {
          id: 1,
          customerName: "Marie L.",
          rating: 5,
          comment: "Service impeccable ! Mon véhicule était comme neuf après le lavage complet.",
          date: "2024-01-15"
        },
        {
          id: 2,
          customerName: "Jean-Pierre M.", 
          rating: 5,
          comment: "Très professionnel, délais respectés. Je recommande vivement !",
          date: "2024-01-10"
        },
        {
          id: 3,
          customerName: "Sophie R.",
          rating: 4,
          comment: "Bon service, tarifs corrects. L'accueil est très sympa.",
          date: "2024-01-08"
        }
      ],
      businessHours: "Lun-Ven: 8h-19h, Sam: 9h-17h, Dim: 9h-12h",
      paymentMethods: ["Carte bancaire", "Espèces", "Virement"],
      specialties: ["Lavage haute pression", "Mécanique générale", "Diagnostic électronique"],
      certifications: ["Qualité Auto", "Formation constructeur"]
    }
  };

  useEffect(() => {
    const businessData = mockBusinessData[params.id];
    if (businessData) {
      setBusiness(businessData);
    }
    setIsLoading(false);
  }, [params.id]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    router.push(`/appointments?business=${params.id}&service=${service.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Garage non trouvé</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Business Images */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{business.name}</h1>
                <p className="text-xl opacity-90 mb-2">{business.description}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="font-semibold">{business.rating}</span>
                    <span className="opacity-75 ml-1">({business.reviews.length} avis)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">📍</span>
                    <span>{business.location}</span>
                  </div>
                  {business.verified && (
                    <div className="bg-green-500 px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ Vérifié
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Services and Info */}
          <div className="lg:col-span-2">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => router.push(`/appointments?business=${params.id}`)}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  📅 Réserver maintenant
                </button>
                <a 
                  href={`tel:${business.phone}`}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                >
                  📞 Appeler
                </a>
                <button className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                  📍 Itinéraire
                </button>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Nos Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {business.services.map(service => (
                  <div 
                    key={service.id}
                    className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${
                      service.featured ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{service.name}</h3>
                      <span className="text-lg font-bold text-blue-600">{service.price}€</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{service.duration} min</span>
                      <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                        Réserver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">À propos</h2>
              <p className="text-gray-700 mb-4">{business.fullDescription}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Spécialités</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    {business.specialties.map((specialty, index) => (
                      <li key={index}>• {specialty}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Certifications</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    {business.certifications.map((cert, index) => (
                      <li key={index}>• {cert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Avis clients</h2>
              <div className="space-y-4">
                {business.reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center">
                          <span className="font-semibold">{review.customerName}</span>
                          <div className="flex ml-2">
                            {[...Array(review.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400">⭐</span>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Info */}
          <div>
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-6">
              <h3 className="font-bold text-gray-800 mb-4">Informations de contact</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-gray-500 mr-2">📍</span>
                  <div>
                    <p className="text-gray-800">{business.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">📞</span>
                  <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline">
                    {business.phone}
                  </a>
                </div>
                
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">✉️</span>
                  <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline">
                    {business.email}
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Horaires d&apos;ouverture</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span>8h00 - 19h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span>9h00 - 17h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span>9h00 - 12h00</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Moyens de paiement</h4>
                <div className="flex flex-wrap gap-2">
                  {business.paymentMethods.map((method, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}