// Global variables
let userLocation = null;
let vendorSettings = null;
let locationVerified = false;
let pageConfig = null;

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// Initialize page
async function initializePage() {
    try {
        // Load page customization
        const response = await fetch('/api/page-customization');
        pageConfig = await response.json();
        
        // Apply configuration
        applyPageCustomization();
        
        // Load dynamic content
        await loadDynamicContent();
        
        // Get user location
        getUserLocation();
    } catch (error) {
        console.error('Error initializing page:', error);
        loadDefaultContent();
    }
}

// Apply page customization
function applyPageCustomization() {
    if (!pageConfig) return;
    
    // Update colors
    if (pageConfig.colors) {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', pageConfig.colors.primary || '#1e3c72');
        root.style.setProperty('--color-secondary', pageConfig.colors.secondary || '#2a5298');
        root.style.setProperty('--color-accent', pageConfig.colors.accent || '#667eea');
    }
    
    // Update header
    if (pageConfig.header) {
        document.getElementById('headerLogo').textContent = pageConfig.header.logo || '🐄';
        document.getElementById('headerTitle').textContent = pageConfig.header.title || 'Bawaliya Seva Sansthan';
        document.title = pageConfig.header.title || 'Bawaliya Seva Sansthan';
    }
    
    // Update hero section
    if (pageConfig.hero) {
        document.getElementById('heroHeading').textContent = pageConfig.hero.mainHeading || '🙏 Gau Seva - A Sacred Service';
        document.getElementById('heroQuote').textContent = pageConfig.hero.quote || 'Serving mother cows with devotion and care';
        
        // Update hero slider
        if (pageConfig.hero.sliderImages && Array.isArray(pageConfig.hero.sliderImages)) {
            const slider = document.getElementById('heroSlider');
            const gradients = [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)'
            ];
            
            slider.innerHTML = pageConfig.hero.sliderImages.map((imgUrl, index) => {
                const gradientBg = gradients[index % gradients.length];
                return `<div class="hero-slide" style="background: ${gradientBg}; background-image: url('${imgUrl}'); background-size: cover; background-position: center;"></div>`;
            }).join('');
        }
    }
    
    // Update section titles
    if (pageConfig.sections) {
        if (pageConfig.sections.services) {
            document.getElementById('featuresTitle').textContent = pageConfig.sections.services.title || 'How We Help';
            document.getElementById('featuresDescription').textContent = pageConfig.sections.services.description || '';
        }
        if (pageConfig.sections.sevaOptions) {
            document.getElementById('causesTitle').textContent = pageConfig.sections.sevaOptions.title || 'GAUSHALA SEVA';
        }
    }
}

// Load all dynamic content
async function loadDynamicContent() {
    await Promise.all([
        loadStats(),
        loadFeatures(),
        loadCauses(),
        loadContributors(),
        loadGallery()
    ]);
}

// Load default content
function loadDefaultContent() {
    console.log('Loading default content...');
}

// Load statistics
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        
        const statsContainer = document.getElementById('statsContainer');
        statsContainer.innerHTML = Object.entries(stats).map(([label, value]) => `
            <div class="stat-card">
                <div class="stat-number">${value}</div>
                <div class="stat-label">${label}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load features (from Services sheet)
async function loadFeatures() {
    try {
        const response = await fetch('/api/services');
        const services = await response.json();
        
        const featuresGrid = document.getElementById('featuresGrid');
        featuresGrid.innerHTML = services.map(service => `
            <div class="feature-card">
                <div class="feature-icon">${service.iconImageUrl ? `<img src="${service.iconImageUrl}" style="width: 60px; height: 60px; object-fit: contain;">` : '🐄'}</div>
                <h3>${service.serviceName}</h3>
                <p>${service.shortDescription || service.longDescription || ''}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading features:', error);
    }
}

// Load causes/donation packages (from SevaPackages sheet)
async function loadCauses() {
    try {
        const response = await fetch('/api/seva-services');
        const packages = await response.json();
        
        const causesGrid = document.getElementById('causesGrid');
        causesGrid.innerHTML = packages.map(pkg => `
            <div class="cause-card">
                <img src="${pkg.imageUrl || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=500&q=80'}" alt="${pkg.sevaName}" class="cause-image">
                <div class="cause-content">
                    <h3 class="cause-title">${pkg.sevaName}</h3>
                    <p class="cause-description">${pkg.description || ''}</p>
                    <div class="cause-amount">₹${pkg.amount}</div>
                    <button class="cause-btn" onclick="openBookingModal(event)">Donate</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading causes:', error);
    }
}

// Load contributors
async function loadContributors() {
    try {
        const response = await fetch('/api/contributors');
        const contributors = await response.json();
        
        const contributorsGrid = document.getElementById('contributorsGrid');
        contributorsGrid.innerHTML = contributors.slice(0, 6).map(contributor => {
            const initial = contributor.name.charAt(0).toUpperCase();
            const date = new Date(contributor.timestamp).toLocaleDateString();
            
            return `
                <div class="contributor-card">
                    <div class="contributor-avatar">${initial}</div>
                    <div class="contributor-info">
                        <h4>${contributor.name}</h4>
                        <div class="contributor-amount">₹${contributor.amount}</div>
                        <div class="contributor-date">${date}</div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading contributors:', error);
    }
}

// Load gallery
async function loadGallery() {
    try {
        const response = await fetch('/api/gallery');
        const images = await response.json();
        
        const galleryGrid = document.getElementById('galleryGrid');
        galleryGrid.innerHTML = images.map(img => `
            <div class="gallery-item">
                <img src="${img.imageUrl}" alt="${img.caption}">
                <div class="gallery-overlay">
                    <p>${img.caption || ''}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

// Modal functions
function openBookingModal(event) {
    event.preventDefault();
    document.getElementById('bookingModal').classList.add('active');
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
}

// Click outside modal to close
document.addEventListener('click', function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeBookingModal();
    }
});

// Get user location
function getUserLocation() {
    const locationText = document.getElementById('locationText');
    
    if (!navigator.geolocation) {
        locationText.textContent = '📍 Geolocation not supported';
        return;
    }
    
    locationText.textContent = '📍 Getting your location...';
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            // Load vendor settings
            try {
                const response = await fetch('/api/vendor-settings');
                vendorSettings = await response.json();
                
                // Calculate distance
                const distance = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    vendorSettings.latitude,
                    vendorSettings.longitude
                );
                
                if (distance <= vendorSettings.radiusMeters) {
                    locationVerified = true;
                    locationText.innerHTML = '✅ Location verified - You are in our service area';
                    locationText.style.background = '#d4edda';
                    locationText.style.color = '#155724';
                } else {
                    locationVerified = false;
                    locationText.innerHTML = '⚠️ You are outside our service area';
                    locationText.style.background = '#fff3cd';
                    locationText.style.color = '#856404';
                }
            } catch (error) {
                console.error('Error checking location:', error);
                locationText.textContent = '📍 Location obtained';
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
            locationText.textContent = '📍 Location access denied';
        }
    );
}

// Calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// Handle booking form submission
document.getElementById('bookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const messageDiv = document.getElementById('message');
    const submitBtn = this.querySelector('.submit-btn');
    
    // Get form data
    const formData = {
        customerName: document.getElementById('customerName').value,
        customerPhone: document.getElementById('customerPhone').value,
        customerEmail: document.getElementById('customerEmail').value,
        notes: document.getElementById('notes').value,
        customerLat: userLocation ? userLocation.lat : 0,
        customerLng: userLocation ? userLocation.lng : 0
    };
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Booking...';
    
    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = '✅ ' + result.message;
            this.reset();
            
            setTimeout(() => {
                closeBookingModal();
                messageDiv.className = 'message';
            }, 3000);
        } else {
            throw new Error(result.error || 'Booking failed');
        }
    } catch (error) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '❌ ' + error.message;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Book Seva Appointment';
    }
});
