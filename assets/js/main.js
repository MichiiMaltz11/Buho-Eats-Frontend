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
function loadComponents() {
    // Ejemplo: cargar header, footer, etc.
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
