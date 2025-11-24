/**
 * Favorites.js - Gestión de restaurantes favoritos
 */

const apiUrl = typeof CONFIG !== 'undefined' ? CONFIG.API_URL : 'http://localhost:3000/api';

/**
 * Cargar restaurantes favoritos del usuario
 */
async function loadFavorites() {
    // Verificar autenticación
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Obtener token desencriptado
    const token = await Auth.getToken();
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/favorites`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            localStorage.clear();
            window.location.href = 'login.html';
            return;
        }

        const data = await response.json();

        if (data.success) {
            displayFavorites(data.data);
        } else {
            console.error('Error al cargar favoritos:', data.error);
            showEmptyState();
        }
    } catch (error) {
        console.error('Error al cargar favoritos:', error);
        showEmptyState();
    }
}

/**
 * Mostrar restaurantes favoritos en el grid
 */
function displayFavorites(favorites) {
    const grid = document.getElementById('favoritesGrid');
    const emptyState = document.getElementById('emptyState');

    if (!favorites || favorites.length === 0) {
        showEmptyState();
        return;
    }

    // Ocultar estado vacío y mostrar grid
    emptyState.style.display = 'none';
    grid.style.display = 'grid';
    grid.innerHTML = '';

    // Crear tarjetas de restaurantes
    favorites.forEach(restaurant => {
        const card = createRestaurantCard(restaurant);
        grid.appendChild(card);
    });
}

/**
 * Crear tarjeta de restaurante favorito
 */
function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'bg-white backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2';

    // Función auxiliar para URLs de imágenes
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return '../assets/img/default-restaurant.jpg';
        if (imageUrl.match(/^https?:\/\//)) return imageUrl;
        if (imageUrl.startsWith('/uploads/')) {
            return CONFIG.API_URL.replace(/\/api.*/, '') + imageUrl;
        }
        return imageUrl;
    };

    const imageUrl = getImageUrl(restaurant.image_url);
    const rating = restaurant.average_rating || 0;
    const totalReviews = restaurant.total_reviews || 0;

    card.innerHTML = `
        <div class="relative">
            <img src="${imageUrl}" 
                 alt="${restaurant.name}" 
                 class="w-full h-48 object-cover"
                 onerror="this.src='../assets/img/default-restaurant.jpg'">
            <div class="absolute top-4 right-4">
                <button 
                    onclick="removeFavorite(${restaurant.id}, '${restaurant.name}')"
                    class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition transform hover:scale-110"
                    title="Eliminar de favoritos">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div class="flex items-center gap-1 text-yellow-400">
                    ${generateStars(rating)}
                    <span class="ml-2 text-white text-sm">${rating.toFixed(1)} (${totalReviews} reseñas)</span>
                </div>
            </div>
        </div>
        
        <div class="p-6">
            <h3 class="text-xl font-bold text-black mb-2">${restaurant.name}</h3>
            <p class="text-gray-800 text-sm mb-4 line-clamp-2">${restaurant.description || 'Sin descripción'}</p>
            
            <div class="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z"/>
                    </svg>
                    ${restaurant.cuisine_type || 'Comida'}
                </span>
            </div>
            
            ${restaurant.address ? `
                <p class="text-gray-600 text-sm mb-4 flex items-start gap-2">
                    <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                    </svg>
                    <span class="line-clamp-2">${restaurant.address}</span>
                </p>
            ` : ''}
            
            <a href="restaurant-detail.html?id=${restaurant.id}" 
               class="block w-full bg-secondary hover:bg-secondary/90 text-white text-center font-bold py-3 px-6 rounded-lg transition transform hover:scale-105">
                Ver Detalles
            </a>
        </div>
    `;

    return card;
}

/**
 * Generar estrellas de rating
 */
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Estrellas llenas
    for (let i = 0; i < fullStars; i++) {
        stars += `
            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
        `;
    }
    
    // Media estrella
    if (hasHalfStar) {
        stars += `
            <svg class="w-5 h-5" viewBox="0 0 20 20">
                <defs>
                    <linearGradient id="half-star">
                        <stop offset="50%" stop-color="currentColor"/>
                        <stop offset="50%" stop-color="transparent"/>
                    </linearGradient>
                </defs>
                <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
        `;
    }
    
    // Estrellas vacías
    for (let i = 0; i < emptyStars; i++) {
        stars += `
            <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
        `;
    }
    
    return stars;
}

/**
 * Mostrar estado vacío (sin favoritos)
 */
function showEmptyState() {
    const grid = document.getElementById('favoritesGrid');
    const emptyState = document.getElementById('emptyState');
    
    grid.style.display = 'none';
    emptyState.style.display = 'block';
}

/**
 * Eliminar restaurante de favoritos
 */
async function removeFavorite(restaurantId, restaurantName) {
    // Mostrar confirmación con modal
    showDialog({
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de eliminar "${restaurantName}" de tus favoritos?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        onConfirm: async () => {
            await executeRemoveFavorite(restaurantId);
        }
    });
}

/**
 * Ejecutar eliminación de favorito
 */
async function executeRemoveFavorite(restaurantId) {
    // Verificar autenticación
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Obtener token desencriptado
    const token = await Auth.getToken();
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/favorites`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ restaurantId })
        });

        const data = await response.json();

        if (data.success) {
            // Recargar favoritos
            loadFavorites();
            
            // Mostrar notificación
            Utils.showToast('Eliminado de favoritos', 'info');
        } else {
            console.error('Error al eliminar favorito:', data.error);
            Utils.showToast(data.error || 'Error al eliminar de favoritos', 'error');
        }
    } catch (error) {
        console.error('Error al eliminar favorito:', error);
        Utils.showToast('Error al eliminar de favoritos', 'error');
    }
}

// Hacer función global para que pueda ser llamada desde el HTML
window.removeFavorite = removeFavorite;

// Cargar favoritos cuando carga la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFavorites);
} else {
    // Si el DOM ya está listo, esperar un momento para que todos los scripts se carguen
    setTimeout(loadFavorites, 100);
}
