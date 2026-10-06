const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', (qr) => {
    // Menampilkan QR Code di terminal Render nanti
    qrcode.generate(qr, { small: true });
    console.log('=== SCAN QR CODE INI DENGAN WHATSAPP HP BOT ===');
});

client.on('ready', () => {
    console.log('Bot WhatsApp sudah siap mengirim pesan!');
});

client.initialize();

// Menerima perintah dari Google Apps Script
app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    try {
        // Otomatis ubah 08xxx menjadi 628xxx format WhatsApp
        const formattedNumber = number.startsWith('0') ? '62' + number.substring(1) : number;
        const chatId = formattedNumber + "@c.us";
        
        await client.sendMessage(chatId, message);
        res.status(200).send({ status: 'success', message: 'Terkirim' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', error: error.toString() });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
