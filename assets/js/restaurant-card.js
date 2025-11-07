/**
 * Componente de Card de Restaurante
 * Buho Eats - Card reutilizable para mostrar restaurantes
 */

/**
 * Renderiza una card de restaurante
 * @param {Object} restaurant - Datos del restaurante
 * @param {number} restaurant.id - ID del restaurante
 * @param {string} restaurant.name - Nombre del restaurante
 * @param {string} restaurant.category - Categoría del restaurante
 * @param {number} restaurant.rating - Calificación (1-5)
 * @param {string} restaurant.image - URL de la imagen
 * @param {number} restaurant.reviews - Cantidad de reseñas
 * @param {boolean} restaurant.isFavorite - Si está en favoritos (opcional)
 * @returns {string} HTML de la card
 */
function renderRestaurantCard(restaurant) {
    const heartIcon = restaurant.isFavorite 
        ? `<svg class="w-6 h-6 text-danger" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>`
        : `<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>`;

    return `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 relative">
            <!-- Botón de favorito -->
            <button 
                onclick="toggleRestaurantFavorite(${restaurant.id}, event)"
                class="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all"
                title="${restaurant.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
            >
                ${heartIcon}
            </button>

            <!-- Imagen del restaurante -->
            <div class="h-48 overflow-hidden cursor-pointer" onclick="goToRestaurant(${restaurant.id})">
                <img src="${restaurant.image}" alt="${restaurant.name}" class="w-full h-full object-cover">
            </div>
            
            <!-- Información del restaurante -->
            <div class="p-5 cursor-pointer" onclick="goToRestaurant(${restaurant.id})">
                <h4 class="text-xl font-bold text-primary mb-2">${restaurant.name}</h4>
                <p class="text-gray-600 text-sm mb-3">${restaurant.category}</p>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-1">
                        <span class="text-yellow-400">⭐</span>
                        <span class="font-semibold text-gray-800">${restaurant.rating}</span>
                        <span class="text-gray-500 text-sm">(${restaurant.reviews})</span>
                    </div>
                    
                    <button class="text-secondary hover:text-secondary/80 transition font-semibold text-sm">
                        Ver más →
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderiza múltiples cards de restaurantes en un contenedor
 * @param {Array} restaurants - Array de restaurantes
 * @param {string} containerId - ID del contenedor donde renderizar
 */
function renderRestaurantCards(restaurants, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return;
    }
    
    if (restaurants.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-6xl mb-4">🍽️</div>
                <h3 class="text-2xl font-bold text-gray-600 mb-2">No hay restaurantes</h3>
                <p class="text-gray-500">No se encontraron restaurantes en esta sección.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = restaurants.map(restaurant => renderRestaurantCard(restaurant)).join('');
}

/**
 * Navega a la página de detalles del restaurante
 * @param {number} id - ID del restaurante
 */
function goToRestaurant(id) {
    window.location.href = `restaurant-detail.html?id=${id}`;
}

/**
 * Alterna el estado de favorito de un restaurante
 * @param {number} id - ID del restaurante
 * @param {Event} event - Evento del click
 */
async function toggleRestaurantFavorite(id, event) {
    // Prevenir que se navegue al detalle
    event.stopPropagation();
    
    // Buscar el restaurante en el array
    const restaurant = window.restaurants ? window.restaurants.find(r => r.id === id) : null;
    
    if (!restaurant) {
        console.error(`Restaurant with id ${id} not found`);
        return;
    }

    // Verificar autenticación
    if (!Auth.isAuthenticated()) {
        if (typeof showDialog === 'function') {
            showDialog({
                title: 'Iniciar Sesión',
                message: 'Debes iniciar sesión para agregar favoritos.',
                confirmText: 'Ir a Login',
                cancelText: 'Cancelar',
                onConfirm: function() {
                    window.location.href = 'login.html';
                }
            });
        }
        return;
    }

    // Obtener token desencriptado
    const token = await Auth.getToken();
    
    if (!token) {
        if (typeof showDialog === 'function') {
            showDialog({
                title: 'Sesión Expirada',
                message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                confirmText: 'Ir a Login',
                cancelText: 'Cancelar',
                onConfirm: function() {
                    window.location.href = 'login.html';
                }
            });
        }
        return;
    }
    
    const apiUrl = typeof CONFIG !== 'undefined' ? CONFIG.API_URL : 'http://localhost:3000/api';
    const wasFavorite = restaurant.isFavorite;
    
    try {
        // Cambiar estado localmente (optimistic update)
        restaurant.isFavorite = !restaurant.isFavorite;
        
        // Actualizar botón inmediatamente
        const heartBtn = event.target.closest('button');
        if (heartBtn) {
            const heartIcon = heartBtn.querySelector('svg path');
            if (restaurant.isFavorite) {
                heartBtn.classList.remove('text-gray-400');
                heartBtn.classList.add('text-red-500');
                if (heartIcon) {
                    heartIcon.setAttribute('fill', 'currentColor');
                }
            } else {
                heartBtn.classList.remove('text-red-500');
                heartBtn.classList.add('text-gray-400');
                if (heartIcon) {
                    heartIcon.setAttribute('fill', 'none');
                }
            }
        }
        
        // Llamar al API
        if (restaurant.isFavorite) {
            // Agregar a favoritos
            const response = await fetch(`${apiUrl}/favorites`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ restaurantId: id })
            });

            const data = await response.json();

            if (!data.success) {
                // Revertir si falla
                restaurant.isFavorite = wasFavorite;
                throw new Error(data.error || 'Error al agregar favorito');
            }

            // Mostrar notificación de éxito
            if (typeof showDialog === 'function') {
                showDialog({
                    title: '¡Agregado a Favoritos!',
                    message: `${restaurant.name} ha sido agregado a tus favoritos.`,
                    confirmText: 'Genial',
                    cancelText: 'Ver Favoritos',
                    onCancel: function() {
                        window.location.href = 'favorites.html';
                    }
                });
            }
        } else {
            // Quitar de favoritos
            const response = await fetch(`${apiUrl}/favorites`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ restaurantId: id })
            });

            const data = await response.json();

            if (!data.success) {
                // Revertir si falla
                restaurant.isFavorite = wasFavorite;
                throw new Error(data.error || 'Error al eliminar favorito');
            }

            // Si estamos en la página de favoritos, recargar
            if (window.location.pathname.includes('favorites.html')) {
                if (typeof loadFavorites === 'function') {
                    loadFavorites();
                }
            }
        }
        
        // Disparar evento personalizado para notificar cambios
        window.dispatchEvent(new CustomEvent('favoritesChanged', { 
            detail: { 
                restaurantId: id, 
                isFavorite: restaurant.isFavorite 
            } 
        }));
        
    } catch (error) {
        console.error('Error al actualizar favorito:', error);
        
        // Revertir estado
        restaurant.isFavorite = wasFavorite;
        
        // Revertir UI
        const heartBtn = event.target.closest('button');
        if (heartBtn) {
            const heartIcon = heartBtn.querySelector('svg path');
            if (wasFavorite) {
                heartBtn.classList.remove('text-gray-400');
                heartBtn.classList.add('text-red-500');
                if (heartIcon) {
                    heartIcon.setAttribute('fill', 'currentColor');
                }
            } else {
                heartBtn.classList.remove('text-red-500');
                heartBtn.classList.add('text-gray-400');
                if (heartIcon) {
                    heartIcon.setAttribute('fill', 'none');
                }
            }
        }
        
        if (typeof showDialog === 'function') {
            showDialog({
                title: 'Error',
                message: error.message || 'No se pudo actualizar el favorito',
                confirmText: 'OK'
            });
        }
    }
}


// Función global para alternar favoritos
window.toggleRestaurantFavorite = toggleRestaurantFavorite;
