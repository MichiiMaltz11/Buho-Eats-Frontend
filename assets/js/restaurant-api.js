/**
 * Restaurant API
 * Wrapper para llamadas a la API de restaurantes
 */

const RestaurantAPI = {
    /**
     * Obtener todos los restaurantes
     * @param {Object} filters - Filtros opcionales (search, cuisine, minRating, limit, offset)
     * @returns {Promise} Respuesta de la API
     */
    async getAll(filters = {}) {
        try {
            // Construir query params
            const params = new URLSearchParams();
            
            if (filters.search) params.append('search', filters.search);
            if (filters.cuisine) params.append('cuisine', filters.cuisine);
            if (filters.minRating) params.append('minRating', filters.minRating);
            if (filters.limit) params.append('limit', filters.limit);
            if (filters.offset) params.append('offset', filters.offset);
            if (filters.sort) params.append('sort', filters.sort);
            if (filters.order) params.append('order', filters.order);

            const queryString = params.toString();
            const url = `${CONFIG.API_URL}/restaurants${queryString ? '?' + queryString : ''}`;
            
            console.log('RestaurantAPI.getAll - URL:', url);
            
            const response = await fetch(url);
            const data = await response.json();
            
            console.log('RestaurantAPI.getAll - Respuesta:', data);
            
            return data;
        } catch (error) {
            console.error('Error en RestaurantAPI.getAll:', error);
            return {
                success: false,
                error: error.message || 'Error al cargar restaurantes'
            };
        }
    },

    /**
     * Obtener un restaurante por ID
     * @param {number} id - ID del restaurante
     * @returns {Promise} Respuesta de la API
     */
    async getById(id) {
        try {
            const response = await fetch(`${CONFIG.API_URL}/restaurants/${id}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en RestaurantAPI.getById:', error);
            return {
                success: false,
                error: error.message || 'Error al cargar restaurante'
            };
        }
    },

    /**
     * Crear un nuevo restaurante (requiere autenticación)
     * @param {Object} restaurantData - Datos del restaurante
     * @returns {Promise} Respuesta de la API
     */
    async create(restaurantData) {
        try {
            const token = await Auth.getToken();
            if (!token) throw new Error('No autenticado');

            const response = await fetch(`${CONFIG.API_URL}/restaurants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(restaurantData)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en RestaurantAPI.create:', error);
            return {
                success: false,
                error: error.message || 'Error al crear restaurante'
            };
        }
    },

    /**
     * Actualizar un restaurante (requiere autenticación)
     * @param {number} id - ID del restaurante
     * @param {Object} restaurantData - Datos actualizados
     * @returns {Promise} Respuesta de la API
     */
    async update(id, restaurantData) {
        try {
            const token = await Auth.getToken();
            if (!token) throw new Error('No autenticado');

            const response = await fetch(`${CONFIG.API_URL}/restaurants/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(restaurantData)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en RestaurantAPI.update:', error);
            return {
                success: false,
                error: error.message || 'Error al actualizar restaurante'
            };
        }
    },

    /**
     * Eliminar un restaurante (requiere autenticación)
     * @param {number} id - ID del restaurante
     * @returns {Promise} Respuesta de la API
     */
    async delete(id) {
        try {
            const token = await Auth.getToken();
            if (!token) throw new Error('No autenticado');

            const response = await fetch(`${CONFIG.API_URL}/restaurants/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en RestaurantAPI.delete:', error);
            return {
                success: false,
                error: error.message || 'Error al eliminar restaurante'
            };
        }
    }
};
