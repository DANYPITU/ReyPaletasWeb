const { Resend } = require('resend');

let client = null;

function getClient() {
  if (client) return client;

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    throw new Error('Falta la variable de entorno RESEND_API_KEY');
  }

  client = new Resend(resendApiKey);
  return client;
}

async function sendContactEmail({ name, email, message }) {
  try {
    const { data, error } = await getClient().emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.CONTACT_EMAIL,
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error('Error enviando email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error en sendContactEmail:', err);
    return { success: false, error: err.message };
  }
}

module.exports = { sendContactEmail };
