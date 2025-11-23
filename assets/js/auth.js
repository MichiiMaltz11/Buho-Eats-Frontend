/**
 * Módulo de autenticación con medidas de seguridad
 */

/** Sanitiza un string para prevenir XSS */
function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
    };
    return str.replace(/[&<>"'/]/g, (char) => map[char]);
}

/** Valida email */
function isValidEmail(email) {
    const emailRegex =
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

/** Valida contraseña */
function validatePassword(password) {
    const errors = [];
    if (!password || password.length < 8) errors.push('Debe tener mínimo 8 caracteres');
    if (!/[A-Z]/.test(password)) errors.push('Debe contener una mayúscula');
    if (!/[a-z]/.test(password)) errors.push('Debe contener una minúscula');
    if (!/[0-9]/.test(password)) errors.push('Debe contener un número');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
        errors.push('Debe contener un caracter especial');
    return { isValid: errors.length === 0, errors };
}

/** Decodifica token y revisa expiración */
function isTokenExpired(token) {
    try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        return Date.now() >= tokenData.exp * 1000;
    } catch {
        return true;
    }
}

const Auth = {
    TOKEN_EXPIRATION_HOURS: 2,

    isAuthenticated() {
        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
        const user = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
        if (!token || !user) return false;
        if (!Utils.isSessionValid()) {
            this.logout();
            return false;
        }
        return true;
    },

    async getToken() {
        const encryptedToken = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
        if (!encryptedToken) return null;

        if (!Utils.isSessionValid()) {
            this.logout();
            return null;
        }

        const token = await Utils.decryptToken(encryptedToken);
        if (!token) {
            this.logout();
            return null;
        }

        // Revisar expiración JWT
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp && Math.floor(Date.now() / 1000) >= payload.exp) {
                this.logout();
                return null;
            }
        } catch {}

        return token;
    },

    getUser() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
            if (!data) return null;
            const user = JSON.parse(data);
            delete user.password;
            return user;
        } catch {
            return null;
        }
    },

    getUserRole() {
        const user = this.getUser();
        return user ? user.role : null;
    },

    saveSession(token, user) {
        delete user.password;
        const encrypted = this.createTokenWithExpiry(token);
        localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, encrypted);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
        this.updateLastActivity();
    },

    saveUser(user) {
        delete user.password;
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    },

    createTokenWithExpiry(token) {
        const expiry = Date.now() + this.TOKEN_EXPIRATION_HOURS * 3600 * 1000;
        const payload = {
            token,
            exp: Math.floor(expiry / 1000),
        };
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const encoded = btoa(JSON.stringify(payload));
        const signature = btoa('sig-' + Date.now());
        return `${header}.${encoded}.${signature}`;
    },

    updateLastActivity() {
        localStorage.setItem('last_activity', Date.now().toString());
    },

    checkInactivity() {
        const last = localStorage.getItem('last_activity');
        if (!last) return;
        const inactive = Date.now() - parseInt(last);
        if (inactive > 30 * 60 * 1000) {
            this.logout();
        }
    },

    async logout() {
        const encryptedToken = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);

        if (encryptedToken) {
            try {
                const token = await Utils.decryptToken(encryptedToken);
                if (token) {
                    await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.LOGOUT}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        keepalive: true,
                    });
                }
            } catch {}
        }

        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
        localStorage.removeItem('last_activity');
        localStorage.removeItem('login_time');

        window.location.href = '../index.html';
    },

    /** LOGIN */
    async login(email, password) {
        email = sanitizeInput(email.trim());
        if (!email || !password) throw new Error('Email y contraseña requeridos');
        if (!isValidEmail(email)) throw new Error('Email inválido');

        const response = await API.post(CONFIG.ENDPOINTS.LOGIN, {
            email,
            password,
        });

        if (!response.success)
            throw new Error(response.error || 'Credenciales incorrectas');

        const { token, user } = response.data;
        if (!token || !user) throw new Error('Respuesta incompleta');

        const encryptedToken = await Utils.encryptToken(token);
        localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, encryptedToken);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem('login_time', Date.now().toString());

        this.updateLastActivity();
        return response.data;
    },

    /** REGISTER con soporte OWNER */
    async register(userData) {
        if (!isValidEmail(userData.email))
            throw new Error('Email inválido');

        const passCheck = validatePassword(userData.password);
        if (!passCheck.isValid)
            throw new Error(passCheck.errors.join('\n'));

        const sanitized = {
            firstName: sanitizeInput(userData.firstName),
            lastName: sanitizeInput(userData.lastName),
            email: sanitizeInput(userData.email.toLowerCase()),
            password: userData.password,
            role: userData.role,
        };

        // AGREGAR CAMPOS DE OWNER
        if (userData.role === 'owner') {
            sanitized.restaurant = {
                name: sanitizeInput(userData.businessName),
                address: sanitizeInput(userData.businessAddress),
            };
        }

        const response = await API.post(CONFIG.ENDPOINTS.REGISTER, sanitized);

        if (!response.success)
            throw new Error(response.error || 'Error en registro');

        return response.data;
    },

    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '../index.html';
            return false;
        }
        this.checkInactivity();
        this.updateLastActivity();
        return true;
    },

    requireRole(roles) {
        if (!this.requireAuth()) return false;
        const role = this.getUserRole();
        const allowed = Array.isArray(roles) ? roles : [roles];
        if (!allowed.includes(role)) {
            alert('No tienes permisos');
            this.redirectToDashboard();
            return false;
        }
        return true;
    },

    redirectToDashboard() {
        const role = this.getUserRole();
        switch (role) {
            case 'admin':
                window.location.href = '../pages/dashboard-admin.html';
                break;
            case 'owner':
                window.location.href = '../pages/dashboard-owner.html';
                break;
            default:
                window.location.href = '../pages/dashboard-user.html';
        }
    },
};

/** Helpers globales */
function isAuthenticated() {
    return Auth.isAuthenticated();
}

function getUser() {
    return Auth.getUser();
}

/** Eventos para registrar actividad */
['mousedown', 'keypress', 'scroll', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, () => {
        if (Auth.isAuthenticated()) Auth.updateLastActivity();
    });
});

setInterval(() => {
    if (Auth.isAuthenticated()) Auth.checkInactivity();
}, 60000);