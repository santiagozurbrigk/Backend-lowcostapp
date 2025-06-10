import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcodePkg from 'qrcode-terminal';
const qrcode = qrcodePkg;

class WhatsAppService {
    constructor() {
        this.client = null;
        this.isReady = false;
    }

    async initialize() {
        try {
            this.client = new Client({
                authStrategy: new LocalAuth(),
                puppeteer: {
                    args: ['--no-sandbox']
                }
            });

            this.client.on('qr', (qr) => {
                console.log('Por favor, escanea el siguiente código QR:');
                qrcode.generate(qr, { small: true });
            });

            this.client.on('ready', () => {
                console.log('Cliente de WhatsApp está listo!');
                this.isReady = true;
            });

            this.client.on('disconnected', () => {
                console.log('Cliente de WhatsApp desconectado');
                this.isReady = false;
                // Intentar reconectar después de 5 segundos
                setTimeout(() => this.initialize(), 5000);
            });

            await this.client.initialize();
        } catch (error) {
            console.error('Error al inicializar WhatsApp:', error);
            throw error;
        }
    }

    async sendMessage(phoneNumber, message) {
        try {
            if (!this.isReady) {
                throw new Error('El cliente de WhatsApp no está listo');
            }

            // Asegurarse de que el número tenga el formato correcto
            const formattedNumber = phoneNumber.replace(/\D/g, '');
            const chatId = `${formattedNumber}@c.us`;

            const response = await this.client.sendMessage(chatId, message);
            return response;
        } catch (error) {
            console.error('Error al enviar mensaje de WhatsApp:', error);
            throw error;
        }
    }

    async sendOrderNotification(phoneNumber, orderDetails) {
        const message = `¡Hola! Tu pedido ha sido registrado 🎉\n\n` +
            `Número de pedido: #${orderDetails.orderNumber}\n` +
            `Estado: ${orderDetails.status}\n` +
            `Fecha estimada de entrega: ${orderDetails.estimatedDeliveryDate}\n\n` +
            `Gracias por confiar en nosotros! 🙏`;

        return this.sendMessage(phoneNumber, message);
    }
}

// Crear una instancia única del servicio
const whatsAppService = new WhatsAppService();

export default whatsAppService; 