"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState(null);

  const SERVICES = [
    { id: 1, name: "Lavage intérieur express", price: 40, duration: 30, description: "Nettoyage rapide de l'habitacle, aspiration, essuyage des surfaces", category: "lavage" },
    { id: 2, name: "Lavage intérieur intégral", price: 50, duration: 60, description: "Nettoyage complet de l'habitacle, traitement des cuirs, désinfection", category: "lavage" },
    { id: 3, name: "Lavage extérieur express", price: 20, duration: 20, description: "Lavage rapide de la carrosserie, jantes et vitres", category: "lavage" },
    { id: 4, name: "Lavage extérieur intégral", price: 30, duration: 40, description: "Lavage complet, cire, traitement des jantes et vitres", category: "lavage" },
    { id: 5, name: "Vidange", price: 60, duration: 60, description: "Vidange d'huile et changement du filtre", category: "mecanique" },
    { id: 6, name: "Diagnostic", price: 40, duration: 30, description: "Analyse complète de votre véhicule", category: "mecanique" },
    { id: 7, name: "Montage pneus", price: 30, duration: 30, description: "Montage et équilibrage de vos pneus", category: "autre" }
  ];

  const handleServiceClick = (service) => {
    setSelectedService(service);
    router.push(`/appointments?service=${service.id}`);
  };

  return (
    <div className="p-8 bg-white">
      {/* Section Hero */}
      <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100 mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Bienvenue à O&apos;G Automobiles</h1>
        <p className="text-xl text-gray-700 mb-8">
          Votre spécialiste du lavage automobile et de la mécanique à Beynost
        </p>
        <div className="flex justify-center">
          <Link 
            href="/appointments" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Prendre un RDV maintenant
          </Link>
        </div>
      </div>

      {/* Section Services */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Nos Services</h2>
        
        {/* Services de Lavage */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Lavage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.filter(service => service.category === "lavage").map(service => (
              <div 
                key={service.id} 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => handleServiceClick(service)}
              >
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h4>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">{service.price}€</span>
                  <span className="text-sm text-gray-500">{service.duration} min</span>
                </div>
                <button 
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                >
                  Réserver ce service
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Services de Mécanique */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Mécanique</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.filter(service => service.category === "mecanique").map(service => (
              <div 
                key={service.id} 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => handleServiceClick(service)}
              >
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h4>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">{service.price}€</span>
                  <span className="text-sm text-gray-500">{service.duration} min</span>
                </div>
                <button 
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                >
                  Réserver ce service
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Autres Services */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Autres Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.filter(service => service.category === "autre").map(service => (
              <div 
                key={service.id} 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => handleServiceClick(service)}
              >
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h4>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">{service.price}€</span>
                  <span className="text-sm text-gray-500">{service.duration} min</span>
                </div>
                <button 
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                >
                  Réserver ce service
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Contact */}
      <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Contactez-nous</h2>
          <p className="text-lg text-gray-700">
            Une question ? Un projet ? N&apos;hésitez pas à nous contacter !
          </p>
        </div>
        <div className="flex justify-center">
          <Link 
            href="/contact" 
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors duration-200"
          >
            Nous contacter
          </Link>
        </div>
      </div>

      {/* Section Informations */}
      <div className="mt-12 bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations Pratiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📍 Adresse</h3>
            <p className="text-gray-700">
              604 Route de Geneve<br />
              01700 Beynost<br />
              France
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">⏰ Horaires d&apos;ouverture</h3>
            <p className="text-gray-700">
              Lundi - Vendredi : 8h00 - 19h00<br />
              Samedi : 9h00 - 17h00<br />
              Dimanche : 9h00 - 12h00
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📞 Contact</h3>
            <p className="text-gray-700">
              Téléphone : 07 45 82 08 94<br />
              Email : contact@garage.fr<br />
              Snapchat : OG.AUTO69
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">💳 Paiement</h3>
            <p className="text-gray-700">
              Nous acceptons :<br />
              - Carte bancaire<br />
              - Espèces<br />
              - Virement bancaire
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}