/**
 * Utilidades y funciones helper para el proyecto
 */

const Utils = {
    /**
     * Formatea una fecha a formato legible en español
     * @param {Date|string} date - Fecha a formatear
     * @param {boolean} includeTime - Si incluir la hora
     * @returns {string}
     */
    formatDate(date, includeTime = false) {
        const d = new Date(date);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        
        return d.toLocaleDateString('es-MX', options);
    },

    /**
     * Formatea un número a moneda
     * @param {number} amount - Cantidad a formatear
     * @param {string} currency - Código de moneda (default: MXN)
     * @returns {string}
     */
    formatCurrency(amount, currency = 'MXN') {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    /**
     * Valida un email
     * @param {string} email
     * @returns {boolean}
     */
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Sanitiza HTML para prevenir XSS
     * @param {string} text
     * @returns {string}
     */
    sanitizeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Debounce function - útil para búsquedas
     * @param {Function} func
     * @param {number} wait
     * @returns {Function}
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Genera estrellas de rating
     * @param {number} rating - Calificación (0-5)
     * @param {number} maxStars - Máximo de estrellas (default: 5)
     * @returns {string} HTML de estrellas
     */
    renderStars(rating, maxStars = 5) {
        let starsHTML = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '⭐';
        }
        
        if (hasHalfStar && fullStars < maxStars) {
            starsHTML += '✨';
        }
        
        const emptyStars = maxStars - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '☆';
        }
        
        return starsHTML;
    },

    /**
     * Trunca un texto largo
     * @param {string} text
     * @param {number} maxLength
     * @returns {string}
     */
    truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    /**
     * Muestra una notificación toast
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo (success, error, warning, info)
     * @param {number} duration - Duración en ms (default: 3000)
     */
    showToast(message, type = 'info', duration = 3000) {
        // Crear el toast
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg text-white transform transition-all duration-300 translate-x-full z-50`;
        
        // Colores según tipo
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        
        toast.classList.add(colors[type] || colors.info);
        toast.innerHTML = `
            <div class="flex items-center space-x-3">
                <span>${this.getToastIcon(type)}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animación de entrada
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 10);
        
        // Remover después de la duración
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    },

    /**
     * Obtiene el ícono para el toast
     * @param {string} type
     * @returns {string}
     */
    getToastIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    },

    /**
     * Verifica si un elemento está en el viewport
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Calcula el tiempo transcurrido desde una fecha
     * @param {Date|string} date
     * @returns {string}
     */
    timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        
        const intervals = {
            año: 31536000,
            mes: 2592000,
            semana: 604800,
            día: 86400,
            hora: 3600,
            minuto: 60
        };
        
        for (const [name, value] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / value);
            if (interval >= 1) {
                return `Hace ${interval} ${name}${interval > 1 ? (name === 'mes' ? 'es' : 's') : ''}`;
            }
        }
        
        return 'Justo ahora';
    },

    /**
     * Genera un ID único
     * @returns {string}
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Valida la fortaleza de una contraseña
     * @param {string} password
     * @returns {object} {strength: number, label: string, suggestions: array}
     */
    checkPasswordStrength(password) {
        let strength = 0;
        const suggestions = [];
        
        if (password.length >= 8) strength++;
        else suggestions.push('Usa al menos 8 caracteres');
        
        if (password.match(/[a-z]+/)) strength++;
        else suggestions.push('Incluye letras minúsculas');
        
        if (password.match(/[A-Z]+/)) strength++;
        else suggestions.push('Incluye letras mayúsculas');
        
        if (password.match(/[0-9]+/)) strength++;
        else suggestions.push('Incluye números');
        
        if (password.match(/[$@#&!]+/)) strength++;
        else suggestions.push('Incluye caracteres especiales ($@#&!)');
        
        const labels = ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
        
        return {
            strength: strength,
            label: labels[Math.min(strength, 4)],
            suggestions: suggestions
        };
    }
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
