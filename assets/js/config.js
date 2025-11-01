/**
 * Configuración de la aplicación
 */
const CONFIG = {
    // URL del backend (ajustar según configuración del servidor)
    API_URL: 'http://localhost:3000/api',
    
    // Endpoints
    ENDPOINTS: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        VERIFY: '/auth/verify',
        PROFILE: '/user/profile',
        // Añadir más endpoints según necesidades
    },
    
    // Configuración de almacenamiento
    STORAGE_KEYS: {
        TOKEN: 'auth_token',
        USER: 'user_data',
    },
    
    // Tiempo de expiración de sesión (en minutos)
    SESSION_TIMEOUT: 30,
};
