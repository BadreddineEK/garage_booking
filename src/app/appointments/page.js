"use client";

import { useState, useEffect } from "react";
import supabase from "@/utils/supabase";
import { sendConfirmationEmails } from '@/utils/resend';

const SERVICES = [
  { id: 1, name: "Lavage intérieur express", price: 40, duration: 30 },
  { id: 2, name: "Lavage intérieur intégral", price: 50, duration: 60 },
  { id: 3, name: "Lavage extérieur express", price: 20, duration: 20 },
  { id: 4, name: "Lavage extérieur intégral", price: 30, duration: 40 },
];

export default function AppointmentsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [total, setTotal] = useState(0);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  async function fetchAppointments() {
    let { data, error } = await supabase.from("appointments").select("*");
    if (!error) setAppointments(data);
  }

  function generateTimeSlots(startTime, endTime, duration) {
    const slots = [];
    let currentTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);
    
    // On génère des créneaux de la durée totale des services
    while (currentTime.getTime() + duration * 60000 <= endDateTime.getTime()) {
      const slotEnd = new Date(currentTime.getTime() + duration * 60000);
      // On vérifie que le créneau ne dépasse pas la fin de la disponibilité
      if (slotEnd.getTime() <= endDateTime.getTime()) {
        slots.push({
          start_time: currentTime.toTimeString().slice(0, 5),
          end_time: slotEnd.toTimeString().slice(0, 5)
        });
      }
      // On avance de 30 minutes pour le prochain créneau
      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }
    return slots;
  }

  function isSlotOverlapping(slot, appointments) {
    const slotStart = new Date(`${date}T${slot.start_time}`);
    const slotEnd = new Date(`${date}T${slot.end_time}`);
    
    console.log(`\nVérification du créneau ${slot.start_time}-${slot.end_time}:`);
    
    return appointments.some(appointment => {
      const appointmentStart = new Date(`${date}T${appointment.start_time}`);
      const appointmentEnd = new Date(`${date}T${appointment.end_time}`);
      
      console.log(`Comparaison avec le RDV ${appointment.start_time}-${appointment.end_time}:`);
      console.log(`Slot: ${slotStart.toISOString()} - ${slotEnd.toISOString()}`);
      console.log(`RDV: ${appointmentStart.toISOString()} - ${appointmentEnd.toISOString()}`);
      
      // Un créneau est indisponible si :
      // 1. Il commence pendant un rendez-vous existant
      // 2. Il se termine pendant un rendez-vous existant
      // 3. Il englobe complètement un rendez-vous existant
      const isOverlapping = (slotStart >= appointmentStart && slotStart < appointmentEnd) ||
                          (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
                          (slotStart <= appointmentStart && slotEnd >= appointmentEnd);
      
      console.log(`Chevauchement: ${isOverlapping}`);
      return isOverlapping;
    });
  }

  async function fetchAvailableSlots() {
    if (!date) return;

    console.log("Date sélectionnée:", date);
    console.log("Services sélectionnés:", selectedServices);

    // Récupérer les créneaux disponibles pour la date sélectionnée
    const { data: availabilities, error: availError } = await supabase
      .from("availabilities")
      .select("*")
      .eq("date", date);

    console.log("Créneaux disponibles (availabilities):", availabilities);

    if (availError) {
      console.error("Erreur lors de la récupération des créneaux:", availError);
      return;
    }

    // Récupérer les rendez-vous existants pour la date sélectionnée
    const { data: existingAppointments, error: appError } = await supabase
      .from("appointments")
      .select("id, first_name, last_name, date, start_time, end_time, services, total")
      .eq("date", date)
      .order('start_time', { ascending: true });

    console.log("Requête des rendez-vous pour la date:", date);
    console.log("Rendez-vous existants (appointments):", existingAppointments);

    if (appError) {
      console.error("Erreur lors de la récupération des rendez-vous:", appError);
      return;
    }

    // Calculer la durée totale des services sélectionnés
    const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);
    console.log("Durée totale des services:", totalDuration);

    // Générer tous les créneaux possibles pour chaque disponibilité
    let allPossibleSlots = [];
    availabilities.forEach(availability => {
      const slots = generateTimeSlots(availability.start_time, availability.end_time, totalDuration);
      allPossibleSlots = [...allPossibleSlots, ...slots];
    });

    console.log("Tous les créneaux possibles:", allPossibleSlots);

    // Filtrer les créneaux qui chevauchent des rendez-vous existants
    const available = allPossibleSlots.filter(slot => {
      const isOverlapping = isSlotOverlapping(slot, existingAppointments || []);
      console.log(`Créneau ${slot.start_time}-${slot.end_time} est ${isOverlapping ? 'indisponible' : 'disponible'}`);
      return !isOverlapping;
    });

    // Trier les créneaux par heure de début
    available.sort((a, b) => {
      return new Date(`${date}T${a.start_time}`) - new Date(`${date}T${b.start_time}`);
    });

    console.log("Créneaux filtrés (disponibles):", available);
    setAvailableSlots(available);
  }

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

  const handleServiceSelect = (serviceId) => {
    const service = SERVICES.find(s => s.id === parseInt(serviceId));
    if (service && !selectedServices.some(s => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const removeService = (serviceId) => {
    setSelectedServices(selectedServices.filter(service => service.id !== serviceId));
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

    try {
      const dateObj = new Date(`${date}T${selectedSlot}`);
      const id = dateObj.getDate().toString().padStart(2, '0') +
                 (dateObj.getMonth() + 1).toString().padStart(2, '0') +
                 dateObj.getFullYear() +
                 dateObj.getHours().toString().padStart(2, '0') +
                 dateObj.getMinutes().toString().padStart(2, '0');

      const appointmentData = { 
        id: parseInt(id),
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone: phone || null,
        date,
        start_time: selectedSlot,
        end_time: new Date(new Date(`${date}T${selectedSlot}`).getTime() + 
          selectedServices.reduce((sum, service) => sum + service.duration, 0) * 60000)
          .toTimeString().slice(0, 5),
        services: JSON.stringify(selectedServices),
        total: total
      };

      console.log('Données du rendez-vous avant insertion:', appointmentData);

      const { error } = await supabase
        .from("appointments")
        .insert([appointmentData]);

      if (error) {
        alert(`Erreur d'insertion : ${error.message}`);
      } else {
        // Envoyer les emails de confirmation
        console.log('Tentative d\'envoi des emails avec les données:', appointmentData);
        const emailsSent = await sendConfirmationEmails(appointmentData);
        if (!emailsSent) {
          console.warn("Les emails de confirmation n'ont pas pu être envoyés.");
        }

        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setDate("");
        setSelectedServices([]);
        setTotal(0);
        setSelectedSlot("");
        setShowSummary(false);
        alert("Rendez-vous confirmé avec succès !");
      }
    } catch (error) {
      alert("Une erreur est survenue lors de l'ajout du rendez-vous.");
      console.error("Erreur :", error);
    }
  }

  return (
    <div className="p-8 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Prendre un Rendez-vous</h1>

      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (recommandé)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone (optionnel)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Services *</label>
          <select
            onChange={(e) => handleServiceSelect(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
            required
          >
            <option value="">Sélectionner un service</option>
            {SERVICES.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.price}€ ({service.duration}min)
              </option>
            ))}
          </select>
        </div>

        {selectedServices.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Services sélectionnés :</h3>
            <ul className="space-y-2">
              {selectedServices.map(service => (
                <li key={service.id} className="flex justify-between items-center bg-white p-3 rounded-md border border-gray-200">
                  <span className="text-gray-700">{service.name} - {service.price}€ ({service.duration}min)</span>
                  <button
                    type="button"
                    onClick={() => removeService(service.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-3 font-bold text-gray-800">
              Total : {total}€
            </div>
          </div>
        )}

        {date && selectedServices.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Créneaux disponibles :</label>
            {availableSlots.length > 0 ? (
              <select 
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)} 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                required
              >
                <option value="">Sélectionner un créneau</option>
                {availableSlots.map((slot, index) => (
                  <option key={index} value={slot.start_time}>
                    {slot.start_time} - {slot.end_time}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-red-500">Aucun créneau disponible pour cette date et ces services.</p>
            )}
          </div>
        )}

        {showSummary && (
          <div className="mb-4 p-4 bg-white rounded-md border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Récapitulatif de la réservation</h3>
            <div className="space-y-2">
              <p className="text-gray-700"><strong className="text-gray-800">Client :</strong> {firstName} {lastName}</p>
              {email && <p className="text-gray-700"><strong className="text-gray-800">Email :</strong> {email}</p>}
              {phone && <p className="text-gray-700"><strong className="text-gray-800">Téléphone :</strong> {phone}</p>}
              <p className="text-gray-700"><strong className="text-gray-800">Date :</strong> {new Date(date).toLocaleDateString('fr-FR')}</p>
              <p className="text-gray-700"><strong className="text-gray-800">Heure :</strong> {selectedSlot} - {new Date(new Date(`${date}T${selectedSlot}`).getTime() + 
                selectedServices.reduce((sum, service) => sum + service.duration, 0) * 60000)
                .toTimeString().slice(0, 5)}</p>
              <p className="text-gray-700"><strong className="text-gray-800">Services :</strong></p>
              <ul className="list-disc pl-5 text-gray-700">
                {selectedServices.map(service => (
                  <li key={service.id}>{service.name} - {service.price}€ ({service.duration}min)</li>
                ))}
              </ul>
              <p className="font-bold mt-2 text-gray-800">Total : {total}€</p>
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          {showSummary ? "Confirmer le rendez-vous" : "Voir le récapitulatif"}
        </button>
      </form>
    </div>
  );
}
