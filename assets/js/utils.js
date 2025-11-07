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
    },

    /**
     * 🔐 SEGURIDAD: Genera una huella digital del dispositivo
     * Usado como base para encriptación
     */
    getDeviceFingerprint() {
        return navigator.userAgent + 
               navigator.language + 
               screen.width + 
               screen.height +
               'buho-eats-secret-key-2025';
    },

    /**
     * 🔐 SEGURIDAD: Encripta un token usando Web Crypto API
     * @param {string} token - Token JWT a encriptar
     * @returns {Promise<string>} Token encriptado en base64
     */
    async encryptToken(token) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(token);
            
            // Generar clave desde fingerprint del dispositivo
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(this.getDeviceFingerprint()),
                { name: 'PBKDF2' },
                false,
                ['deriveBits', 'deriveKey']
            );
            
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: encoder.encode('buho-eats-salt-2025'),
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt', 'decrypt']
            );
            
            // Vector de inicialización aleatorio
            const iv = crypto.getRandomValues(new Uint8Array(12));
            
            // Encriptar
            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv },
                key,
                data
            );
            
            // Combinar IV + datos encriptados
            const combined = new Uint8Array(iv.length + encrypted.byteLength);
            combined.set(iv);
            combined.set(new Uint8Array(encrypted), iv.length);
            
            // Convertir a base64
            return btoa(String.fromCharCode(...combined));
        } catch (error) {
            console.error('Error encriptando token:', error);
            return token; // Fallback: retornar sin encriptar
        }
    },

    /**
     * 🔐 SEGURIDAD: Desencripta un token
     * @param {string} encryptedToken - Token encriptado en base64
     * @returns {Promise<string|null>} Token desencriptado o null si falla
     */
    async decryptToken(encryptedToken) {
        try {
            // 🔄 FALLBACK: Si el token parece ser un JWT sin encriptar, devolverlo directamente
            // Esto maneja el caso de tokens guardados antes de implementar encriptación
            if (encryptedToken.startsWith('eyJ')) {
                console.log('🔄 Token sin encriptar detectado (migración automática)');
                return encryptedToken;
            }

            const encoder = new TextEncoder();
            
            // Decodificar base64
            const combined = new Uint8Array(
                atob(encryptedToken).split('').map(c => c.charCodeAt(0))
            );
            
            const iv = combined.slice(0, 12);
            const data = combined.slice(12);
            
            // Generar la misma clave
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(this.getDeviceFingerprint()),
                { name: 'PBKDF2' },
                false,
                ['deriveBits', 'deriveKey']
            );
            
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: encoder.encode('buho-eats-salt-2025'),
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt', 'decrypt']
            );
            
            // Desencriptar
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                key,
                data
            );
            
            return new TextDecoder().decode(decrypted);
        } catch (error) {
            console.error('Error desencriptando token:', error);
            
            // 🔄 FALLBACK ADICIONAL: Si falla la desencriptación pero parece JWT válido
            if (encryptedToken.includes('.') && encryptedToken.split('.').length === 3) {
                console.warn('⚠️ Usando token como JWT sin encriptar (fallback de emergencia)');
                return encryptedToken;
            }
            
            return null;
        }
    },

    /**
     * 🔐 SEGURIDAD: Verifica si la sesión ha expirado (dual check)
     * @returns {boolean} true si la sesión está válida
     */
    isSessionValid() {
        const loginTime = localStorage.getItem('login_time');
        if (!loginTime) return false;

        const maxDuration = 2 * 60 * 60 * 1000; // 2 horas en milisegundos
        const elapsed = Date.now() - parseInt(loginTime);
        
        return elapsed < maxDuration;
    },

    /**
     * 🔐 SEGURIDAD: Obtiene el tiempo restante de sesión
     * @returns {number} Minutos restantes, o 0 si expiró
     */
    getSessionTimeRemaining() {
        const loginTime = localStorage.getItem('login_time');
        if (!loginTime) return 0;

        const maxDuration = 2 * 60 * 60 * 1000; // 2 horas
        const elapsed = Date.now() - parseInt(loginTime);
        const remaining = maxDuration - elapsed;
        
        return remaining > 0 ? Math.floor(remaining / 60000) : 0; // Convertir a minutos
    },

    /**
     * Muestra un mensaje toast temporal
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duración en milisegundos (default: 3000)
     */
    showToast(message, type = 'success', duration = 3000) {
        // Crear contenedor si no existe
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed top-24 right-4 z-50 flex flex-col gap-2';
            document.body.appendChild(container);
        }

        // Configuración de colores según tipo
        const typeStyles = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-white',
            info: 'bg-blue-500 text-white'
        };

        // Iconos según tipo
        const typeIcons = {
            success: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>`,
            error: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>`,
            warning: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>`,
            info: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>`
        };

        // Crear toast
        const toast = document.createElement('div');
        toast.className = `${typeStyles[type]} px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-300 translate-x-full`;
        toast.innerHTML = `
            ${typeIcons[type]}
            <span class="font-medium">${message}</span>
        `;

        container.appendChild(toast);

        // Animar entrada
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Animar salida y eliminar
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
                // Eliminar contenedor si está vacío
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300);
        }, duration);
    }
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
