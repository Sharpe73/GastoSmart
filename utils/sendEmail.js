// utils/sendEmail.js
const SibApiV3Sdk = require("sib-api-v3-sdk");

// 🔹 Configuración cliente Brevo
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY; // 👈 Usa la API Key desde Railway

// Instancia de la API de emails transaccionales
const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendEmail(destinatario, asunto, texto) {
  try {
    const sendSmtpEmail = {
      sender: { name: "GastoSmart", email: process.env.CORREO_ORIGEN },
      to: [{ email: destinatario }],
      subject: asunto,
      textContent: texto,
    };

    await tranEmailApi.sendTransacEmail(sendSmtpEmail);

    console.log(`📧 Email enviado a ${destinatario}`);
  } catch (error) {
    console.error("❌ Error al enviar correo con Brevo:", error.response?.body || error);
    throw error;
  }
}

module.exports = sendEmail;
