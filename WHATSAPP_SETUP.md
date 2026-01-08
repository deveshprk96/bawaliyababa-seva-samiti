# 📱 FREE WhatsApp Integration Setup

## ✅ Completely FREE - No paid services required!

This project uses **WhatsApp Web.js** - a 100% free, open-source library that connects to WhatsApp Web.

## 🚀 Quick Setup (3 Steps)

### Step 1: Enable WhatsApp

Edit `.env` file:
```env
ENABLE_WHATSAPP=true
```

### Step 2: Install Dependencies

```bash
cd /tmp/queue-management-system
npm install
```

### Step 3: Start Server & Scan QR Code

```bash
npm start
```

You'll see a **QR code in the terminal**. Simply:
1. Open WhatsApp on your phone
2. Go to **Settings** → **Linked Devices**
3. Tap **Link a Device**
4. Scan the QR code shown in your terminal

That's it! ✅ WhatsApp is now connected!

## 📤 How It Works

- Uses your personal/business WhatsApp account
- No API keys needed
- No monthly fees
- Unlimited messages
- Works with any phone number (no sandbox restrictions)

## 🔄 Reconnection

The authentication is saved locally. If you restart the server:
- **First time:** Scan QR code
- **After that:** Auto-connects (no QR needed!)

## ⚠️ Important Notes

1. **Keep phone connected to internet** - WhatsApp needs your phone online
2. **Don't logout** - Keep WhatsApp Web session active
3. **Production:** Keep the server running 24/7

## 🆚 Free vs Paid Options

| Feature | WhatsApp Web.js (FREE) | Twilio (PAID) |
|---------|----------------------|---------------|
| Cost | $0 | ~$0.005/message |
| Setup | Scan QR code | API keys |
| Phone needed | Yes | No |
| Reliability | Good | Excellent |
| Best for | Small-medium business | Enterprise |

## 🎯 Testing

1. Set `ENABLE_WHATSAPP=true`
2. Start server and scan QR
3. Book an appointment with any phone number
4. Customer receives WhatsApp message automatically!

## 🛠️ Troubleshooting

**QR code not showing?**
- Make sure `ENABLE_WHATSAPP=true` in `.env`
- Run `npm install` again

**Messages not sending?**
- Ensure your phone has internet
- Check WhatsApp Web is active on your phone
- Wait for "WhatsApp is ready" message in terminal

**"Phone number not registered"?**
- The customer's number must have WhatsApp installed
- Check phone number format (include country code)

---

**That's it! Enjoy FREE WhatsApp notifications! 🎉**
