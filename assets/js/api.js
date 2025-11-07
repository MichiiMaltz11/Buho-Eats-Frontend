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
        
        // 🔐 SEGURIDAD: Obtener token desencriptado
        if (typeof Auth !== 'undefined' && Auth.isAuthenticated()) {
            const token = await Auth.getToken();
            if (token) {
                defaultHeaders['Authorization'] = `Bearer ${token}`;
            }
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
            
            // Si la respuesta no es OK, lanzar error con el mensaje del backend
            if (!response.ok || !data.success) {
                const error = new Error(data.error || 'Error en la petición');
                error.status = response.status;
                error.data = data;
                throw error;
            }
            
            return data;
        } catch (error) {
            // Si es un error de red o JSON parsing
            if (!error.status) {
                console.error('Error de red o conexión:', error);
                throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000');
            }
            
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
