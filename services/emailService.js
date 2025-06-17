import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com", // Host SMTP de Brevo
    port: 587,
    secure: false, // true para 465, false para otros puertos como 587 o 2525
    auth: {
        user: process.env.BREVO_SMTP_LOGIN, // Tu login SMTP de Brevo (usualmente tu email)
        pass: process.env.BREVO_SMTP_PASSWORD // Tu clave API o contraseña SMTP de Brevo
    }
});

const sendOrderReadyEmail = async (email, orderId, pedido) => {
    const mailOptions = {
        from: `"Impresiones Low Cost" <${process.env.EMAIL_SENDER}>`,
        to: email,
        subject: `¡Tu pedido #${orderId} está listo para retirar!`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <div style="background-color: #1a56db; padding: 20px; border-radius: 5px 5px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0;">¡Tu pedido está listo!</h1>
                </div>
                
                <div style="padding: 20px; background-color: #f9fafb;">
                    <p style="font-size: 16px; color: #374151;">¡Hola!</p>
                    <p style="font-size: 16px; color: #374151;">Nos contactamos para comunicarte que tu pedido <strong>#${orderId}</strong> está listo para ser retirado.</p>
                    
                    <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #1a56db; margin-top: 0;">Detalles del pedido:</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 10px;"><strong>Tipo de impresión:</strong> ${pedido.tipo_impresion}</li>
                            <li style="margin-bottom: 10px;"><strong>Acabado:</strong> ${pedido.acabado}</li>
                            <li style="margin-bottom: 10px;"><strong>Copias:</strong> ${pedido.copias}</li>
                            <li style="margin-bottom: 10px;"><strong>Páginas:</strong> ${pedido.num_paginas}</li>
                        </ul>
                    </div>

                    <div style="background-color: #e5e7eb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #1a56db; margin-top: 0;">Información de retiro:</h3>
                        <p style="margin: 5px 0;"><strong>Dirección:</strong> Avellaneda 3454</p>
                        <p style="margin: 5px 0;"><strong>Horario de atención:</strong> Lunes a Viernes de 9:00 a 17:00</p>
                    </div>

                    <p style="font-size: 16px; color: #374151;">¡Gracias por confiar en nosotros!</p>
                    <p style="font-size: 16px; color: #374151;">Atentamente,<br>Impresiones Low Cost</p>
                </div>

                <div style="text-align: center; padding: 20px; background-color: #f3f4f6; border-radius: 0 0 5px 5px;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0;">Este es un correo automático, por favor no responder.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo de pedido #${orderId} listo para retirar enviado a ${email}`);
        return true;
    } catch (error) {
        console.error(`Error al enviar correo para el pedido #${orderId}:`, error);
        throw new Error(`Error al enviar correo electrónico: ${error.message}`);
    }
};

export { sendOrderReadyEmail }; 