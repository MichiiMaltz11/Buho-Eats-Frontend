/**
 * Módulo para manejar peticiones al API
 * Incluye: manejo de token, JSON, multipart y errores del backend
 */

const API = {

    /**
     * Método general para hacer peticiones
     */
    async request(endpoint, options = {}) {
        const url = `${CONFIG.API_URL}${endpoint}`;

        const token = await Auth.getToken();

        // Construir headers
        const headers = options.headers || {};

        // Si NO es multipart, agregar JSON
        if (!options.isMultipart) {
            headers["Content-Type"] = "application/json";
        }

        // Agregar token si existe
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const fetchOptions = {
            method: options.method || "GET",
            headers,
        };

        // Body JSON
        if (options.body && !options.isMultipart) {
            fetchOptions.body = JSON.stringify(options.body);
        }

        // Body multipart (FormData)
        if (options.body && options.isMultipart) {
            fetchOptions.body = options.body;
        }

        try {
            const response = await fetch(url, fetchOptions);
            const result = await response.json().catch(() => null);

            if (!response.ok) {
                throw {
                    status: response.status,
                    error: result?.error || "Error de servidor"
                };
            }

            return result;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    },

    /** Métodos HTTP helpers */
    get(endpoint) {
        return this.request(endpoint, { method: "GET" });
    },

    post(endpoint, body) {
        return this.request(endpoint, { method: "POST", body });
    },

    put(endpoint, body) {
        return this.request(endpoint, { method: "PUT", body });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: "DELETE" });
    },

    /**
     * POST especial para enviar imágenes del Owner
     */
    upload(endpoint, formData) {
        return this.request(endpoint, {
            method: "POST",
            body: formData,
            isMultipart: true
        });
    }
};
