/**
 * Utilidades y funciones helper para el proyecto
 */

const Utils = {
    /**
     * Formatea fechas en español
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
     * Formatea moneda
     */
    formatCurrency(amount, currency = 'MXN') {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency
        }).format(amount);
    },

    /**
     * Sanitiza texto para prevenir XSS
     */
    sanitizeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Debounce útil para búsquedas
     */
    debounce(func, wait = 300) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    },

    /**
     * Renderiza estrellas
     */
    renderStars(rating, maxStars = 5) {
        let html = '';
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;

        html += '⭐'.repeat(full);
        if (half) html += '✨';
        html += '☆'.repeat(maxStars - Math.ceil(rating));

        return html;
    },

    /**
     * Truncar texto
     */
    truncateText(text, maxLength = 100) {
        return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
    },

    /**
     * Verifica si un elemento está en viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth
        );
    },

    /**
     * Time ago estilo redes sociales
     */
    timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);

        const intervals = {
            "año": 31536000,
            "mes": 2592000,
            "semana": 604800,
            "día": 86400,
            "hora": 3600,
            "minuto": 60
        };

        for (const [name, value] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / value);
            if (interval >= 1) {
                return `Hace ${interval} ${name}${interval > 1 ? (name === 'mes' ? 'es' : 's') : ''}`;
            }
        }

        return "Justo ahora";
    },

    /**
     * Generar ID único
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    },

    /**
     * 🔐 Calcula fortaleza de contraseña
     */
    checkPasswordStrength(password) {
        let strength = 0;
        const suggestions = [];

        if (password.length >= 8) strength++;
        else suggestions.push("Usa al menos 8 caracteres");

        if (/[a-z]/.test(password)) strength++;
        else suggestions.push("Incluye letras minúsculas");

        if (/[A-Z]/.test(password)) strength++;
        else suggestions.push("Incluye letras mayúsculas");

        if (/[0-9]/.test(password)) strength++;
        else suggestions.push("Incluye números");

        if (/[$@#&!]/.test(password)) strength++;
        else suggestions.push("Incluye caracteres especiales");

        const labels = ["Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte"];

        return {
            strength,
            label: labels[Math.min(strength, 4)],
            suggestions
        };
    },

    /**
     * 🔐 Huella digital del dispositivo (hash)
     */
    getDeviceFingerprint() {
        return (
            navigator.userAgent +
            navigator.language +
            screen.width +
            screen.height +
            "buho-eats-secret-key-2025"
        );
    },

    /**
     * 🔐 Encripta token con WebCrypto
     */
    async encryptToken(token) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(token);

            const keyMaterial = await crypto.subtle.importKey(
                "raw",
                encoder.encode(this.getDeviceFingerprint()),
                { name: "PBKDF2" },
                false,
                ["deriveKey"]
            );

            const key = await crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: encoder.encode("buho-eats-salt-2025"),
                    iterations: 100000,
                    hash: "SHA-256"
                },
                keyMaterial,
                { name: "AES-GCM", length: 256 },
                false,
                ["encrypt", "decrypt"]
            );

            const iv = crypto.getRandomValues(new Uint8Array(12));

            const encrypted = await crypto.subtle.encrypt(
                { name: "AES-GCM", iv },
                key,
                data
            );

            const combined = new Uint8Array(iv.length + encrypted.byteLength);
            combined.set(iv);
            combined.set(new Uint8Array(encrypted), iv.length);

            return btoa(String.fromCharCode(...combined));
        } catch (e) {
            console.error("Error encriptando token:", e);
            return token;
        }
    },

    /**
     * 🔐 Desencripta token (con fallback)
     */
    async decryptToken(encryptedToken) {
        try {
            if (encryptedToken.startsWith("eyJ")) {
                return encryptedToken; // Ya es JWT
            }

            const combined = new Uint8Array(
                atob(encryptedToken).split("").map((c) => c.charCodeAt(0))
            );

            const iv = combined.slice(0, 12);
            const data = combined.slice(12);

            const encoder = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey(
                "raw",
                encoder.encode(this.getDeviceFingerprint()),
                { name: "PBKDF2" },
                false,
                ["deriveKey"]
            );

            const key = await crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: encoder.encode("buho-eats-salt-2025"),
                    iterations: 100000,
                    hash: "SHA-256"
                },
                keyMaterial,
                { name: "AES-GCM", length: 256 },
                false,
                ["decrypt"]
            );

            const decrypted = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv },
                key,
                data
            );

            return new TextDecoder().decode(decrypted);
        } catch (error) {
            console.error("Error desencriptando token:", error);

            if (encryptedToken.includes(".") && encryptedToken.split(".").length === 3) {
                return encryptedToken;
            }

            return null;
        }
    },

    /**
     * 🔐 Valida duración de sesión
     */
    isSessionValid() {
        const loginTime = localStorage.getItem("login_time");
        if (!loginTime) return false;

        const max = 2 * 60 * 60 * 1000;
        const elapsed = Date.now() - parseInt(loginTime);

        return elapsed < max;
    },

    /**
     * Tiempo restante de sesión
     */
    getSessionTimeRemaining() {
        const loginTime = localStorage.getItem("login_time");
        if (!loginTime) return 0;

        const max = 2 * 60 * 60 * 1000;
        const elapsed = Date.now() - parseInt(loginTime);

        return Math.max(0, Math.floor((max - elapsed) / 60000));
    },

    /**
     * ⭐️ Toast limpito
     */
    showToast(message, type = "success", duration = 3000) {
        let container = document.getElementById("toast-container");

        if (!container) {
            container = document.createElement("div");
            container.id = "toast-container";
            container.className = "fixed top-24 right-4 z-50 flex flex-col gap-2";
            document.body.appendChild(container);
        }

        const typeStyles = {
            success: "bg-green-500 text-white",
            error: "bg-red-500 text-white",
            warning: "bg-yellow-500 text-white",
            info: "bg-blue-500 text-white"
        };

        const toast = document.createElement("div");
        toast.className = `${typeStyles[type]} px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-300 translate-x-full`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => (toast.style.transform = "translateX(0)"), 10);

        setTimeout(() => {
            toast.style.transform = "translateX(500px)";
            toast.style.opacity = "0";

            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

/** Exportar si está en entorno Node (tests) */
if (typeof module !== "undefined" && module.exports) {
    module.exports = Utils;
}

// ===================== VALIDACIONES =====================

/**
 * Valida formato de email
 */
Utils.isValidEmail = function(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Valida que la contraseña tenga mínimo 6 caracteres
 */
Utils.isValidPassword = function(password) {
    return password && password.length >= 6;
};
