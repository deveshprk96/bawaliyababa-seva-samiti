let credentials = null;
let currentSection = 'dashboard';
let currentEditId = null;
let currentDataType = null;

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
            credentials = { username, password };
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            document.getElementById('welcomeText').textContent = `Welcome, ${username}!`;
            await loadAllData();
        } else {
            showMessage('loginMessage', 'Invalid credentials', 'error');
        }
    } catch (error) {
        showMessage('loginMessage', 'Login failed', 'error');
    }
});

function logout() {
    credentials = null;
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginForm').reset();
}

function showSection(section) {
    // Update menu
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${section}`).classList.add('active');
    
    currentSection = section;
    
    // Load data for section
    if (section === 'appointments') loadAppointments();
    if (section === 'gallery') loadGalleryData();
    if (section === 'sevaPackages') loadSevaPackagesData();
    if (section === 'contributors') loadContributorsData();
    if (section === 'statistics') loadStatisticsData();
    if (section === 'services') loadServicesData();
    if (section === 'expenses') loadExpensesData();
    if (section === 'settings') loadSettings();
    if (section === 'pageCustomization') loadPageCustomization();
}

async function loadAllData() {
    await Promise.all([
        loadDashboardStats(),
        loadGalleryData(),
        loadSevaPackagesData(),
        loadContributorsData(),
        loadStatisticsData(),
        loadServicesData(),
        loadExpensesData(),
        loadSettings()
    ]);
}

async function loadDashboardStats() {
    try {
        const [appointments, gallery, seva, contributors] = await Promise.all([
            fetch('/api/appointments', { headers: getAuthHeaders() }).then(r => r.json()),
            fetch('/api/gallery').then(r => r.json()),
            fetch('/api/seva-services').then(r => r.json()),
            fetch('/api/contributors').then(r => r.json())
        ]);
        
        document.getElementById('stat-appointments').textContent = appointments.length;
        document.getElementById('stat-gallery').textContent = gallery.length;
        document.getElementById('stat-seva').textContent = seva.length;
        document.getElementById('stat-contributors').textContent = contributors.length;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadAppointments() {
    try {
        const response = await fetch('/api/appointments', { headers: getAuthHeaders() });
        const appointments = await response.json();
        
        const container = document.getElementById('appointmentsList');
        if (appointments.length === 0) {
            container.innerHTML = '<p>No appointments yet.</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Timestamp</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${appointments.map(apt => `
                        <tr>
                            <td>${apt.customerName}</td>
                            <td>${apt.customerPhone}</td>
                            <td>${apt.customerEmail}</td>
                            <td>${new Date(apt.timestamp).toLocaleString()}</td>
                            <td>${apt.status}</td>
                            <td>
                                ${apt.status === 'waiting' ? `<button class="btn btn-small btn-success" onclick="updateAppointmentStatus(${apt.id}, 'start')">Start</button>` : ''}
                                ${apt.status === 'in-progress' ? `<button class="btn btn-small" onclick="updateAppointmentStatus(${apt.id}, 'complete')">Complete</button>` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

async function updateAppointmentStatus(id, action) {
    try {
        await fetch(`/api/appointments/${id}/${action}`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        await loadAppointments();
        await loadDashboardStats();
    } catch (error) {
        console.error('Error updating appointment:', error);
    }
}

// Gallery CRUD
async function loadGalleryData() {
    try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        
        const tbody = document.getElementById('gallery-tbody');
        tbody.innerHTML = data.map((item, index) => `
            <tr>
                <td><img src="${item.imageUrl}" style="max-width: 100px; border-radius: 8px;" onerror="this.src='https://via.placeholder.com/100'"></td>
                <td>${item.caption || ''}</td>
                <td>${item.category || ''}</td>
                <td class="action-btns">
                    <button class="btn btn-small" onclick="editGalleryItem(${index}, ${JSON.stringify(item).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteGalleryItem(${index})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

// Seva Packages CRUD
async function loadSevaPackagesData() {
    try {
        const response = await fetch('/api/seva-services');
        const data = await response.json();
        
        const tbody = document.getElementById('sevaPackages-tbody');
        tbody.innerHTML = data.map((item, index) => `
            <tr>
                <td>${item.sevaName || ''}</td>
                <td>${item.description || ''}</td>
                <td>₹ ${item.amount || ''}</td>
                <td>${item.category || ''}</td>
                <td class="action-btns">
                    <button class="btn btn-small" onclick="editSevaPackage(${index}, ${JSON.stringify(item).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteSevaPackage(${index})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading seva packages:', error);
    }
}

// Contributors CRUD
async function loadContributorsData() {
    try {
        const response = await fetch('/api/contributors');
        const data = await response.json();
        
        const tbody = document.getElementById('contributors-tbody');
        tbody.innerHTML = data.map((item, index) => `
            <tr>
                <td>${item.name || ''}</td>
                <td>₹ ${item.amount || ''}</td>
                <td>${item.timestamp || ''}</td>
                <td>${item.message || ''}</td>
                <td class="action-btns">
                    <button class="btn btn-small" onclick="editContributor(${index}, ${JSON.stringify(item).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteContributor(${index})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading contributors:', error);
    }
}

// Statistics CRUD
async function loadStatisticsData() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        const tbody = document.getElementById('statistics-tbody');
        tbody.innerHTML = Object.entries(data).map(([name, count]) => `
            <tr>
                <td>${name}</td>
                <td>${count}</td>
                <td class="action-btns">
                    <button class="btn btn-small" onclick="editStatistic('${name}', '${count}')">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteStatistic('${name}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Services CRUD
async function loadServicesData() {
    try {
        const response = await fetch('/api/services');
        const data = await response.json();
        
        const tbody = document.getElementById('services-tbody');
        tbody.innerHTML = data.map((item, index) => `
            <tr>
                <td>${item.serviceName || ''}</td>
                <td>${item.shortDescription || ''}</td>
                <td>${item.iconImageUrl || ''}</td>
                <td class="action-btns">
                    <button class="btn btn-small" onclick="editService(${index}, ${JSON.stringify(item).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteService(${index})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// Expenses CRUD
async function loadExpensesData() {
    try {
        const response = await fetch('/api/expenses');
        const data = await response.json();
        
        const tbody = document.getElementById('expenses-tbody');
        tbody.innerHTML = data.map((item, index) => `
            <tr>
                <td>${item.materialItem || ''}</td>
                <td>${item.quantity || ''}</td>
                <td>₹ ${item.pricePerUnit || ''}</td>
                <td>₹ ${item.totalAmount || ''}</td>
                <td class="action-btns">
                    <button class="btn btn-small" onclick="editExpense(${index}, ${JSON.stringify(item).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteExpense(${index})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading expenses:', error);
    }
}

// Modal operations
function openAddModal(dataType) {
    currentDataType = dataType;
    currentEditId = null;
    document.getElementById('modalTitle').textContent = `Add New ${dataType}`;
    
    const formFields = document.getElementById('formFields');
    formFields.innerHTML = getFormFields(dataType);
    
    document.getElementById('dataModal').classList.add('active');
}

function closeModal() {
    document.getElementById('dataModal').classList.remove('active');
    document.getElementById('dataForm').reset();
}

function getFormFields(dataType) {
    const fields = {
        gallery: `
            <div class="form-group">
                <label>Image URL</label>
                <input type="url" name="imageUrl" required>
            </div>
            <div class="form-group">
                <label>Caption</label>
                <input type="text" name="caption">
            </div>
            <div class="form-group">
                <label>Category</label>
                <input type="text" name="category">
            </div>
        `,
        sevaPackages: `
            <div class="form-group">
                <label>Seva Name</label>
                <input type="text" name="sevaName" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label>Amount</label>
                <input type="number" name="amount" required>
            </div>
            <div class="form-group">
                <label>Image URL</label>
                <input type="url" name="imageUrl">
            </div>
            <div class="form-group">
                <label>Category</label>
                <input type="text" name="category">
            </div>
        `,
        contributors: `
            <div class="form-group">
                <label>Name</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>Amount</label>
                <input type="number" name="amount" required>
            </div>
            <div class="form-group">
                <label>Timestamp</label>
                <input type="datetime-local" name="timestamp" required>
            </div>
            <div class="form-group">
                <label>Message</label>
                <textarea name="message" rows="2"></textarea>
            </div>
        `,
        statistics: `
            <div class="form-group">
                <label>Stat Name</label>
                <input type="text" name="statName" required>
            </div>
            <div class="form-group">
                <label>Count</label>
                <input type="text" name="count" required>
            </div>
        `,
        services: `
            <div class="form-group">
                <label>Service Name</label>
                <input type="text" name="serviceName" required>
            </div>
            <div class="form-group">
                <label>Short Description</label>
                <input type="text" name="shortDescription">
            </div>
            <div class="form-group">
                <label>Long Description</label>
                <textarea name="longDescription" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label>Icon/Image URL</label>
                <input type="url" name="iconImageUrl">
            </div>
        `,
        expenses: `
            <div class="form-group">
                <label>Material/Item</label>
                <input type="text" name="materialItem" required>
            </div>
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" name="quantity" required>
            </div>
            <div class="form-group">
                <label>Price Per Unit</label>
                <input type="number" step="0.01" name="pricePerUnit" required>
            </div>
            <div class="form-group">
                <label>Total Amount</label>
                <input type="number" step="0.01" name="totalAmount" required>
            </div>
        `
    };
    
    return fields[dataType] || '';
}

// Form submission
document.getElementById('dataForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        const isEdit = currentEditId !== null;
        const method = isEdit ? 'PUT' : 'POST';
        
        // For statistics, use name as identifier; for others use index
        let url = `/api/admin/${currentDataType}`;
        if (isEdit) {
            if (currentDataType === 'statistics') {
                // For statistics, currentEditId contains the old name
                url = `/api/admin/${currentDataType}/${encodeURIComponent(currentEditId)}`;
            } else {
                url = `/api/admin/${currentDataType}/${currentEditId}`;
            }
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showMessage(`message-${currentDataType}`, `Data ${isEdit ? 'updated' : 'added'} successfully!`, 'success');
            closeModal();
            
            // Reload data
            if (currentDataType === 'gallery') await loadGalleryData();
            if (currentDataType === 'sevaPackages') await loadSevaPackagesData();
            if (currentDataType === 'contributors') await loadContributorsData();
            if (currentDataType === 'statistics') await loadStatisticsData();
            if (currentDataType === 'services') await loadServicesData();
            if (currentDataType === 'expenses') await loadExpensesData();
            
            await loadDashboardStats();
        } else {
            showMessage(`message-${currentDataType}`, 'Error saving data', 'error');
        }
    } catch (error) {
        showMessage(`message-${currentDataType}`, 'Error saving data', 'error');
    }
});

// Settings
async function loadSettings() {
    try {
        const response = await fetch('/api/vendor-settings');
        const settings = await response.json();

        document.getElementById('businessName').value = settings.businessName;
        document.getElementById('latitude').value = settings.latitude;
        document.getElementById('longitude').value = settings.longitude;
        document.getElementById('radiusMeters').value = settings.radiusMeters;
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Page Customization
async function loadPageCustomization() {
    try {
        const response = await fetch('/api/page-customization');
        const customization = await response.json();

        // Header
        document.getElementById('header_logo').value = customization.header?.logo || '🐄';
        document.getElementById('header_title').value = customization.header?.title || '';
        document.getElementById('header_subtitle').value = customization.header?.subtitle || '';

        // Hero
        document.getElementById('hero_mainHeading').value = customization.hero?.mainHeading || '';
        document.getElementById('hero_quote').value = customization.hero?.quote || '';
        document.getElementById('hero_quoteSource').value = customization.hero?.quoteSource || '';
        document.getElementById('hero_sliderImages').value = customization.hero?.sliderImages?.join('\n') || '';

        // Features
        if (customization.hero?.features) {
            customization.hero.features.forEach((feature, index) => {
                document.querySelector(`.feature-icon[data-index="${index}"]`).value = feature.icon || '';
                document.querySelector(`.feature-title[data-index="${index}"]`).value = feature.title || '';
                document.querySelector(`.feature-description[data-index="${index}"]`).value = feature.description || '';
            });
        }

        // Booking
        document.getElementById('booking_title').value = customization.booking?.title || '';
        document.getElementById('booking_subtitle').value = customization.booking?.subtitle || '';
        document.getElementById('booking_buttonText').value = customization.booking?.buttonText || '';
        document.getElementById('booking_floatingButtonText').value = customization.booking?.floatingButtonText || '';

        // Sections
        document.getElementById('section_gallery_enabled').checked = customization.sections?.gallery?.enabled !== false;
        document.getElementById('section_gallery_title').value = customization.sections?.gallery?.title || 'Gallery';
        
        document.getElementById('section_services_enabled').checked = customization.sections?.services?.enabled !== false;
        document.getElementById('section_services_title').value = customization.sections?.services?.title || 'Services';
        document.getElementById('section_services_description').value = customization.sections?.services?.description || '';
        
        document.getElementById('section_sevaOptions_enabled').checked = customization.sections?.sevaOptions?.enabled !== false;
        document.getElementById('section_sevaOptions_title').value = customization.sections?.sevaOptions?.title || 'Seva Options';
        
        document.getElementById('section_stats_enabled').checked = customization.sections?.stats?.enabled !== false;
        document.getElementById('section_stats_title').value = customization.sections?.stats?.title || 'Statistics';
        document.getElementById('section_stats_description').value = customization.sections?.stats?.description || '';
        
        document.getElementById('section_contributors_enabled').checked = customization.sections?.contributors?.enabled !== false;
        document.getElementById('section_contributors_title').value = customization.sections?.contributors?.title || 'Contributors';

        // Colors
        document.getElementById('colors_primary').value = customization.colors?.primary || '#1e3c72';
        document.getElementById('colors_secondary').value = customization.colors?.secondary || '#2a5298';
        document.getElementById('colors_accent').value = customization.colors?.accent || '#667eea';
        document.getElementById('colors_background').value = customization.colors?.background || '#f5f5f5';

        showMessage('message-pageCustomization', 'Page customization loaded successfully!', 'success');
    } catch (error) {
        console.error('Error loading page customization:', error);
        showMessage('message-pageCustomization', 'Error loading customization', 'error');
    }
}

document.getElementById('pageCustomizationForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Gather features
    const features = [];
    for (let i = 0; i < 4; i++) {
        features.push({
            icon: document.querySelector(`.feature-icon[data-index="${i}"]`)?.value || '',
            title: document.querySelector(`.feature-title[data-index="${i}"]`)?.value || '',
            description: document.querySelector(`.feature-description[data-index="${i}"]`)?.value || ''
        });
    }

    const customization = {
        header: {
            logo: document.getElementById('header_logo').value,
            title: document.getElementById('header_title').value,
            subtitle: document.getElementById('header_subtitle').value,
            navLinks: ['Home', 'Services', 'Gallery', 'Contributors']
        },
        hero: {
            mainHeading: document.getElementById('hero_mainHeading').value,
            quote: document.getElementById('hero_quote').value,
            quoteSource: document.getElementById('hero_quoteSource').value,
            sliderImages: document.getElementById('hero_sliderImages').value.split('\n').filter(url => url.trim()),
            features: features
        },
        booking: {
            title: document.getElementById('booking_title').value,
            subtitle: document.getElementById('booking_subtitle').value,
            buttonText: document.getElementById('booking_buttonText').value,
            floatingButtonText: document.getElementById('booking_floatingButtonText').value
        },
        sections: {
            gallery: {
                enabled: document.getElementById('section_gallery_enabled').checked,
                title: document.getElementById('section_gallery_title').value,
                description: ''
            },
            services: {
                enabled: document.getElementById('section_services_enabled').checked,
                title: document.getElementById('section_services_title').value,
                description: document.getElementById('section_services_description').value
            },
            sevaOptions: {
                enabled: document.getElementById('section_sevaOptions_enabled').checked,
                title: document.getElementById('section_sevaOptions_title').value
            },
            stats: {
                enabled: document.getElementById('section_stats_enabled').checked,
                title: document.getElementById('section_stats_title').value,
                description: document.getElementById('section_stats_description').value
            },
            contributors: {
                enabled: document.getElementById('section_contributors_enabled').checked,
                title: document.getElementById('section_contributors_title').value
            }
        },
        colors: {
            primary: document.getElementById('colors_primary').value,
            secondary: document.getElementById('colors_secondary').value,
            accent: document.getElementById('colors_accent').value,
            background: document.getElementById('colors_background').value
        },
        fonts: {
            primary: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }
    };

    try {
        const response = await fetch('/api/page-customization', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(customization)
        });

        const result = await response.json();
        
        if (response.ok) {
            showMessage('message-pageCustomization', '✅ Page customization saved successfully! Refresh customer page to see changes.', 'success');
        } else {
            showMessage('message-pageCustomization', 'Error saving customization: ' + (result.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error saving page customization:', error);
        showMessage('message-pageCustomization', 'Error saving customization', 'error');
    }
});

// Original Settings
async function loadSettings() {
    try {
        const response = await fetch('/api/vendor-settings');
        const settings = await response.json();

        document.getElementById('businessName').value = settings.businessName;
        document.getElementById('latitude').value = settings.latitude;
        document.getElementById('longitude').value = settings.longitude;
        document.getElementById('radiusMeters').value = settings.radiusMeters;
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const settings = {
        businessName: document.getElementById('businessName').value,
        latitude: parseFloat(document.getElementById('latitude').value),
        longitude: parseFloat(document.getElementById('longitude').value),
        radiusMeters: parseInt(document.getElementById('radiusMeters').value)
    };

    try {
        const response = await fetch('/api/vendor-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(settings)
        });

        const result = await response.json();
        showMessage('message-settings', 'Settings saved successfully!', 'success');
    } catch (error) {
        showMessage('message-settings', 'Error saving settings', 'error');
    }
});

// Helper functions
function getAuthHeaders() {
    if (!credentials) return {};
    return {
        'username': credentials.username,
        'password': credentials.password
    };
}

function showMessage(elementId, text, type) {
    const div = document.getElementById(elementId);
    if (!div) return;
    
    div.textContent = text;
    div.className = `message ${type}`;
    div.style.display = 'block';
    setTimeout(() => div.style.display = 'none', 3000);
}

// Edit functions (to be called from table buttons)
window.editGalleryItem = function(index, item) {
    currentDataType = 'gallery';
    currentEditId = index;
    document.getElementById('modalTitle').textContent = 'Edit Gallery Item';
    document.getElementById('formFields').innerHTML = getFormFields('gallery');
    
    document.querySelector('[name="imageUrl"]').value = item.imageUrl || '';
    document.querySelector('[name="caption"]').value = item.caption || '';
    document.querySelector('[name="category"]').value = item.category || '';
    
    document.getElementById('dataModal').classList.add('active');
};

window.deleteGalleryItem = async function(index) {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    
    try {
        const response = await fetch(`/api/admin/gallery/${index}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            showMessage('message-gallery', 'Gallery item deleted successfully!', 'success');
            await loadGalleryData();
            await loadDashboardStats();
        } else {
            showMessage('message-gallery', 'Error deleting gallery item', 'error');
        }
    } catch (error) {
        console.error('Error deleting gallery item:', error);
        showMessage('message-gallery', 'Error deleting gallery item', 'error');
    }
};

window.editSevaPackage = function(index, item) {
    currentDataType = 'sevaPackages';
    currentEditId = index;
    document.getElementById('modalTitle').textContent = 'Edit Seva Package';
    document.getElementById('formFields').innerHTML = getFormFields('sevaPackages');
    
    document.querySelector('[name="sevaName"]').value = item.sevaName || '';
    document.querySelector('[name="description"]').value = item.description || '';
    document.querySelector('[name="amount"]').value = item.amount || '';
    document.querySelector('[name="imageUrl"]').value = item.imageUrl || '';
    document.querySelector('[name="category"]').value = item.category || '';
    
    document.getElementById('dataModal').classList.add('active');
};

window.deleteSevaPackage = async function(index) {
    if (!confirm('Are you sure you want to delete this seva package?')) return;
    
    try {
        const response = await fetch(`/api/admin/sevaPackages/${index}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            showMessage('message-sevaPackages', 'Seva package deleted successfully!', 'success');
            await loadSevaPackagesData();
            await loadDashboardStats();
        } else {
            showMessage('message-sevaPackages', 'Error deleting seva package', 'error');
        }
    } catch (error) {
        console.error('Error deleting seva package:', error);
        showMessage('message-sevaPackages', 'Error deleting seva package', 'error');
    }
};

window.editContributor = function(index, item) {
    currentDataType = 'contributors';
    currentEditId = index;
    document.getElementById('modalTitle').textContent = 'Edit Contributor';
    document.getElementById('formFields').innerHTML = getFormFields('contributors');
    
    document.querySelector('[name="name"]').value = item.name || '';
    document.querySelector('[name="amount"]').value = item.amount || '';
    document.querySelector('[name="message"]').value = item.message || '';
    
    // Convert timestamp to datetime-local format if needed
    if (item.timestamp) {
        const date = new Date(item.timestamp);
        const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        document.querySelector('[name="timestamp"]').value = localDateTime;
    }
    
    document.getElementById('dataModal').classList.add('active');
};

window.deleteContributor = async function(index) {
    if (!confirm('Are you sure you want to delete this contributor?')) return;
    
    try {
        const response = await fetch(`/api/admin/contributors/${index}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            showMessage('message-contributors', 'Contributor deleted successfully!', 'success');
            await loadContributorsData();
            await loadDashboardStats();
        } else {
            showMessage('message-contributors', 'Error deleting contributor', 'error');
        }
    } catch (error) {
        console.error('Error deleting contributor:', error);
        showMessage('message-contributors', 'Error deleting contributor', 'error');
    }
};

window.editStatistic = function(name, count) {
    currentDataType = 'statistics';
    currentEditId = name; // For statistics, we use name as ID
    document.getElementById('modalTitle').textContent = 'Edit Statistic';
    document.getElementById('formFields').innerHTML = getFormFields('statistics');
    
    document.querySelector('[name="statName"]').value = name || '';
    document.querySelector('[name="count"]').value = count || '';
    
    document.getElementById('dataModal').classList.add('active');
};

window.deleteStatistic = async function(name) {
    if (!confirm(`Are you sure you want to delete the statistic "${name}"?`)) return;
    
    try {
        const response = await fetch(`/api/admin/statistics/${encodeURIComponent(name)}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            showMessage('message-statistics', 'Statistic deleted successfully!', 'success');
            await loadStatisticsData();
        } else {
            showMessage('message-statistics', 'Error deleting statistic', 'error');
        }
    } catch (error) {
        console.error('Error deleting statistic:', error);
        showMessage('message-statistics', 'Error deleting statistic', 'error');
    }
};

window.editService = function(index, item) {
    currentDataType = 'services';
    currentEditId = index;
    document.getElementById('modalTitle').textContent = 'Edit Service';
    document.getElementById('formFields').innerHTML = getFormFields('services');
    
    document.querySelector('[name="serviceName"]').value = item.serviceName || '';
    document.querySelector('[name="shortDescription"]').value = item.shortDescription || '';
    document.querySelector('[name="longDescription"]').value = item.longDescription || '';
    document.querySelector('[name="iconImageUrl"]').value = item.iconImageUrl || '';
    
    document.getElementById('dataModal').classList.add('active');
};

window.deleteService = async function(index) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
        const response = await fetch(`/api/admin/services/${index}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            showMessage('message-services', 'Service deleted successfully!', 'success');
            await loadServicesData();
        } else {
            showMessage('message-services', 'Error deleting service', 'error');
        }
    } catch (error) {
        console.error('Error deleting service:', error);
        showMessage('message-services', 'Error deleting service', 'error');
    }
};

window.editExpense = function(index, item) {
    currentDataType = 'expenses';
    currentEditId = index;
    document.getElementById('modalTitle').textContent = 'Edit Expense';
    document.getElementById('formFields').innerHTML = getFormFields('expenses');
    
    document.querySelector('[name="materialItem"]').value = item.materialItem || '';
    document.querySelector('[name="quantity"]').value = item.quantity || '';
    document.querySelector('[name="pricePerUnit"]').value = item.pricePerUnit || '';
    document.querySelector('[name="totalAmount"]').value = item.totalAmount || '';
    
    document.getElementById('dataModal').classList.add('active');
};

window.deleteExpense = async function(index) {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
        const response = await fetch(`/api/admin/expenses/${index}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            showMessage('message-expenses', 'Expense deleted successfully!', 'success');
            await loadExpensesData();
        } else {
            showMessage('message-expenses', 'Error deleting expense', 'error');
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        showMessage('message-expenses', 'Error deleting expense', 'error');
    }
};
