const { default: makeWASocket, useSingleFileAuthState, fetchLatestBaileysVersion, generatePairingCode } = require('@whiskeysockets/baileys');
const fs = require('fs');

const { state, saveState } = useSingleFileAuthState('./auth.json');
const pendingNumbers = {}; // Stocke les utilisateurs en attente de numéro

const startBot = async () => {
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveState);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (!text) return;

        // Étape 1 : Commande initiale
        if (text.toLowerCase() === 'kickall') {
            pendingNumbers[sender] = true;
            await sock.sendMessage(sender, { text: "Veuillez entrer le numéro à jumeler (ex : 33612345678)." });
        }

        // Étape 2 : Attente du numéro
        else if (pendingNumbers[sender]) {
            const number = text.replace(/[^0-9]/g, ''); // nettoie le numéro
            if (number.length < 8) {
                await sock.sendMessage(sender, { text: "Numéro invalide. Essayez encore." });
            } else {
                try {
                    const code = await generatePairingCode(`${number}@s.whatsapp.net`, sock.authState.creds, sock);
                    await sock.sendMessage(sender, {
                        text: `Voici le code de jumelage pour le numéro *${number}* :\n\n*${code}*`
                    });
                } catch (err) {
                    await sock.sendMessage(sender, { text: "Erreur lors de la génération du code. Veuillez réessayer." });
                    console.error(err);
                }
                delete pendingNumbers[sender]; // reset état
            }
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            startBot();
        }
    });
};

startBot();
