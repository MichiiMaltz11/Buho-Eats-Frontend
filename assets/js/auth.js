/**
 * Módulo de autenticación con medidas de seguridad
 */
/**
 * Sanitiza un string para prevenir XSS
 * @param {string} str - String a sanitizar
 * @returns {string}
 */
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

/**
 * Valida formato de email
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

/**
 * Valida que la contraseña cumpla con requisitos de seguridad
 * @param {string} password
 * @returns {object} {isValid: boolean, errors: string[]}
 */
function validatePassword(password) {
    const errors = [];
    
    if (!password || password.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Debe contener al menos una letra mayúscula');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Debe contener al menos una letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Debe contener al menos un número');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Debe contener al menos un carácter especial');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Verifica si un token JWT ha expirado
 * @param {string} token
 * @returns {boolean}
 */
function isTokenExpired(token) {
    try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenData.exp * 1000; // Convertir a milisegundos
        return Date.now() >= expirationTime;
    } catch (error) {
        return true; // Si no se puede decodificar, considerar expirado
    }
}

const RateLimiter = {
    MAX_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos en milisegundos
    ATTEMPT_RESET_TIME: 5 * 60 * 1000, // 5 minutos
    
    /**
     * Obtiene los intentos de login almacenados
     */
    getAttempts() {
        const attempts = localStorage.getItem('login_attempts');
        return attempts ? JSON.parse(attempts) : { count: 0, timestamp: Date.now(), lockedUntil: null };
    },
    
    /**
     * Verifica si la cuenta está bloqueada
     */
    isLocked() {
        const attempts = this.getAttempts();
        
        if (attempts.lockedUntil) {
            if (Date.now() < attempts.lockedUntil) {
                return {
                    locked: true,
                    remainingTime: Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60)
                };
            } else {
                // El bloqueo expiró, resetear
                this.resetAttempts();
                return { locked: false };
            }
        }
        
        return { locked: false };
    },
    
    /**
     * Registra un intento fallido de login
     */
    recordFailedAttempt() {
        const attempts = this.getAttempts();
        
        // Si pasó el tiempo de reset, reiniciar contador
        if (Date.now() - attempts.timestamp > this.ATTEMPT_RESET_TIME) {
            attempts.count = 1;
            attempts.timestamp = Date.now();
        } else {
            attempts.count += 1;
        }
        
        // Si excede el máximo, bloquear
        if (attempts.count >= this.MAX_ATTEMPTS) {
            attempts.lockedUntil = Date.now() + this.LOCKOUT_DURATION;
        }
        
        localStorage.setItem('login_attempts', JSON.stringify(attempts));
    },
    
    /**
     * Resetea los intentos de login
     */
    resetAttempts() {
        localStorage.setItem('login_attempts', JSON.stringify({
            count: 0,
            timestamp: Date.now(),
            lockedUntil: null
        }));
    },
    
    /**
     * Obtiene el número de intentos restantes
     */
    getRemainingAttempts() {
        const attempts = this.getAttempts();
        return Math.max(0, this.MAX_ATTEMPTS - attempts.count);
    }
};

const Auth = {
    // Tiempo de expiración del token (en horas)
    TOKEN_EXPIRATION_HOURS: 2,
    
    /**
     * Verifica si hay un token válido y no expirado
     * @returns {boolean}
     */
    isAuthenticated() {
        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
        const user = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
        
        if (!token || !user) {
            return false;
        }

        // Verificar expiración dual (lado cliente)
        if (!Utils.isSessionValid()) {
            console.warn('Sesión expirada (verificación dual), cerrando sesión...');
            this.logout();
            return false;
        }
        
        return true;
    },

    /**
     * Obtiene el token desencriptado para enviar al servidor
     * @returns {Promise<string|null>}
     */
    async getToken() {
        const encryptedToken = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
        
        if (!encryptedToken) return null;

        // Verificar expiración dual antes de desencriptar
        if (!Utils.isSessionValid()) {
            console.warn('Sesión expirada, cerrando sesión...');
            this.logout();
            return null;
        }

        // Desencriptar token
        const token = await Utils.decryptToken(encryptedToken);
        
        if (!token) {
            console.error('No se pudo desencriptar el token');
            this.logout();
            return null;
        }
        
        // Verificar si el token JWT ha expirado
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            
            if (payload.exp && now >= payload.exp) {
                console.warn('Token JWT expirado, cerrando sesión...');
                this.logout();
                return null;
            }
        } catch (error) {
            console.error('Error verificando expiración del token:', error);
        }
        
        return token;
    },
    
    /**
     * Obtiene el usuario almacenado de forma segura
     * @returns {object|null}
     */
    getUser() {
        try {
            const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
            if (!userData) return null;
            
            const user = JSON.parse(userData);
            
            // Nunca debe haber contraseña en el objeto usuario
            if (user.password) {
                delete user.password;
                this.saveUser(user);
            }
            
            return user;
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return null;
        }
    },
    
    /**
     * Obtiene el rol del usuario actual
     * @returns {string|null}
     */
    getUserRole() {
        const user = this.getUser();
        return user ? user.role : null;
    },
    
    /**
     * Verifica si el usuario tiene un rol específico
     * @param {string} role - Rol a verificar
     * @returns {boolean}
     */
    hasRole(role) {
        return this.getUserRole() === role;
    },
    
    /**
     * Guarda el token y datos del usuario de forma segura
     * @param {string} token - Token de autenticación
     * @param {object} user - Datos del usuario
     */
    saveSession(token, user) {
        // Eliminar contraseña si existe
        if (user.password) {
            delete user.password;
        }
        
        // Crear token con timestamp de expiración
        const tokenWithExpiry = this.createTokenWithExpiry(token);
        
        localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, tokenWithExpiry);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
        
        // Guardar timestamp de última actividad
        this.updateLastActivity();
    },
    
    /**
     * Guarda/actualiza datos del usuario
     * @param {object} user - Datos del usuario
     */
    saveUser(user) {
        if (user.password) {
            delete user.password;
        }
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    },
    
    /**
     * Crea un token con información de expiración
     * @param {string} token
     * @returns {string}
     */
    createTokenWithExpiry(token) {
        const expiryTime = Date.now() + (this.TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000);
        const payload = {
            token: token,
            exp: Math.floor(expiryTime / 1000) // En segundos
        };
        
        // Estructura JWT: header.payload.signature
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payloadEncoded = btoa(JSON.stringify(payload));
        const signature = btoa('simulated-signature-' + Date.now());
        
        return `${header}.${payloadEncoded}.${signature}`;
    },
    
    /**
     * Actualiza el timestamp de última actividad
     */
    updateLastActivity() {
        localStorage.setItem('last_activity', Date.now().toString());
    },
    
    /**
     * Verifica inactividad y cierra sesión si es necesario
     */
    checkInactivity() {
        const lastActivity = localStorage.getItem('last_activity');
        if (!lastActivity) return;
        
        const inactiveTime = Date.now() - parseInt(lastActivity);
        const maxInactiveTime = 30 * 60 * 1000; // 30 minutos
        
        if (inactiveTime > maxInactiveTime) {
            this.logout();
            alert('Tu sesión ha expirado por inactividad');
        }
    },
    
    /**
     * Cierra sesión y limpia todo el almacenamiento sensible
     * Ahora también invalida el token en el servidor
     */
    async logout() {
        const encryptedToken = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
        
        // Invalidar token en el servidor (si existe)
        if (encryptedToken) {
            try {
                // Desencriptar token para enviarlo al servidor
                const token = await Utils.decryptToken(encryptedToken);
                
                if (token) {
                    // Usar fetch directo con keepalive para que la petición se complete aunque se cierre la página
                    await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.LOGOUT}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({}),
                        keepalive: true  // Mantiene la petición aunque se cierre la página
                    });
                }
            } catch (error) {
                // Si falla el logout en servidor, continuar de todas formas
                console.warn('No se pudo invalidar token en servidor:', error.message);
            }
        }
        
        // Limpiar datos locales
        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
        localStorage.removeItem('last_activity');
        localStorage.removeItem('login_time');  // Limpiar tiempo de login
        
        
        // Redirigir al login
        window.location.href = '../index.html';
    },
    
    /**
     * Intenta hacer login con validaciones de seguridad
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña
     * @returns {Promise}
     */
    async login(email, password) {
        // Sanitizar inputs
        email = sanitizeInput(email.trim());
        
        // Validar que no estén vacíos
        if (!email || !password) {
            throw new Error('Email y contraseña son requeridos');
        }
        
        // Validar formato de email
        if (!isValidEmail(email)) {
            throw new Error('Email inválido');
        }
        
        try {
            const response = await API.post(CONFIG.ENDPOINTS.LOGIN, {
                email: email,
                password: password
            });
            
            console.log('Login response:', response);
            
            // Manejar estructura de respuesta: { success, data: { user, token } }
            if (response.success && response.data) {
                const { user, token } = response.data;
                
                if (user && token) {
                    // Encriptar token antes de guardar
                    const encryptedToken = await Utils.encryptToken(token);
                    
                    // Guardar token encriptado
                    localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, encryptedToken);
                    localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
                    
                    // Guardar tiempo de login para verificación dual
                    localStorage.setItem('login_time', Date.now().toString());
                    
                    this.updateLastActivity();
                    
                    return response.data;
                } else {
                    throw new Error('Respuesta del servidor incompleta');
                }
            } else {
                // Login fallido - el error viene del backend
                const errorMsg = response.error || 'Credenciales incorrectas';
                
                // Si el backend devuelve remainingAttempts, incluirlo en el mensaje
                if (response.remainingAttempts !== undefined && response.remainingAttempts >= 0) {
                    throw new Error(`${errorMsg} (${response.remainingAttempts} intentos restantes)`);
                } else {
                    throw new Error(errorMsg);
                }
            }
        } catch (error) {
            // Si el error viene del API con estructura específica, extraer el mensaje
            if (error.remainingAttempts !== undefined) {
                throw new Error(`${error.error || 'Error de autenticación'} (${error.remainingAttempts} intentos restantes)`);
            }
            throw error;
        }
    },
    
    /**
     * Registra un nuevo usuario con validaciones
     * @param {object} userData - Datos del usuario
     * @returns {Promise}
     */
    async register(userData) {
        // Validar email
        if (!isValidEmail(userData.email)) {
            throw new Error('Email inválido');
        }
        
        // Validar contraseña
        const passwordValidation = validatePassword(userData.password);
        if (!passwordValidation.isValid) {
            throw new Error('Contraseña no cumple requisitos:\n' + passwordValidation.errors.join('\n'));
        }
        
        // Sanitizar inputs
        const sanitizedData = {
            firstName: sanitizeInput(userData.firstName),
            lastName: sanitizeInput(userData.lastName),
            email: sanitizeInput(userData.email.toLowerCase()),
            password: userData.password, // La contraseña no se sanitiza, se hashea en backend
        };
        
        try {
            const response = await API.post(CONFIG.ENDPOINTS.REGISTER, sanitizedData);
            
            console.log('Register response:', response);
            
            // Manejar estructura de respuesta: { success, data: { message, user, token } }
            if (response.success && response.data) {
                // Registro exitoso
                return response.data;
            } else {
                throw new Error(response.error || 'Error en el registro');
            }
        } catch (error) {
            throw error;
        }
    },
    
    /**
     * Protege rutas que requieren autenticación
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '../index.html';
            return false;
        }
        
        // Verificar inactividad
        this.checkInactivity();
        
        // Actualizar última actividad
        this.updateLastActivity();
        
        return true;
    },
    
    /**
     * Protege rutas según el rol del usuario
     * @param {string|string[]} allowedRoles - Rol o roles permitidos
     */
    requireRole(allowedRoles) {
        if (!this.requireAuth()) {
            return false;
        }
        
        const userRole = this.getUserRole();
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        
        if (!roles.includes(userRole)) {
            alert('No tienes permisos para acceder a esta página');
            this.redirectToDashboard();
            return false;
        }
        
        return true;
    },
    
    /**
     * Redirige al dashboard según el rol del usuario
     */
    redirectToDashboard() {
        const role = this.getUserRole();
        
        switch(role) {
            case 'admin':
                window.location.href = '../pages/dashboard-admin.html';
                break;
            case 'owner':
                window.location.href = '../pages/dashboard-owner.html';
                break;
            case 'user':
            default:
                window.location.href = '../pages/dashboard-user.html';
                break;
        }
    }
};
/**
 * Función global para verificar autenticación
 */
function isAuthenticated() {
    return Auth.isAuthenticated();
}

/**
 * Función global para obtener el usuario
 */
function getUser() {
    return Auth.getUser();
}

// NOTA: La función logout() global se define en cada página que la necesita
// porque requiere acceso a showDialog() que puede estar implementado de diferentes formas
// Ver dashboard-user.html, profile.html, etc.

// Actualizar última actividad con cada interacción del usuario
if (typeof document !== 'undefined') {
    ['mousedown', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, () => {
            if (Auth.isAuthenticated()) {
                Auth.updateLastActivity();
            }
        }, { passive: true });
    });
    
    // Verificar inactividad cada minuto
    setInterval(() => {
        if (Auth.isAuthenticated()) {
            Auth.checkInactivity();
        }
    }, 60000);
}

