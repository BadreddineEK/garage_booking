import nodemailer from 'nodemailer';
import { getClientEmailTemplate, getGarageEmailTemplate } from '@/utils/emailTemplates';
import { NextResponse } from 'next/server';

// Configuration du transporteur Mailtrap
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "40980417aff368", // À remplacer par votre user Mailtrap
    pass: "1b14270f807903" // À remplacer par votre password Mailtrap
  }
});

export async function POST(request) {
  try {
    const appointment = await request.json();
    console.log('\n=== DÉBUT DU PROCESSUS D\'ENVOI D\'EMAIL ===');
    console.log('Données du rendez-vous reçues:', appointment);
    console.log('Email du client:', appointment.email);

    // Envoyer l'email au client s'il a fourni une adresse email
    if (appointment.email && appointment.email.trim() !== '') {
      console.log('\nTentative d\'envoi d\'email au client:', appointment.email);
      try {
        const clientEmailResult = await transporter.sendMail({
          from: '"Garage RDV" <from@example.com>',
          to: appointment.email.trim(),
          subject: 'Confirmation de votre rendez-vous',
          html: getClientEmailTemplate(appointment)
        });
        console.log('✅ Email client envoyé avec succès à:', appointment.email);
        console.log('Détails de l\'envoi:', clientEmailResult);
      } catch (clientError) {
        console.error('❌ Erreur lors de l\'envoi de l\'email au client:', clientError);
      }
    } else {
      console.log('\n⚠️ Pas d\'email client fourni ou email vide');
    }

    // Envoyer l'email au garage
    console.log('\nTentative d\'envoi d\'email au garage');
    try {
      const garageEmailResult = await transporter.sendMail({
        from: '"Garage RDV" <from@example.com>',
        to: 'bktec3@gmail.com',
        subject: 'Nouveau rendez-vous',
        html: getGarageEmailTemplate(appointment)
      });
      console.log('✅ Email garage envoyé avec succès');
      console.log('Détails de l\'envoi:', garageEmailResult);
    } catch (garageError) {
      console.error('❌ Erreur lors de l\'envoi de l\'email au garage:', garageError);
      throw garageError;
    }

    console.log('\n=== FIN DU PROCESSUS D\'ENVOI D\'EMAIL ===');
    console.log('Résumé:');
    console.log('- Email client:', appointment.email || 'Non envoyé');
    console.log('- Email garage: bktec3@gmail.com');
    console.log('==========================================\n');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('\n❌ Erreur générale lors de l\'envoi des emails:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 