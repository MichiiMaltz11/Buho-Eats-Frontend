/**
 * Módulo para manejar peticiones al API
 */
const API = {
    /**
     * Realiza una petición HTTP al backend
     * @param {string} endpoint - Endpoint del API
     * @param {object} options - Opciones de la petición (method, body, headers)
     * @returns {Promise} - Promesa con la respuesta
     */
    async request(endpoint, options = {}) {
        const url = `${CONFIG.API_URL}${endpoint}`;
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };
        
        // Agregar token si existe
        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }
        
        const config = {
            method: options.method || 'GET',
            headers: { ...defaultHeaders, ...options.headers },
        };
        
        if (options.body) {
            config.body = JSON.stringify(options.body);
        }
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }
            
            return data;
        } catch (error) {
            console.error('Error en API:', error);
            throw error;
        }
    },
    
    // Métodos auxiliares
    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },
    
    post(endpoint, body) {
        return this.request(endpoint, { method: 'POST', body });
    },
    
    put(endpoint, body) {
        return this.request(endpoint, { method: 'PUT', body });
    },
    
    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },
};
