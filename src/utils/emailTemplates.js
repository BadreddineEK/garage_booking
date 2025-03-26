export function getClientEmailTemplate(appointment) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Confirmation de votre rendez-vous</h2>
      <p>Bonjour ${appointment.first_name},</p>
      <p>Votre rendez-vous a été confirmé avec succès.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1f2937;">Détails du rendez-vous :</h3>
        <p><strong>Date :</strong> ${new Date(appointment.date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Heure :</strong> ${appointment.start_time} - ${appointment.end_time}</p>
        <p><strong>Services :</strong></p>
        <ul>
          ${JSON.parse(appointment.services).map(service => 
            `<li>${service.name} - ${service.price}€ (${service.duration}min)</li>`
          ).join('')}
        </ul>
        <p style="font-weight: bold;">Total : ${appointment.total}€</p>
      </div>
      <p>Nous vous attendons à l'heure prévue.</p>
      <p>Cordialement,<br>L'équipe du garage</p>
    </div>
  `;
}

export function getGarageEmailTemplate(appointment) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Nouveau rendez-vous</h2>
      <p>Un nouveau rendez-vous a été réservé.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1f2937;">Informations client :</h3>
        <p><strong>Client :</strong> ${appointment.first_name} ${appointment.last_name}</p>
        ${appointment.email ? `<p><strong>Email :</strong> ${appointment.email}</p>` : ''}
        ${appointment.phone ? `<p><strong>Téléphone :</strong> ${appointment.phone}</p>` : ''}
        <p><strong>Date :</strong> ${new Date(appointment.date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Heure :</strong> ${appointment.start_time} - ${appointment.end_time}</p>
        <p><strong>Services :</strong></p>
        <ul>
          ${JSON.parse(appointment.services).map(service => 
            `<li>${service.name} - ${service.price}€ (${service.duration}min)</li>`
          ).join('')}
        </ul>
        <p style="font-weight: bold;">Total : ${appointment.total}€</p>
      </div>
    </div>
  `;
} 