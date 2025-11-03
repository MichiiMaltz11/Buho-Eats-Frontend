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
    // Verificar autenticación si es necesario
    // Auth.requireAuth();
    
    // Cargar componentes
    loadComponents();
    
    // Inicializar eventos
    setupEventListeners();
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
            const response = await fetch('../components/header.html');
            if (response.ok) {
                const html = await response.text();
                headerContainer.innerHTML = html;
                
                // Cargar información del usuario después de cargar el header
                setTimeout(() => {
                    if (typeof window.loadUserInfo === 'function') {
                        window.loadUserInfo();
                    }
                    if (typeof window.showHomeOptionIfNeeded === 'function') {
                        window.showHomeOptionIfNeeded();
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
