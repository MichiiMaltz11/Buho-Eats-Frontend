/**
 * Módulo de autenticación
 */
const Auth = {
    /**
     * Verifica si el usuario está autenticado
     * @returns {boolean}
     */
    isAuthenticated() {
        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
        return token !== null;
    },
    
    /**
     * Obtiene el usuario almacenado
     * @returns {object|null}
     */
    getUser() {
        const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
        return userData ? JSON.parse(userData) : null;
    },
    
    /**
     * Guarda el token y datos del usuario
     * @param {string} token - Token de autenticación
     * @param {object} user - Datos del usuario
     */
    saveSession(token, user) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    },
    
    /**
     * Cierra sesión y limpia el almacenamiento
     */
    logout() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
        window.location.href = '/index.html';
    },
    
    /**
     * Intenta hacer login
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña
     * @returns {Promise}
     */
    async login(username, password) {
        try {
            const data = await API.post(CONFIG.ENDPOINTS.LOGIN, {
                username,
                password
            });
            
            if (data.token) {
                this.saveSession(data.token, data.user);
                return data;
            }
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    },
    
    /**
     * Protege rutas que requieren autenticación
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/index.html';
        }
    }
};
