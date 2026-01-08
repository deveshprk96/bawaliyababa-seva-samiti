// In-Memory Database for Demo Mode (when Google Sheets is not configured)

class InMemoryDB {
  constructor() {
    this.appointments = [];
    this.settings = {
      businessName: 'My Awesome Business',
      latitude: 37.7749,
      longitude: -122.4194,
      radiusMeters: 500
    };
    this.nextId = 1;
  }

  async initialize() {
    console.log('✅ Running in DEMO MODE (in-memory database)');
    console.log('⚠️  Data will be lost when server restarts');
    console.log('📝 To use Google Sheets, configure credentials.json and .env');
    return Promise.resolve();
  }

  async getAppointments() {
    return this.appointments.map((apt, index) => ({
      id: apt.id,
      timestamp: apt.timestamp,
      customerName: apt.customerName,
      customerPhone: apt.customerPhone,
      customerEmail: apt.customerEmail,
      customerLat: apt.customerLat,
      customerLng: apt.customerLng,
      status: apt.status,
      startTime: apt.startTime,
      endTime: apt.endTime,
      notes: apt.notes
    }));
  }

  async addAppointment(data) {
    const appointment = {
      id: this.nextId++,
      timestamp: new Date().toISOString(),
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      customerLat: data.customerLat,
      customerLng: data.customerLng,
      status: 'waiting',
      startTime: '',
      endTime: '',
      notes: data.notes || ''
    };

    this.appointments.push(appointment);
    return { success: true, message: 'Appointment booked successfully!' };
  }

  async updateAppointmentStatus(rowId, status, startTime = '', endTime = '') {
    const appointment = this.appointments.find(a => a.id === parseInt(rowId));
    if (appointment) {
      appointment.status = status;
      if (startTime) appointment.startTime = startTime;
      if (endTime) appointment.endTime = endTime;
      return { success: true };
    }
    throw new Error('Appointment not found');
  }

  async getVendorSettings() {
    return this.settings;
  }

  async updateVendorSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    return { success: true };
  }

  async setupSheets() {
    console.log('✅ Demo database initialized');
    return Promise.resolve();
  }
}

module.exports = new InMemoryDB();
