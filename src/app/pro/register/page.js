"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProRegister() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1: Informations de base
    businessName: "",
    category: "",
    description: "",
    
    // Étape 2: Contact et localisation
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    website: "",
    
    // Étape 3: Services et tarifs
    services: [],
    
    // Étape 4: Horaires et disponibilités
    openingHours: {},
    
    // Étape 5: Informations légales
    siret: "",
    vat: "",
    terms: false
  });

  const categories = [
    "Garage Automobile",
    "Garage Moto",
    "Carrosserie",
    "Pneumatiques",
    "Contrôle Technique",
    "Station de lavage",
    "Mécanique rapide",
    "Réparation électronique"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // En réalité, ici on sauvegarderait les données dans Supabase
    console.log("Données d'inscription:", formData);
    router.push("/pro?success=registration");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Rejoignez GarageBooking
          </h1>
          <p className="text-lg text-gray-600">
            Développez votre activité avec notre plateforme de réservation
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5].map(step => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-24 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Informations</span>
            <span>Contact</span>
            <span>Services</span>
            <span>Horaires</span>
            <span>Finalisation</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Étape 1: Informations de base */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Informations de base</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de votre entreprise *
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Garage Martin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie d&apos;activité *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description de votre activité *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Décrivez vos services et spécialités..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 2: Contact et localisation */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact et localisation</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse complète *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Numéro et nom de rue"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code postal *
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email professionnel *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web (optionnel)
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://votre-site.fr"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Services */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Vos services</h2>
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">
                    💡 Vous pourrez ajouter et modifier vos services depuis votre espace professionnel après inscription.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Services typiques pour votre catégorie :</h3>
                  {formData.category === "Garage Automobile" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Vidange + filtre</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Révision complète</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Changement pneus</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Diagnostic panne</span>
                      </div>
                    </div>
                  )}
                  
                  {formData.category === "Station de lavage" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Lavage extérieur</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Lavage complet</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Nettoyage intérieur</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Lustrage</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Étape 4: Horaires */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Horaires d&apos;ouverture</h2>
              <div className="space-y-4">
                {[
                  { key: "monday", label: "Lundi" },
                  { key: "tuesday", label: "Mardi" },
                  { key: "wednesday", label: "Mercredi" },
                  { key: "thursday", label: "Jeudi" },
                  { key: "friday", label: "Vendredi" },
                  { key: "saturday", label: "Samedi" },
                  { key: "sunday", label: "Dimanche" }
                ].map(day => (
                  <div key={day.key} className="flex items-center space-x-4">
                    <div className="w-24">
                      <label className="text-sm font-medium text-gray-700">
                        {day.label}
                      </label>
                    </div>
                    <input
                      type="checkbox"
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Ouvert</span>
                    <div className="flex space-x-2">
                      <input
                        type="time"
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                        defaultValue="08:00"
                      />
                      <span className="self-center">à</span>
                      <input
                        type="time"
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                        defaultValue="18:00"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Étape 5: Finalisation */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Finalisation</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro SIRET
                    </label>
                    <input
                      type="text"
                      value={formData.siret}
                      onChange={(e) => handleInputChange("siret", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro TVA (si applicable)
                    </label>
                    <input
                      type="text"
                      value={formData.vat}
                      onChange={(e) => handleInputChange("vat", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Résumé de votre inscription</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Entreprise:</strong> {formData.businessName}</p>
                    <p><strong>Catégorie:</strong> {formData.category}</p>
                    <p><strong>Adresse:</strong> {formData.address}, {formData.city}</p>
                    <p><strong>Contact:</strong> {formData.phone} - {formData.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.terms}
                    onChange={(e) => handleInputChange("terms", e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <label className="text-sm text-gray-700">
                    J&apos;accepte les{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      conditions d&apos;utilisation
                    </Link>{" "}
                    et la{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      politique de confidentialité
                    </Link>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg ${
                currentStep === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              } transition-colors`}
            >
              Précédent
            </button>

            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData.terms}
                className={`px-6 py-2 rounded-lg ${
                  formData.terms
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } transition-colors`}
              >
                Créer mon compte
              </button>
            )}
          </div>
        </div>

        {/* Benefits section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-xl font-bold text-center mb-8">
            Pourquoi rejoindre GarageBooking ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h4 className="font-semibold mb-2">Augmentez votre visibilité</h4>
              <p className="text-gray-600 text-sm">
                Touchez de nouveaux clients dans votre région
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h4 className="font-semibold mb-2">Gestion simplifiée</h4>
              <p className="text-gray-600 text-sm">
                Automatisez vos réservations et plannings
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-semibold mb-2">Développez votre CA</h4>
              <p className="text-gray-600 text-sm">
                Réduisez les créneaux vides et optimisez votre activité
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}