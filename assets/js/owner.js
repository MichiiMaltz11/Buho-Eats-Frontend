/**
 * OWNER MODULE – Maneja todo lo relacionado al propietario
 * 
 */

const Owner = {

    /** Obtiene el token real (desencriptado) */
    async getToken() {
        return await Auth.getToken();
    },

    /** ======================== GET RESTAURANT ======================== */
    async getMyRestaurant() {
        try {
            const token = await this.getToken();
            if (!token) return null;

            const res = await API.get(CONFIG.ENDPOINTS.OWNER_GET_RESTAURANT, token);

            if (!res.success) return null;

            return res.data;

        } catch (err) {
            console.error("❌ Error getMyRestaurant:", err);
            return null;
        }
    },

    /** ======================== UPDATE RESTAURANT ======================== */
    async updateRestaurantInfo(payload) {
        try {
            const token = await this.getToken();
            if (!token) throw new Error("Token no disponible");

            const res = await API.put(CONFIG.ENDPOINTS.OWNER_UPDATE_RESTAURANT, payload, token);

            return res;

        } catch (err) {
            console.error("❌ Error updateRestaurantInfo:", err);
            return { success: false, error: err.message };
        }
    },

    /** ======================== UPLOAD PHOTO ======================== */
    async uploadRestaurantPhoto(file) {
        try {
            const token = await this.getToken();
            if (!token) throw new Error("Token no disponible");

            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.OWNER_UPDATE_PHOTO}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData
            });

            return await res.json();

        } catch (err) {
            console.error("❌ Error uploadRestaurantPhoto:", err);
            return { success: false, error: err.message };
        }
    },

    /** ======================== MENU ======================== */
    async getMenu() {
        try {
            const token = await this.getToken();
            if (!token) return [];

            const res = await API.get(CONFIG.ENDPOINTS.OWNER_GET_MENU, token);
            return res.success ? res.data : [];

        } catch (err) {
            console.error("❌ Error getMenu:", err);
            return [];
        }
    },

    async addMenuItem(item) {
        try {
            const token = await this.getToken();
            if (!token) throw new Error("Token no disponible");

            const res = await API.post(CONFIG.ENDPOINTS.OWNER_ADD_MENU_ITEM, item, token);
            return res;

        } catch (err) {
            console.error("❌ Error addMenuItem:", err);
            return { success: false, error: err.message };
        }
    },

    async updateMenuItem(id, item) {
        try {
            const token = await this.getToken();
            if (!token) throw new Error("Token no disponible");

            const url = CONFIG.ENDPOINTS.OWNER_UPDATE_MENU_ITEM + id;
            const res = await API.put(url, item, token);

            return res;

        } catch (err) {
            console.error("❌ Error updateMenuItem:", err);
            return { success: false, error: err.message };
        }
    },

    async deleteMenuItem(id) {
        try {
            const token = await this.getToken();
            if (!token) throw new Error("Token no disponible");

            const url = CONFIG.ENDPOINTS.OWNER_DELETE_MENU_ITEM + id;
            const res = await API.delete(url, token);

            return res;

        } catch (err) {
            console.error("❌ Error deleteMenuItem:", err);
            return { success: false, error: err.message };
        }
    },

    /** ======================== REPORT REVIEW ======================== */
    async reportReview(reviewId, reason, description = "") {
        try {
            const token = await this.getToken();
            if (!token) throw new Error("Token no disponible");

            const url = `${CONFIG.ENDPOINTS.OWNER_REPORT_REVIEW}${reviewId}/report`;
            const res = await API.post(url, { reason, description }, token);

            return res;

        } catch (err) {
            console.error("❌ Error reportReview:", err);
            return { success: false, error: err.message };
        }
    },

    /** ======================== STATS ======================== */
    async loadStats() {
        try {
            const token = await this.getToken();
            if (!token) return null;

            const res = await API.get(CONFIG.ENDPOINTS.OWNER_STATS, token);
            return res.success ? res.data : null;

        } catch (err) {
            console.error("❌ Error loadStats:", err);
            return null;
        }
    }
};

