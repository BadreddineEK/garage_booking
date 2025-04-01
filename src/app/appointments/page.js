"use client";

import { useState, useEffect, useCallback } from "react";
import supabase from "@/utils/supabase";
import Image from 'next/image';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function AppointmentsPage() {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [total, setTotal] = useState(0);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [activeCategory, setActiveCategory] = useState("lavage");
  const [availableDates, setAvailableDates] = useState([]);
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [services, setServices] = useState([]);

  // Récupérer les services depuis la base de données
  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Erreur lors de la récupération des services:', error);
        return;
      }

      // Organiser les services par catégorie
      const servicesByCategory = data.reduce((acc, service) => {
        if (!acc[service.category]) {
          acc[service.category] = [];
        }
        acc[service.category].push(service);
        return acc;
      }, {});

      setServices(servicesByCategory);
    }

    fetchServices();
  }, []);

  // Récupérer le service présélectionné depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get('service');
    if (serviceId) {
      // Trouver le service dans toutes les catégories
      Object.values(services).forEach(categoryServices => {
        const service = categoryServices.find(s => s.id === parseInt(serviceId));
        if (service) {
          setSelectedServices([service]);
          setActiveCategory(service.category);
        }
      });
    }
  }, [services]);

  async function fetchAppointments() {
    let { data, error } = await supabase.from("appointments").select("*");
    if (!error) setAppointments(data);
  }

  const fetchAvailableSlots = useCallback(async () => {
    if (!date || selectedServices.length === 0) {
      setAvailableSlots([]);
      return;
    }

    try {
      // Calculer la durée totale des services sélectionnés
      const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);

      // Récupérer les rendez-vous existants pour la date sélectionnée
      const { data: existingAppointments, error: appointmentsError } = await supabase
        .from("appointments")
        .select("start_time, end_time")
        .eq("date", date);

      if (appointmentsError) {
        console.error("Erreur lors de la récupération des rendez-vous:", appointmentsError);
        return;
      }

      // Récupérer les disponibilités pour la date sélectionnée
      const { data: availabilities, error: availabilitiesError } = await supabase
        .from("availabilities")
        .select("start_time, end_time")
        .eq("date", date);

      if (availabilitiesError) {
        console.error("Erreur lors de la récupération des disponibilités:", availabilitiesError);
        return;
      }

      // Si aucune disponibilité n'est définie pour cette date, retourner un tableau vide
      if (!availabilities || availabilities.length === 0) {
        setAvailableSlots([]);
        return;
      }

      // Convertir les heures de début et de fin en objets Date
      const startTime = new Date(`${date}T${availabilities[0].start_time}`);
      const endTime = new Date(`${date}T${availabilities[0].end_time}`);

      // Générer tous les créneaux possibles
      const allSlots = [];
      let currentTime = new Date(startTime);

      while (currentTime < endTime) {
        const slotStart = currentTime.toTimeString().slice(0, 5);
        const slotEnd = new Date(currentTime.getTime() + totalDuration * 60000).toTimeString().slice(0, 5);
        allSlots.push(`${slotStart}-${slotEnd}`);
        currentTime = new Date(currentTime.getTime() + 30 * 60000); // Incrémenter de 30 minutes
      }

      // Filtrer les créneaux qui chevauchent des rendez-vous existants
      const available = allSlots.filter(slot => {
        const [slotStart, slotEnd] = slot.split("-");
        return !existingAppointments.some(appointment => {
      const appointmentStart = new Date(`${date}T${appointment.start_time}`);
      const appointmentEnd = new Date(`${date}T${appointment.end_time}`);
          const slotStartTime = new Date(`${date}T${slotStart}`);
          const slotEndTime = new Date(`${date}T${slotEnd}`);
          return (
            (slotStartTime >= appointmentStart && slotStartTime < appointmentEnd) ||
            (slotEndTime > appointmentStart && slotEndTime <= appointmentEnd) ||
            (slotStartTime <= appointmentStart && slotEndTime >= appointmentEnd)
          );
        });
      });

      setAvailableSlots(available);
    } catch (error) {
      console.error("Erreur lors de la récupération des créneaux:", error);
      setAvailableSlots([]);
    }
  }, [date, selectedServices]);

  const fetchAvailableDates = useCallback(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];
    const currentYear = today.getFullYear();
    
    console.log("Date du jour:", todayString);
    console.log("Année en cours:", currentYear);

    // Récupérer les disponibilités pour aujourd'hui et les jours suivants
    const { data: availabilities, error } = await supabase
      .from("availabilities")
      .select("date")
      .gte("date", todayString)
      .order('date', { ascending: true });

    if (error) {
      console.error("Erreur lors de la récupération des dates disponibles:", error);
      return;
    }

    // Si aucune disponibilité n'est trouvée, on crée les dates pour l'année en cours
    if (!availabilities || availabilities.length === 0) {
      const dates = [];
      const startDate = new Date(currentYear, 0, 1); // 1er janvier de l'année en cours
      const endDate = new Date(currentYear, 11, 31); // 31 décembre de l'année en cours
      
      // Créer des disponibilités pour chaque jour de l'année
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];
        dates.push(dateString);
      }

      // Insérer les dates dans la base de données
      for (const dateString of dates) {
        await supabase
          .from("availabilities")
          .insert([
            {
              date: dateString,
              start_time: "08:00:00",
              end_time: "19:00:00"
            }
          ]);
      }

      setAvailableDates(dates);
      return;
    }

    const dates = availabilities.map(a => a.date);
    console.log("Dates disponibles dans la base de données:", dates);
    setAvailableDates(dates);
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (date && selectedServices.length > 0) {
      fetchAvailableSlots();
    }
  }, [date, selectedServices, fetchAvailableSlots]);

  useEffect(() => {
    const newTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
    setTotal(newTotal);
  }, [selectedServices]);

  useEffect(() => {
    fetchAvailableDates();
  }, [fetchAvailableDates]);

  const handleServiceSelect = (service) => {
    setSelectedServices(prev => {
      // Si le service est déjà sélectionné, on le retire
      if (prev.some(s => s.id === service.id)) {
        return prev.filter(s => s.id !== service.id);
      }

      // Si c'est un service de lavage
      if (service.category === 'lavage') {
        // Si c'est la formule complète
        if (service.name.includes("intérieur") && service.name.includes("extérieur")) {
          // Retirer tous les autres services de lavage
          return [...prev.filter(s => s.category !== 'lavage'), service];
        }
        
        // Si c'est un service intérieur
        if (service.name.includes("intérieur")) {
          // Retirer la formule complète et les autres services intérieurs
          return [...prev.filter(s => 
            s.category !== 'lavage' || 
            (!s.name.includes("intérieur") && !s.name.includes("extérieur"))
          ), service];
        }
        
        // Si c'est un service extérieur
        if (service.name.includes("extérieur")) {
          // Retirer la formule complète et les autres services extérieurs
          return [...prev.filter(s => 
            s.category !== 'lavage' || 
            (!s.name.includes("extérieur") && !s.name.includes("extérieur"))
          ), service];
        }
      }

      // Pour les autres services, on peut en avoir plusieurs
      return [...prev, service];
    });
  };

  const isServiceSelected = (serviceId) => {
    return selectedServices.some(s => s.id === serviceId);
  };

  const isServiceDisabled = (service) => {
    // Si le lavage complet est sélectionné, désactiver tous les autres services de lavage
    const hasCompleteWash = selectedServices.some(s => 
      s.category === 'lavage' && 
      s.name.includes("intérieur") && 
      s.name.includes("extérieur")
    );

    // Ne jamais désactiver le service complet lui-même
    if (service.name.includes("intérieur") && service.name.includes("extérieur")) {
      return false;
    }

    // Désactiver les autres services de lavage si le complet est sélectionné
    if (hasCompleteWash && service.category === 'lavage') {
      return true;
    }

    return false;
  };

  const isDateAvailable = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];
    
    // Si c'est la date du jour, on la considère toujours comme disponible
    if (dateString === todayString) {
      return true;
    }
    
    // Pour les autres dates, on vérifie si elles sont dans les dates disponibles
    return availableDates.includes(dateString);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!firstName || !lastName || !date || !selectedSlot || selectedServices.length === 0) {
      alert("Veuillez remplir les champs obligatoires (Nom, Prénom, Date, Services et Créneau).");
      return;
    }

    if (!showSummary) {
      setShowSummary(true);
      return;
    }

    setIsLoading(true);
    try {
      const dateObj = new Date(`${date}T${selectedSlot}`);
      const id = dateObj.getDate().toString().padStart(2, '0') +
                 (dateObj.getMonth() + 1).toString().padStart(2, '0') +
                 dateObj.getFullYear() +
                 dateObj.getHours().toString().padStart(2, '0') +
                 dateObj.getMinutes().toString().padStart(2, '0');

      // Calculer la durée totale des services
      const totalDuration = selectedServices.reduce((sum, service) => {
        return sum + service.duration;
      }, 0);

      // Extraire l'heure de début du créneau sélectionné
      const [startTime] = selectedSlot.split('-');

      const appointmentData = { 
        id: parseInt(id),
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone: phone || null,
        date,
        start_time: startTime,
        end_time: new Date(new Date(`${date}T${startTime}`).getTime() + totalDuration * 60000)
          .toTimeString().slice(0, 5),
        service_ids: selectedServices.map(s => s.id),
        total: total
      };

      console.log("Données du rendez-vous:", appointmentData);

      const { error } = await supabase
        .from("appointments")
        .insert([appointmentData]);

      if (error) {
        alert(`Erreur d'insertion : ${error.message}`);
      } else {
        setIsConfirmed(true);
      }
    } catch (error) {
      alert("Une erreur est survenue lors de l'ajout du rendez-vous.");
      console.error("Erreur :", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className={`text-sm ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>Services</span>
          <span className={`text-sm ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>Date & Heure</span>
          <span className={`text-sm ${step >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>Informations</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Services */}
      {step === 1 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-800">Choisissez vos services</h2>
          
          {/* Categories */}
          <div className="flex gap-4 mb-6">
            {Object.keys(services).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          {activeCategory === 'lavage' ? (
            <div className="space-y-8">
              {/* Formule complète */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Formule complète</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services[activeCategory]?.filter(service => 
                    service.name.includes("intérieur") && service.name.includes("extérieur")
                  ).map(service => (
                    <div
                      key={service.id}
                      className={`p-6 rounded-lg border relative overflow-hidden ${
                        selectedServices.some(s => s.id === service.id)
                          ? 'border-blue-500 bg-blue-50'
                          : isServiceDisabled(service)
                          ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                          : 'border-gray-200 hover:border-blue-300'
                      } cursor-pointer transition-all duration-200`}
                      onClick={() => !isServiceDisabled(service) && handleServiceSelect(service)}
                    >
                      <div className="absolute inset-0 z-0">
                        <Image
                          src="/images/lavage_complet.jpg"
                          alt={service.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover opacity-20"
                        />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-blue-600">{service.price}€</span>
                          <span className="text-sm text-gray-500">{service.duration} min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lavage intérieur */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Lavage intérieur</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services[activeCategory]?.filter(service => 
                    service.name.includes("intérieur") && !service.name.includes("extérieur")
                  ).map(service => (
                    <div
                      key={service.id}
                      className={`p-6 rounded-lg border relative overflow-hidden ${
                        selectedServices.some(s => s.id === service.id)
                          ? 'border-blue-500 bg-blue-50'
                          : isServiceDisabled(service)
                          ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                          : 'border-gray-200 hover:border-blue-300'
                      } cursor-pointer transition-all duration-200`}
                      onClick={() => !isServiceDisabled(service) && handleServiceSelect(service)}
                    >
                      <div className="absolute inset-0 z-0">
                        <Image
                          src="/images/lavage_interieur.jpg"
                          alt={service.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover opacity-20"
                        />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-blue-600">{service.price}€</span>
                          <span className="text-sm text-gray-500">{service.duration} min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lavage extérieur */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Lavage extérieur</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services[activeCategory]?.filter(service => 
                    service.name.includes("extérieur") && !service.name.includes("intérieur")
                  ).map(service => (
                    <div
                      key={service.id}
                      className={`p-6 rounded-lg border relative overflow-hidden ${
                        selectedServices.some(s => s.id === service.id)
                          ? 'border-blue-500 bg-blue-50'
                          : isServiceDisabled(service)
                          ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                          : 'border-gray-200 hover:border-blue-300'
                      } cursor-pointer transition-all duration-200`}
                      onClick={() => !isServiceDisabled(service) && handleServiceSelect(service)}
                    >
                      <div className="absolute inset-0 z-0">
                        <Image
                          src="/images/lavage_exterieur.jpg"
                          alt={service.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover opacity-20"
                        />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-blue-600">{service.price}€</span>
                          <span className="text-sm text-gray-500">{service.duration} min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services[activeCategory]?.map(service => (
                <div
                  key={service.id}
                  className={`p-6 rounded-lg border relative overflow-hidden ${
                    selectedServices.some(s => s.id === service.id)
                      ? 'border-blue-500 bg-blue-50'
                      : isServiceDisabled(service)
                      ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                      : 'border-gray-200 hover:border-blue-300'
                  } cursor-pointer transition-all duration-200`}
                  onClick={() => !isServiceDisabled(service) && handleServiceSelect(service)}
                >
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={`/images/${service.name.toLowerCase().replace(/\s+/g, '_')}.jpg`}
                      alt={service.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover opacity-20"
                    />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">{service.price}€</span>
                      <span className="text-sm text-gray-500">{service.duration} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Next button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={() => setStep(2)}
              disabled={selectedServices.length === 0}
              className={`
                px-6 py-2 rounded-md text-white
                ${selectedServices.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                }
              `}
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-800">Choisissez une date et une heure</h2>
          
          {/* Calendar and Time Slots */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionnez une date
              </label>
              <div className="flex justify-center">
                <Calendar
                  onChange={(value) => {
                    // Ajuster la date pour éviter le décalage de fuseau horaire
                    const newDate = new Date(value.getTime() - (value.getTimezoneOffset() * 60000))
                      .toISOString()
                      .split('T')[0];
                    
                    // Vérifier si la date est valide (pas le jour d'hier)
                    const selectedDate = new Date(newDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    selectedDate.setHours(0, 0, 0, 0);

                    if (selectedDate < today) {
                      console.log("Date invalide (jour d'hier ou antérieur)");
                      return;
                    }

                    console.log("Date sélectionnée:", newDate);
                    setDate(newDate);
                    setSelectedSlot(""); // Réinitialiser le créneau sélectionné
                    fetchAvailableSlots();
                  }}
                  value={date ? new Date(date) : null}
                  minDate={new Date()} // Commencer à partir d'aujourd'hui
                  tileDisabled={({ date }) => {
                    const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                      .toISOString()
                      .split('T')[0];
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const todayString = today.toISOString().split('T')[0];
                    
                    // Désactiver le jour d'hier et les jours antérieurs
                    if (dateString < todayString) {
                      return true;
                    }
                    
                    // Si c'est la date du jour, on la considère toujours comme disponible
                    if (dateString === todayString) {
                      return false;
                    }
                    
                    return !availableDates.includes(dateString);
                  }}
                  className="rounded-lg border p-2 [&_.react-calendar__tile--weekend]:text-gray-900"
                  locale="fr-FR"
                  formatDay={(locale, date) => date.getDate().toString()}
                  clearIcon={null}
                  nextLabel="›"
                  prevLabel="‹"
                  view="month"
                  maxDetail="month"
                  minDetail="month"
                  showNeighboringMonth={false}
                  showFixedNumberOfWeeks={false}
                  showNavigation={true}
                  showMonthNavigation={true}
                  showYearNavigation={false}
                  showDecadeNavigation={false}
                  showCenturyNavigation={false}
                  activeStartDate={activeStartDate}
                  maxDate={(() => {
                    // Trouver la date la plus éloignée dans availableDates
                    if (availableDates.length === 0) return null;
                    const maxDate = new Date(Math.max(...availableDates.map(d => new Date(d))));
                    // Ajouter un mois pour permettre la navigation
                    maxDate.setMonth(maxDate.getMonth() + 1);
                    return maxDate;
                  })()}
                  navigationLabel={({ date, label }) => {
                    const monthNames = [
                      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
                    ];
                    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                  }}
                  next2Label={null}
                  prev2Label={null}
                  onActiveStartDateChange={({ activeStartDate }) => {
                    console.log("Changement de date active:", activeStartDate);
                    setActiveStartDate(activeStartDate);
                  }}
                />
              </div>
            </div>

            {/* Time Slots */}
            {date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Créneaux disponibles
                </label>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {availableSlots
                      .filter(slot => {
                        const [startTime] = slot.split('-');
                        const startDateTime = new Date(`${date}T${startTime}`);
                        const now = new Date();
                        // Si c'est le jour même, on ne montre que les créneaux futurs
                        if (date === now.toISOString().split('T')[0]) {
                          return startDateTime > now;
                        }
                        return true;
                      })
                      .map((slot) => {
                        const [startTime, endTime] = slot.split('-');
                        return (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`
                              p-3 rounded-md text-sm font-medium
                              ${selectedSlot === slot
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }
                            `}
                          >
                            <div className="font-semibold">{startTime}</div>
                            <div className="text-xs opacity-75">
                              {endTime}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Aucun créneau disponible pour cette date
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              Retour
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!date || !selectedSlot}
              className={`
                px-6 py-2 rounded-md text-white
                ${!date || !selectedSlot
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                }
              `}
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Step 3: User Information */}
      {step === 3 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-800">Vos informations</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (recommandé)
                </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone (optionnel)
                </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        </div>
        
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              Retour
            </button>
            <button
              onClick={() => setShowSummary(true)}
              disabled={!firstName || !lastName}
              className={`
                px-6 py-2 rounded-md text-white
                ${!firstName || !lastName
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                }
              `}
            >
              Confirmer
            </button>
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {showSummary && !isConfirmed && (
        <div className="fixed inset-0 bg-white flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Récapitulatif</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Services sélectionnés</h3>
                <ul className="mt-2 space-y-2">
                  {selectedServices.map((service) => (
                    <li key={service.id} className="flex justify-between">
                      <span>{service.name}</span>
                      <span>{service.price}€</span>
                </li>
              ))}
            </ul>
                <div className="mt-2 pt-2 border-t">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{total}€</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700">Date et heure</h3>
                <p className="mt-2">
                  {new Date(date).toLocaleDateString('fr-FR')} - {selectedSlot}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700">Informations personnelles</h3>
                <p className="mt-2">
                  {firstName} {lastName}<br />
                  {phone}
                </p>
              </div>

              {/* Email option */}
              {!email && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Recevoir un justificatif par email ?</h3>
                  <div className="flex gap-4">
                    <input
                      type="email"
                      placeholder="Votre email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      className="flex-1 p-2 border rounded-md"
                    />
                    <button
                      onClick={() => {
                        if (tempEmail) {
                          setEmail(tempEmail);
                          setTempEmail("");
                        }
                      }}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Valider
                    </button>
                  </div>
                </div>
              )}
              {email && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Email de confirmation</h3>
                  <div className="flex items-center justify-between">
                    <span>{email}</span>
                    <button
                      onClick={() => {
                        setEmail("");
                        setTempEmail("");
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowSummary(false)}
                className="px-6 py-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                Modifier
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`
                  px-6 py-2 rounded-md text-white
                  ${isLoading 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                  }
                `}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Confirmation en cours...
                  </span>
                ) : (
                  'Confirmer le rendez-vous'
                )}
              </button>
            </div>
          </div>
          </div>
        )}

      {/* Confirmation Page */}
      {isConfirmed && (
        <div className="fixed inset-0 bg-white flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center">
            <div className="mb-8">
              <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Rendez-vous confirmé !</h2>
            <p className="text-lg text-gray-600 mb-8">
              Votre rendez-vous a été enregistré avec succès.
              Vous pouvez récupérer votre justificatif sur place.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-700 mb-4">Détails du rendez-vous</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Date :</span> {new Date(date).toLocaleDateString('fr-FR')}</p>
                <p><span className="font-medium">Heure :</span> {selectedSlot}</p>
                <p><span className="font-medium">Services :</span></p>
                <ul className="list-disc list-inside">
                  {selectedServices.map((service) => (
                    <li key={service.id}>{service.name}</li>
                  ))}
                </ul>
                <p><span className="font-medium">Total :</span> {total}€</p>
              </div>
            </div>

            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Retour à l&apos;accueil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
