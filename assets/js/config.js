/**
 * Configuración de la aplicación
 */
const CONFIG = {

    /** URL del backend */
    API_URL: "http://localhost:3000/api",

    /** URL base del servidor (para imágenes y archivos) */
    SERVER_URL: "http://localhost:3000",

    /** Endpoints principales */
    ENDPOINTS: {

        /** Autenticación */
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
        VERIFY: "/auth/verify",

        /** Usuarios */
        USER_PROFILE: "/users/profile",
        USER_UPDATE: "/users/update",
        USER_PHOTO: "/users/photo",

        /** Restaurantes (público y user) */
        RESTAURANTS: "/restaurants",
        RESTAURANT_BY_ID: "/restaurants/",

        /** OWNER  */
        OWNER_GET_RESTAURANT: "/owner/restaurant",
        OWNER_UPDATE_RESTAURANT: "/owner/restaurant",       // PUT
        OWNER_UPDATE_PHOTO: "/owner/restaurant/photo",      // POST multipart
        OWNER_GET_MENU: "/owner/menu",
        OWNER_ADD_MENU_ITEM: "/owner/menu",
        OWNER_UPDATE_MENU_ITEM: "/owner/menu/",             // + ID
        OWNER_DELETE_MENU_ITEM: "/owner/menu/",             // + ID
        OWNER_REPORT_REVIEW: "/owner/reviews/",             // + reviewId + "/report"
        OWNER_STATS: "/owner/stats",

        /** Reseñas para user */
        REVIEWS: "/reviews",
    },

    /** LocalStorage */
    STORAGE_KEYS: {
        TOKEN: "auth_token",
        USER: "user_data",
    },

    /** Expiración de sesión (minutos) */
    SESSION_TIMEOUT: 30,
};
