/**
 * Script principal de la aplicación
 */

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Buho Eats - Aplicación iniciada');
    
    // Inicializar la aplicación
    init();
});

/**
 * Inicializa la aplicación
 */
function init() {
    // Proteger rutas según la página actual
    protectRoute();
    
    // Cargar componentes
    loadComponents();
    
    // Inicializar eventos
    setupEventListeners();
}

/**
 * Protege rutas según el rol del usuario
 */
function protectRoute() {
    const body = document.body;
    const page = body.getAttribute('data-page');
    
    // Páginas de owner - solo accesibles por owners
    if (page === 'owner-restaurant' || page === 'owner-stats') {
        if (!Auth.requireRole('owner')) {
            return;
        }
    }
    
    // Páginas de admin - solo accesibles por admins
    if (page && page.startsWith('dashboard-admin')) {
        if (!Auth.requireRole('admin')) {
            return;
        }
    }
    
    // Páginas de usuario - solo accesibles por usuarios con rol 'user'
    const userOnlyPages = ['dashboard-user', 'favorites', 'restaurant-detail'];
    if (userOnlyPages.includes(page)) {
        if (!Auth.requireRole('user')) {
            return;
        }
    }
    
    // Páginas que requieren autenticación (cualquier rol autenticado)
    const protectedPages = ['profile'];
    if (protectedPages.includes(page)) {
        if (!Auth.requireAuth()) {
            return;
        }
    }
}

/**
 * Carga componentes dinámicos
 */
async function loadComponents() {
    // Cargar footer si existe el contenedor
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        try {
            const response = await fetch('../components/footer.html');
            if (response.ok) {
                const html = await response.text();
                footerContainer.innerHTML = html;
            }
        } catch (error) {
            console.error('Error cargando footer:', error);
        }
    }

    // Cargar header si existe el contenedor
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        try {
            // Agregar timestamp para evitar caché
            const response = await fetch(`../components/header.html?v=${Date.now()}`);
            if (response.ok) {
                let html = await response.text();
                
                // Limpiar scripts inyectados por Live Server
                html = html.replace(/<script[^>]*>\s*\/\/ <!\[CDATA\[[\s\S]*?\/\/ \]\]>\s*<\/script>/g, '');
                html = html.replace(/<!-- Code injected by live-server -->[\s\S]*?<script[\s\S]*?<\/script>/g, '');
                
                headerContainer.innerHTML = html;
                
                // Cargar información del usuario después de cargar el header
                setTimeout(() => {
                    if (typeof window.loadUserInfo === 'function') {
                        window.loadUserInfo();
                    }
                    if (typeof window.showHomeOptionIfNeeded === 'function') {
                        window.showHomeOptionIfNeeded();
                    }
                    if (typeof window.configureOwnerMenu === 'function') {
                        window.configureOwnerMenu();
                    }
                }, 300);
            }
        } catch (error) {
            console.error('Error cargando header:', error);
        }
    }

    // Cargar carousel si existe el contenedor
    const carouselContainer = document.getElementById('carousel-container');
    if (carouselContainer) {
        try {
            const response = await fetch('../components/carousel.html');
            if (response.ok) {
                const html = await response.text();
                carouselContainer.innerHTML = html;
                
                // Inicializar el carrusel después de cargar el HTML
                // Esperar un momento para que el DOM se actualice
                setTimeout(() => {
                    if (window.Carousel) {
                        console.log('Inicializando carrusel...');
                        window.Carousel.init();
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Error cargando carousel:', error);
        }
    }
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
    // Ejemplo: eventos de formularios, botones, etc.
}

/**
 * Muestra mensajes al usuario
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje (success, error, warning, info)
 */
function showMessage(message, type = 'info') {
    // Implementar sistema de notificaciones
    console.log(`[${type.toUpperCase()}] ${message}`);
}

/**
 * Formatea una fecha
 * @param {Date|string} date - Fecha a formatear
 * @returns {string}
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Valida un email
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
