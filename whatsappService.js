require('dotenv').config();
const qrcode = require('qrcode-terminal');

let whatsappClient = null;
let isReady = false;

// Initialize WhatsApp client if enabled
if (process.env.ENABLE_WHATSAPP === 'true') {
  try {
    const { Client, LocalAuth } = require('whatsapp-web.js');
    
    whatsappClient = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    // QR Code for authentication
    whatsappClient.on('qr', (qr) => {
      console.log('\n📱 WhatsApp QR Code - Scan this with your phone:\n');
      qrcode.generate(qr, { small: true });
      console.log('\n👆 Open WhatsApp on your phone > Linked Devices > Link a Device');
      console.log('   Then scan the QR code above\n');
    });

    // Ready event
    whatsappClient.on('ready', () => {
      isReady = true;
      console.log('✅ WhatsApp is ready and connected!');
    });

    // Authentication success
    whatsappClient.on('authenticated', () => {
      console.log('✅ WhatsApp authenticated successfully');
    });

    // Authentication failure
    whatsappClient.on('auth_failure', (msg) => {
      console.error('❌ WhatsApp authentication failed:', msg);
      isReady = false;
    });

    // Disconnected
    whatsappClient.on('disconnected', (reason) => {
      console.log('⚠️  WhatsApp disconnected:', reason);
      isReady = false;
    });

    // Initialize
    whatsappClient.initialize();
    console.log('🔄 Initializing WhatsApp Web...');
    
  } catch (error) {
    console.log('⚠️  WhatsApp service disabled - Error:', error.message);
  }
} else {
  console.log('ℹ️  WhatsApp service disabled (set ENABLE_WHATSAPP=true to enable)');
}

async function sendWhatsAppMessage(to, message) {
  // If WhatsApp is not enabled or not ready
  if (!whatsappClient || !isReady) {
    console.log('WhatsApp not ready - skipping message');
    return { success: true, sent: false, message: 'WhatsApp not ready' };
  }

  try {
    // Format phone number for WhatsApp (remove spaces, dashes, etc.)
    let phoneNumber = to.replace(/[\s\-\(\)]/g, '');
    
    // Add country code if not present
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+91' + phoneNumber.replace(/^0+/, '');
    }
    
    // Remove + and add @c.us for WhatsApp format
    const chatId = phoneNumber.substring(1) + '@c.us';

    // Send message
    await whatsappClient.sendMessage(chatId, message);
    
    console.log('✅ WhatsApp message sent to:', phoneNumber);
    return { success: true, sent: true };
  } catch (error) {
    console.error('❌ WhatsApp send error:', error.message);
    return { success: false, sent: false, error: error.message };
  }
}

function formatBookingConfirmation(data) {
  const { customerName, queuePosition, peopleAhead, businessName } = data;
  
  return `🎉 *Booking Confirmed!*

Hello ${customerName}! 👋

Your appointment has been successfully booked with *${businessName}*.

📊 *Queue Information:*
🎯 Your Position: #${queuePosition}
👥 People Ahead: ${peopleAhead}

We'll serve you soon! Please stay nearby as we'll call you when it's your turn.

Thank you for choosing us! ✨`;
}

function getStatus() {
  return {
    enabled: process.env.ENABLE_WHATSAPP === 'true',
    ready: isReady,
    client: whatsappClient !== null
  };
}

module.exports = {
  sendWhatsAppMessage,
  formatBookingConfirmation,
  isEnabled: () => whatsappClient !== null && isReady,
  getStatus
};
