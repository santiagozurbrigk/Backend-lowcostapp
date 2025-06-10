import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const formatPhoneNumber = (phoneNumber) => {
    // Eliminar cualquier caracter que no sea número
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Asegurarse de que tenga el código de país
    if (!cleaned.startsWith('54')) {
        cleaned = '54' + cleaned;
    }
    
    return cleaned;
};

export const enviarMensajeWhatsApp = async (telefono, pedidoId, estado) => {
    // Solo enviar mensaje si el estado es listo_para_retirar
    if (estado !== 'listo_para_retirar') {
        console.log('Estado no es listo_para_retirar, no se enviará mensaje');
        return null;
    }

    try {
        const numeroFormateado = formatPhoneNumber(telefono);
        
        const mensaje = `¡Hola! 👋

Tu pedido #${pedidoId} está listo para retirar ✅

📍 Puedes pasar a retirarlo por nuestro local en el horario de atención:
   Lunes a Viernes de 9:00 a 18:00
   Sábados de 9:00 a 13:00

💡 Recuerda traer el número de pedido (#${pedidoId})

¡Gracias por confiar en nosotros! 🙏`;

        const response = await client.messages.create({
            body: mensaje,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:+${numeroFormateado}`
        });

        console.log('Mensaje de WhatsApp enviado:', response.sid);
        return response;
    } catch (error) {
        console.error('Error al enviar mensaje de WhatsApp:', error);
        throw error;
    }
}; 