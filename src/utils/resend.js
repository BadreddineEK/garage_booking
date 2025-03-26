import { Resend } from 'resend';
import { getClientEmailTemplate, getGarageEmailTemplate } from './emailTemplates';

const resend = new Resend('re_AL3cHf2J_LwftbGNQ58CAAwPQeWciWsp5');

export async function sendConfirmationEmails(appointment) {
  try {
    console.log('Données reçues dans sendConfirmationEmails:', appointment);
    console.log('Email du client:', appointment.email);

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...appointment,
        email: appointment.email || null // S'assurer que l'email est null si vide
      }),
    });

    const data = await response.json();
    console.log('Réponse de l\'API:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de l\'envoi des emails');
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi des emails:', error);
    return false;
  }
} 