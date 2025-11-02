/**
 * Restaurant API Module
 * Maneja todas las peticiones relacionadas con restaurantes
 */

class RestaurantAPI {
    /**
     * Obtener todos los restaurantes con filtros opcionales
     * @param {Object} filters - Filtros de búsqueda
     * @param {string} filters.search - Búsqueda por nombre
     * @param {string} filters.cuisine - Tipo de cocina
     * @param {number} filters.minRating - Rating mínimo
     * @param {number} filters.page - Número de página
     * @param {number} filters.limit - Resultados por página
     * @returns {Promise<Object>} Lista de restaurantes
     */
    static async getAll(filters = {}) {
        const params = new URLSearchParams();
        
        if (filters.search) params.append('search', filters.search);
        if (filters.cuisine) params.append('cuisine', filters.cuisine);
        if (filters.minRating) params.append('minRating', filters.minRating);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        const queryString = params.toString();
        const url = `${CONFIG.API_URL}${CONFIG.ENDPOINTS.RESTAURANTS}${queryString ? '?' + queryString : ''}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('Error al obtener restaurantes:', error);
            throw error;
        }
    }

    /**
     * Obtener un restaurante por su ID
     * @param {number} id - ID del restaurante
     * @returns {Promise<Object>} Datos del restaurante
     */
    static async getById(id) {
        try {
            const response = await fetch(
                `${CONFIG.API_URL}${CONFIG.ENDPOINTS.RESTAURANT_BY_ID}${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`Error al obtener restaurante ${id}:`, error);
            throw error;
        }
    }

    /**
     * Crear un nuevo restaurante (requiere autenticación de owner/admin)
     * @param {Object} restaurantData - Datos del restaurante
     * @returns {Promise<Object>} Restaurante creado
     */
    static async create(restaurantData) {
        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
        
        if (!token) {
            throw new Error('No estás autenticado');
        }

        try {
            const response = await fetch(
                `${CONFIG.API_URL}${CONFIG.ENDPOINTS.RESTAURANTS}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(restaurantData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('Error al crear restaurante:', error);
            throw error;
        }
    }

    /**
     * Actualizar un restaurante existente (requiere autenticación de owner/admin)
     * @param {number} id - ID del restaurante
     * @param {Object} restaurantData - Datos actualizados
     * @returns {Promise<Object>} Restaurante actualizado
     */
    static async update(id, restaurantData) {
        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
        
        if (!token) {
            throw new Error('No estás autenticado');
        }

        try {
            const response = await fetch(
                `${CONFIG.API_URL}${CONFIG.ENDPOINTS.RESTAURANT_BY_ID}${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(restaurantData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`Error al actualizar restaurante ${id}:`, error);
            throw error;
        }
    }

    /**
     * Eliminar un restaurante (soft delete, requiere autenticación de owner/admin)
     * @param {number} id - ID del restaurante
     * @returns {Promise<Object>} Confirmación de eliminación
     */
    static async delete(id) {
        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
        
        if (!token) {
            throw new Error('No estás autenticado');
        }

        try {
            const response = await fetch(
                `${CONFIG.API_URL}${CONFIG.ENDPOINTS.RESTAURANT_BY_ID}${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`Error al eliminar restaurante ${id}:`, error);
            throw error;
        }
    }

    /**
     * Obtener restaurantes destacados (top rated)
     * @param {number} limit - Cantidad de restaurantes a obtener
     * @returns {Promise<Object>} Lista de restaurantes destacados
     */
    static async getFeatured(limit = 6) {
        return this.getAll({ minRating: 4.5, limit });
    }

    /**
     * Buscar restaurantes por cocina
     * @param {string} cuisine - Tipo de cocina
     * @param {number} limit - Límite de resultados
     * @returns {Promise<Object>} Lista de restaurantes
     */
    static async getByCuisine(cuisine, limit = 10) {
        return this.getAll({ cuisine, limit });
    }
}
