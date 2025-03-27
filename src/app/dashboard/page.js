"use client";

import { useState, useEffect, useCallback } from "react";
import supabase from "@/utils/supabase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Fonction utilitaire pour formater la date en YYYY-MM-DD
function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Fonction pour générer les options de minutes (de 5 en 5)
function generateMinuteOptions() {
  const options = [];
  for (let minute = 0; minute < 60; minute += 5) {
    options.push(String(minute).padStart(2, '0'));
  }
  return options;
}

// Fonction pour formater la durée en heures et minutes
function formatDuration(startTime, endTime) {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diffMinutes = Math.round((end - start) / (1000 * 60));
  
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return `${hours} heure${hours > 1 ? 's' : ''}`;
  return `${hours} heure${hours > 1 ? 's' : ''} et ${minutes} minutes`;
}

export default function DashboardGaragiste() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [availabilities, setAvailability] = useState([]);
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalAppointments: 0,
    totalDuration: 0,
    averageAppointmentValue: 0,
    occupancyRate: 0
  });
  const [services, setServices] = useState([]);
  const minuteOptions = generateMinuteOptions();

  // Générer les options d'heures (0-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

  const fetchAppointments = useCallback(async () => {
    const formattedDate = formatDateToYYYYMMDD(selectedDate);
    console.log("\n=== Récupération des rendez-vous ===");
    console.log("Date sélectionnée:", formattedDate);
    
    // Récupérer tous les rendez-vous pour vérifier
    let { data: allAppointments, error: allError } = await supabase
      .from("appointments")
      .select("*")
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    console.log("Tous les rendez-vous:", allAppointments);

    // Filtrer pour la date sélectionnée
    const filteredAppointments = allAppointments?.filter(apt => apt.date === formattedDate) || [];
    console.log("Rendez-vous filtrés pour la date:", filteredAppointments);

    setAppointments(filteredAppointments);
  }, [selectedDate]);

  const fetchAvailability = useCallback(async () => {
    const formattedDate = formatDateToYYYYMMDD(selectedDate);
    console.log("\n=== Récupération des disponibilités ===");
    console.log("Date sélectionnée:", formattedDate);
    
    // Récupérer toutes les disponibilités pour vérifier
    let { data: allAvailabilities, error: allError } = await supabase
      .from("availabilities")
      .select("*")
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    console.log("Toutes les disponibilités:", allAvailabilities);

    // Filtrer pour la date sélectionnée
    const filteredAvailabilities = allAvailabilities?.filter(avail => avail.date === formattedDate) || [];
    console.log("Disponibilités filtrées pour la date:", filteredAvailabilities);

    setAvailability(filteredAvailabilities);
  }, [selectedDate]);

  useEffect(() => {
    console.log("\n=== Changement de date ===");
    console.log("Nouvelle date sélectionnée:", selectedDate.toLocaleDateString('fr-FR'));
    fetchAppointments();
    fetchAvailability();
  }, [selectedDate, fetchAppointments, fetchAvailability]);

  // Fonction pour calculer les statistiques
  function calculateStats(appointments, availabilities) {
    const totalRevenue = appointments.reduce((sum, apt) => sum + apt.total, 0);
    const totalAppointments = appointments.length;
    const totalDuration = appointments.reduce((sum, apt) => {
      const start = new Date(`2000-01-01T${apt.start_time}`);
      const end = new Date(`2000-01-01T${apt.end_time}`);
      return sum + (end - start) / (1000 * 60); // durée en minutes
    }, 0);

    // Calculer le taux d'occupation
    const totalAvailableTime = availabilities.reduce((sum, avail) => {
      const start = new Date(`2000-01-01T${avail.start_time}`);
      const end = new Date(`2000-01-01T${avail.end_time}`);
      return sum + (end - start) / (1000 * 60); // durée en minutes
    }, 0);

    const occupancyRate = totalAvailableTime > 0 
      ? (totalDuration / totalAvailableTime) * 100 
      : 0;

    return {
      totalRevenue,
      totalAppointments,
      totalDuration,
      averageAppointmentValue: totalAppointments > 0 ? totalRevenue / totalAppointments : 0,
      occupancyRate
    };
  }

  useEffect(() => {
    const newStats = calculateStats(appointments, availabilities);
    setStats(newStats);
  }, [appointments, availabilities]);

  async function handleAddAvailability() {
    if (!startHour || !startMinute || !endHour || !endMinute) {
      alert("Veuillez renseigner une heure de début et de fin.");
      return;
    }

    const startTime = `${startHour}:${startMinute}`;
    const endTime = `${endHour}:${endMinute}`;

    const formattedDate = formatDateToYYYYMMDD(selectedDate);
    console.log("\n=== Ajout d'une disponibilité ===");
    console.log("Date:", formattedDate);
    console.log("Heure de début:", startTime);
    console.log("Heure de fin:", endTime);

    const { error } = await supabase.from("availabilities").insert([
      { 
        date: formattedDate, 
        start_time: startTime, 
        end_time: endTime 
      }
    ]);

    if (error) {
      console.error("Erreur lors de l'ajout de la disponibilité:", error);
      alert(`Erreur d'insertion : ${error.message}`);
    } else {
      console.log("Disponibilité ajoutée avec succès");
      setStartHour("");
      setStartMinute("");
      setEndHour("");
      setEndMinute("");
      fetchAvailability();
    }
  }

  async function handleDeleteAvailability(availabilityId) {
    // Récupérer la disponibilité pour avoir ses horaires
    const availability = availabilities.find(a => a.id === availabilityId);
    if (!availability) return;

    // Vérifier si des rendez-vous existent sur ce créneau
    const { data: existingAppointments, error: appError } = await supabase
      .from("appointments")
      .select("*")
      .eq("date", formatDateToYYYYMMDD(selectedDate))
      .gte("start_time", availability.start_time)
      .lte("end_time", availability.end_time);

    if (appError) {
      console.error("Erreur lors de la vérification des rendez-vous:", appError);
      alert("Une erreur est survenue lors de la vérification des rendez-vous.");
      return;
    }

    if (existingAppointments && existingAppointments.length > 0) {
      const confirmMessage = `Attention ! Il y a ${existingAppointments.length} rendez-vous prévus sur ce créneau :\n\n` +
        existingAppointments.map(apt => 
          `- ${apt.first_name} ${apt.last_name} (${apt.start_time} - ${apt.end_time})`
        ).join('\n') +
        '\n\nLa suppression de cette disponibilité supprimera également ces rendez-vous. Êtes-vous sûr de vouloir continuer ?';
      
      if (!confirm(confirmMessage)) {
        return;
      }

      // Supprimer les rendez-vous associés
      const appointmentIds = existingAppointments.map(apt => apt.id);
      const { error: deleteAppointmentsError } = await supabase
        .from("appointments")
        .delete()
        .in("id", appointmentIds);

      if (deleteAppointmentsError) {
        console.error("Erreur lors de la suppression des rendez-vous:", deleteAppointmentsError);
        alert("Une erreur est survenue lors de la suppression des rendez-vous.");
        return;
      }
    } else if (!confirm("Êtes-vous sûr de vouloir supprimer cette disponibilité ?")) {
      return;
    }

    const { error } = await supabase
      .from("availabilities")
      .delete()
      .eq("id", availabilityId);

    if (error) {
      console.error("Erreur lors de la suppression de la disponibilité:", error);
      alert(`Erreur de suppression : ${error.message}`);
    } else {
      console.log("Disponibilité supprimée avec succès");
      fetchAvailability();
      fetchAppointments(); // Rafraîchir aussi la liste des rendez-vous
    }
  }

  async function handleDeleteAppointment(appointmentId) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) {
      return;
    }

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", appointmentId);

    if (error) {
      console.error("Erreur lors de la suppression du rendez-vous:", error);
      alert(`Erreur de suppression : ${error.message}`);
    } else {
      console.log("Rendez-vous supprimé avec succès");
      fetchAppointments();
    }
  }

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

      setServices(data);
    }

    fetchServices();
  }, []);

  // Fonction pour obtenir le nom d'un service par son ID
  const getServiceName = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Service inconnu';
  };

  return (
    <div className="space-y-8">
      {/* Section Vue d'ensemble */}
      <section id="overview" className="space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de Bord - Garagiste</h1>
        
        {/* Section des statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700">Chiffre d&apos;affaires</h3>
            <p className="text-2xl font-bold text-green-600">{stats.totalRevenue}€</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700">Nombre de RDV</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.totalAppointments}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700">Temps total RDV</h3>
            <p className="text-2xl font-bold text-purple-600">
              {Math.floor(stats.totalDuration / 60)}h {stats.totalDuration % 60}min
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700">Panier moyen</h3>
            <p className="text-2xl font-bold text-orange-600">
              {stats.averageAppointmentValue.toFixed(2)}€
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700">Taux d&apos;occupation</h3>
            <p className="text-2xl font-bold text-indigo-600">
              {stats.occupancyRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </section>

      {/* Section Rendez-vous */}
      <section id="appointments" className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-800">Rendez-vous</h2>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📅 Sélectionner une date</h3>
              <Calendar 
                onChange={setSelectedDate} 
                value={selectedDate}
                locale="fr-FR"
                minDate={new Date()}
                formatDay={(locale, date) => date.getDate().toString()}
                tileClassName={({ date }) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const tileDate = new Date(date);
                  tileDate.setHours(0, 0, 0, 0);
                  return tileDate.getTime() === today.getTime() ? 'bg-blue-50' : null;
                }}
                className="text-gray-800"
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">📌 Rendez-vous pour cette date</h3>
            <p className="text-sm text-gray-700 mb-4">
              {selectedDate.toLocaleDateString('fr-FR')}
            </p>
            <ul className="space-y-2">
              {appointments.length > 0 ? (
                appointments.map(appointment => (
                  <li key={appointment.id} className="p-4 bg-white rounded-md border border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-grow">
                        <div className="font-bold text-lg text-gray-800">{appointment.first_name} {appointment.last_name}</div>
                        <div className="text-sm text-gray-700 mt-1">
                          {appointment.start_time} - {appointment.end_time}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {appointment.email && <div>📧 {appointment.email}</div>}
                          {appointment.phone && <div>📞 {appointment.phone}</div>}
                        </div>
                        <div className="mt-3">
                          <strong className="text-gray-800">Services :</strong>
                          <ul className="list-disc pl-5 mt-1">
                            {appointment.service_ids.map((serviceId, index) => (
                              <li key={index} className="text-sm text-gray-700">
                                {getServiceName(serviceId)}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-3 font-bold text-green-600">Total : {appointment.total}€</div>
                      </div>
                      <button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
                        title="Supprimer le rendez-vous"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-4 bg-white rounded-md text-gray-700 text-center border border-gray-200">
                  Aucun rendez-vous pour cette date
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Section Disponibilités */}
      <section id="availabilities" className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-800">Disponibilités</h2>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📅 Sélectionner une date</h3>
              <Calendar 
                onChange={setSelectedDate} 
                value={selectedDate}
                locale="fr-FR"
                minDate={new Date()}
                formatDay={(locale, date) => date.getDate().toString()}
                tileClassName={({ date }) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const tileDate = new Date(date);
                  tileDate.setHours(0, 0, 0, 0);
                  return tileDate.getTime() === today.getTime() ? 'bg-blue-50' : null;
                }}
                className="text-gray-800"
              />
            </div>
            
            <div className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full lg:w-auto">
              <h3 className="text-xl font-semibold text-gray-800">🟢 Ajouter des disponibilités</h3>
              <p className="text-sm text-gray-700">
                Date sélectionnée : {selectedDate.toLocaleDateString('fr-FR')}
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de début
                  </label>
                  <div className="flex gap-2 items-center">
                    <select
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      className="w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                    >
                      <option value="">Heures</option>
                      {hourOptions.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-700">h</span>
                    <select
                      value={startMinute}
                      onChange={(e) => setStartMinute(e.target.value)}
                      className="w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                    >
                      <option value="">Minutes</option>
                      {minuteOptions.map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-700">min</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de fin
                  </label>
                  <div className="flex gap-2 items-center">
                    <select
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                      className="w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                      disabled={!startHour || !startMinute}
                    >
                      <option value="">Heures</option>
                      {hourOptions.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-700">h</span>
                    <select
                      value={endMinute}
                      onChange={(e) => setEndMinute(e.target.value)}
                      className="w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                      disabled={!startHour || !startMinute}
                    >
                      <option value="">Minutes</option>
                      {minuteOptions.map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-700">min</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAddAvailability} 
                className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!startHour || !startMinute || !endHour || !endMinute}
              >
                Ajouter la disponibilité
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">🕒 Disponibilités pour cette date</h3>
            <p className="text-sm text-gray-700 mb-4">
              {selectedDate.toLocaleDateString('fr-FR')}
            </p>
            <ul className="space-y-2">
              {availabilities.length > 0 ? (
                availabilities.map(availability => (
                  <li key={availability.id} className="p-4 bg-white rounded-md border border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-grow">
                        <span className="font-medium text-gray-800">
                          {availability.start_time} - {availability.end_time}
                        </span>
                        <span className="text-sm text-blue-600 ml-4">
                          {formatDuration(availability.start_time, availability.end_time)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteAvailability(availability.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
                        title="Supprimer la disponibilité"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-4 bg-white rounded-md text-gray-700 text-center border border-gray-200">
                  Aucune disponibilité pour cette date
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
