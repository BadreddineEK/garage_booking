export default function Home() {
  const SERVICES = [
    { id: 1, name: "Lavage intérieur express", price: 40, duration: 30, description: "Nettoyage rapide de l'habitacle, aspiration, essuyage des surfaces" },
    { id: 2, name: "Lavage intérieur intégral", price: 50, duration: 60, description: "Nettoyage complet de l'habitacle, traitement des cuirs, désinfection" },
    { id: 3, name: "Lavage extérieur express", price: 20, duration: 20, description: "Lavage rapide de la carrosserie, jantes et vitres" },
    { id: 4, name: "Lavage extérieur intégral", price: 30, duration: 40, description: "Lavage complet, cire, traitement des jantes et vitres" },
  ];

  return (
    <div className="p-8 bg-white">
      {/* Section Hero */}
      <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100 mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Bienvenue dans votre Garage</h1>
        <p className="text-lg text-gray-700 mb-6">
          Gérez vos rendez-vous et vos disponibilités en toute simplicité.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">📅 Prendre un Rendez-vous</h2>
            <p className="text-gray-700 mb-4">
              Réservez facilement un créneau pour vos services de lavage automobile.
            </p>
            <a 
              href="/appointments" 
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Prendre un RDV maintenant
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">📊 Espace Pro</h2>
            <p className="text-gray-700 mb-4">
              Gérez vos disponibilités et suivez vos rendez-vous en temps réel.
            </p>
            <a 
              href="/dashboard" 
              className="inline-block bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors duration-200"
            >
              Accéder au Dashboard
            </a>
          </div>
        </div>
      </div>

      {/* Section Services */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Nos Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map(service => (
            <div key={service.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">{service.price}€</span>
                <span className="text-sm text-gray-500">{service.duration} min</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Informations */}
      <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations Pratiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📍 Adresse</h3>
            <p className="text-gray-700">
              123 Rue du Garage<br />
              75000 Paris<br />
              France
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">⏰ Horaires d&apos;ouverture</h3>
            <p className="text-gray-700">
              Lundi - Vendredi : 8h00 - 19h00<br />
              Samedi : 9h00 - 17h00<br />
              Dimanche : Fermé
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📞 Contact</h3>
            <p className="text-gray-700">
              Téléphone : 01 23 45 67 89<br />
              Email : contact@garage.fr
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