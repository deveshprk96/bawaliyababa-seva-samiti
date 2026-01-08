# 🎯 Queue Management System

A modern, funky web application for queue management where customers can book appointments from a web page and vendors can manage appointments through an admin panel. All data is stored in Google Sheets as an online database.

## ✨ Features

### Customer Features
- 🎨 **Funky & Modern UI** - Beautiful gradient designs and smooth animations
- 📍 **Location-Based Booking** - Customers can only book if they're within 500 meters of the vendor's location
- 📱 **Real-time Location Detection** - Automatic GPS location verification
- 📝 **Easy Booking Form** - Simple form to book appointments with name, phone, email, and notes

### Vendor Features
- 🔐 **Secure Login** - Password-protected admin panel
- 📊 **Live Dashboard** - Real-time statistics (waiting, in-progress, completed appointments)
- ⚙️ **Business Settings** - Configure business name, location, and allowed radius
- 🎮 **Appointment Management** - Start and complete appointments with one click
- 🔄 **Auto-Refresh** - Dashboard updates every 5 seconds automatically
- 🎨 **Dynamic UI** - Color-coded appointment cards based on status

### Technical Features
- 📊 **Google Sheets as Database** - No traditional database needed
- 🌐 **RESTful API** - Clean API architecture
- 📱 **Responsive Design** - Works on all devices
- 🔒 **Secure** - Basic authentication for vendor panel

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- A Google Cloud Platform account
- A Google Sheet

### Step 1: Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. Create a Service Account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and click "Create"
   - Skip optional steps and click "Done"

5. Generate a JSON key:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose "JSON" and click "Create"
   - Save the downloaded JSON file as `credentials.json` in the project root

### Step 2: Google Sheets Setup

1. Create a new Google Sheet
2. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
   ```

3. Share the sheet with your service account email:
   - Open your `credentials.json` file
   - Find the `client_email` field
   - Share your Google Sheet with this email (give "Editor" access)

4. Create two sheets in your Google Sheets document:
   - **Appointments** - This will store all appointment data
   - **Settings** - This will store vendor settings

### Step 3: Project Setup

1. **Clone or download this project**

2. **Install dependencies:**
   ```bash
   cd queue-management-system
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with your details:**
   ```env
   GOOGLE_SHEETS_ID=your_google_sheet_id_here
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
   PORT=3000
   VENDOR_USERNAME=admin
   VENDOR_PASSWORD=admin123
   VENDOR_LATITUDE=37.7749
   VENDOR_LONGITUDE=-122.4194
   LOCATION_RADIUS_METERS=500
   ```

5. **Place your `credentials.json` file** in the project root directory

6. **Initialize the Google Sheets structure:**
   
   Open `server.js` and uncomment line 18:
   ```javascript
   db.setupSheets();
   ```
   
   Then run:
   ```bash
   npm start
   ```
   
   Wait for the message "✅ Sheets structure created successfully", then stop the server and comment out the line again.

7. **Start the application:**
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

## 📖 Usage

### Customer Booking
1. Visit `http://localhost:3000`
2. Allow location access when prompted
3. If you're within the allowed radius, fill out the booking form
4. Submit to join the queue

### Vendor Admin Panel
1. Visit `http://localhost:3000/admin`
2. Login with credentials (default: admin/admin123)
3. View real-time queue statistics
4. Configure business settings (name, location, radius)
5. Manage appointments:
   - Click "Start Appointment" to begin serving a customer
   - Click "Complete Appointment" to finish and move to next

## 📁 Project Structure

```
queue-management-system/
├── public/
│   ├── index.html          # Customer booking page
│   └── admin.html          # Vendor admin panel
├── server.js               # Express server & API routes
├── googleSheetsDB.js       # Google Sheets database wrapper
├── utils.js                # Utility functions (distance calculation)
├── package.json            # Dependencies
├── .env                    # Environment variables (create this)
├── .env.example            # Example environment file
├── credentials.json        # Google service account key (create this)
└── README.md               # This file
```

## 🔧 API Endpoints

### Public Endpoints
- `GET /` - Customer booking page
- `GET /admin` - Vendor admin panel
- `GET /api/vendor-settings` - Get business settings
- `POST /api/verify-location` - Verify customer location
- `POST /api/book-appointment` - Book new appointment

### Protected Endpoints (Require Authentication)
- `POST /api/vendor-settings` - Update business settings
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments/:id/start` - Start appointment
- `POST /api/appointments/:id/complete` - Complete appointment
- `POST /api/login` - Vendor login

## 🎨 Customization

### Change Colors
Edit the gradient colors in `public/index.html` and `public/admin.html`:
- Customer page: Purple gradient (#667eea to #764ba2)
- Admin panel: Pink gradient (#f093fb to #f5576c)

### Modify Location Radius
Update the `LOCATION_RADIUS_METERS` in `.env` file or change it via the admin panel.

### Change Login Credentials
Update `VENDOR_USERNAME` and `VENDOR_PASSWORD` in `.env` file.

## 📊 Google Sheets Structure

### Appointments Sheet
| Timestamp | Customer Name | Phone | Email | Latitude | Longitude | Status | Start Time | End Time | Notes |
|-----------|---------------|-------|-------|----------|-----------|--------|------------|----------|-------|

### Settings Sheet
| Business Name | Latitude | Longitude | Radius (meters) |
|---------------|----------|-----------|-----------------|

## 🔒 Security Notes

- Change default admin credentials in production
- Use HTTPS in production
- Consider implementing JWT tokens for better authentication
- Add rate limiting for API endpoints
- Validate all user inputs

## 🐛 Troubleshooting

**Issue: "Database not ready" error**
- Make sure `credentials.json` is in the project root
- Verify your Google Sheet is shared with the service account email
- Check that the Google Sheets API is enabled

**Issue: Location not detected**
- Ensure you're using HTTPS (or localhost for testing)
- Check browser location permissions
- Try on a mobile device for better GPS accuracy

**Issue: Can't book appointment - "too far away"**
- Verify your actual GPS coordinates
- Check the vendor location settings in admin panel
- Increase the radius in settings if needed

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 💡 Future Enhancements

- Email/SMS notifications for customers
- Queue position tracking
- Estimated wait time calculation
- Multiple vendor support
- Advanced analytics and reporting
- Mobile app version

---

**Enjoy your funky Queue Management System! 🎉**
