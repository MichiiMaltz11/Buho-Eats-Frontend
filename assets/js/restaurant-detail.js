/**
 * Gestión de detalles del restaurante
 * Carga dinámica de información desde la API
 */

const RestaurantDetail = {
    currentRestaurant: null,
    currentRating: 0,

    /**
     * Inicializar la página de detalles
     */
    async init() {
        // Obtener ID del restaurante de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const restaurantId = urlParams.get('id');

        if (!restaurantId) {
            this.showError('No se especificó un restaurante');
            setTimeout(() => {
                window.location.href = 'dashboard-user.html';
            }, 2000);
            return;
        }

        await this.loadRestaurant(restaurantId);
    },

    /**
     * Cargar datos del restaurante desde la API
     */
    async loadRestaurant(id) {
        try {
            const response = await API.get(`/restaurants/${id}`);

            if (response.success && response.data && response.data.restaurant) {
                this.currentRestaurant = response.data.restaurant;
                this.renderRestaurant();
                this.renderReviews();
                this.loadMenu(id);
            } else {
                this.showError('Restaurante no encontrado');
                setTimeout(() => {
                    window.location.href = 'dashboard-user.html';
                }, 2000);
            }
        } catch (error) {
            console.error('Error al cargar restaurante:', error);
            this.showError('Error al cargar el restaurante. Por favor intenta de nuevo.');
        }
    },

    /**
     * Renderizar información del restaurante
     */
    renderRestaurant() {
        const restaurant = this.currentRestaurant;

        // Título de la página
        document.title = `${restaurant.name} - Buho Eats`;

        // Imagen del restaurante
        const restaurantImage = document.getElementById('restaurantImage');
        if (restaurantImage) {
            restaurantImage.src = restaurant.image_url || '../assets/img/restaurant-placeholder.jpg';
            restaurantImage.alt = restaurant.name;
        }

        // Nombre
        const restaurantName = document.getElementById('restaurantName');
        if (restaurantName) {
            restaurantName.textContent = restaurant.name;
        }

        // Rating
        const restaurantRating = document.getElementById('restaurantRating');
        if (restaurantRating) {
            restaurantRating.textContent = restaurant.average_rating 
                ? parseFloat(restaurant.average_rating).toFixed(1) 
                : '0.0';
        }

        // Total de reseñas
        const totalReviews = document.getElementById('totalReviews');
        if (totalReviews) {
            totalReviews.textContent = restaurant.total_reviews || 0;
        }

        // Categoría
        const restaurantCategory = document.getElementById('restaurantCategory');
        if (restaurantCategory) {
            restaurantCategory.textContent = restaurant.cuisine_type || 'General';
        }

        // Email
        const restaurantEmail = document.getElementById('restaurantEmail');
        if (restaurantEmail) {
            restaurantEmail.textContent = restaurant.email || restaurant.owner_email || 'No disponible';
        }

        // Teléfono
        const restaurantPhone = document.getElementById('restaurantPhone');
        if (restaurantPhone) {
            restaurantPhone.textContent = restaurant.phone || 'No disponible';
        }

        // Horario
        const restaurantSchedule = document.getElementById('restaurantSchedule');
        if (restaurantSchedule) {
            restaurantSchedule.textContent = this.formatSchedule(restaurant.opening_hours);
        }

        // Dirección
        const restaurantAddress = document.getElementById('restaurantAddress');
        if (restaurantAddress) {
            restaurantAddress.textContent = restaurant.address || 'No disponible';
        }

        // Descripción (si existe en el layout)
        const restaurantDescription = document.getElementById('restaurantDescription');
        if (restaurantDescription) {
            restaurantDescription.textContent = restaurant.description || '';
        }

        // Rango de precios (si existe en el layout)
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.textContent = this.getPriceRangeSymbol(restaurant.price_range);
        }
    },

    /**
     * Convertir rango de precios a símbolos $
     */
    getPriceRangeSymbol(priceRange) {
        const ranges = {
            'low': '$',
            'medium': '$$',
            'high': '$$$',
            'luxury': '$$$$'
        };
        return ranges[priceRange] || '$$';
    },

    /**
     * Formatear horario desde JSON a string legible
     */
    formatSchedule(openingHours) {
        if (!openingHours) return 'Horario no disponible';
        
        try {
            // Intentar parsear como JSON
            const hours = JSON.parse(openingHours);
            
            // Formatear el JSON a un string legible
            return Object.entries(hours)
                .map(([days, time]) => `${days}: ${time}`)
                .join(' | ');
        } catch {
            // Si no es JSON, devolver tal cual (por si es un string simple)
            return openingHours;
        }
    },

    /**
     * Renderizar reseñas
     */
    renderReviews() {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;

        const reviews = this.currentRestaurant.recent_reviews || [];

        if (reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <p>Aún no hay reseñas para este restaurante.</p>
                    <p class="text-sm mt-2">¡Sé el primero en compartir tu experiencia!</p>
                </div>
            `;
            return;
        }

        reviewsList.innerHTML = reviews.map(review => `
            <div class="border-b border-gray-200 pb-6 last:border-b-0">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-semibold text-gray-800">${this.escapeHtml(review.first_name)} ${this.escapeHtml(review.last_name)}</h4>
                        <div class="flex items-center mt-1">
                            ${'<span class="text-yellow-400 text-sm">★</span>'.repeat(review.rating)}
                            ${'<span class="text-gray-300 text-sm">★</span>'.repeat(5 - review.rating)}
                        </div>
                    </div>
                    <span class="text-gray-400 text-xs">${this.formatDate(review.created_at)}</span>
                </div>
                <p class="text-gray-600 text-sm">${this.escapeHtml(review.comment)}</p>
            </div>
        `).join('');
    },

    /**
     * Formatear fecha
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        
        // Calcular diferencia en milisegundos
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffMinutes < 1) return 'Justo ahora';
        if (diffMinutes < 60) return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
        if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;
        if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
        if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
        return `Hace ${Math.floor(diffDays / 365)} años`;
    },

    /**
     * Escapar HTML para prevenir XSS
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Establecer rating del usuario
     */
    setRating(rating) {
        this.currentRating = rating;
        const stars = document.querySelectorAll('.star');
        const ratingText = document.getElementById('ratingText');

        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });

        const ratingLabels = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];
        if (ratingText) {
            ratingText.textContent = ratingLabels[rating] || 'Selecciona tu calificación';
        }
    },

    /**
     * Enviar reseña
     */
    async submitReview() {
        const comment = document.getElementById('reviewComment')?.value.trim();

        console.log('📝 Iniciando envío de reseña...');
        console.log('⭐ Rating actual:', this.currentRating);
        console.log('💬 Comentario:', comment);

        if (this.currentRating === 0) {
            showDialog({
                title: 'Calificación requerida',
                message: 'Por favor selecciona una calificación con las estrellas.',
                confirmText: 'Entendido',
                cancelText: 'Cerrar'
            });
            return;
        }

        if (!comment) {
            showDialog({
                title: 'Comentario requerido',
                message: 'Por favor escribe un comentario sobre tu experiencia.',
                confirmText: 'Entendido',
                cancelText: 'Cerrar'
            });
            return;
        }

        try {
            const reviewData = {
                restaurantId: this.currentRestaurant.id,
                rating: this.currentRating,
                comment: comment,
                visitDate: new Date().toISOString().split('T')[0]
            };

            console.log('📤 Enviando datos:', reviewData);

            const response = await API.post('/reviews', reviewData);

            console.log('📥 Respuesta recibida:', response);

            if (response.success) {
                showDialog({
                    title: '¡Reseña Publicada!',
                    message: 'Gracias por compartir tu experiencia. Tu reseña ha sido publicada.',
                    confirmText: 'Genial',
                    cancelText: 'Cerrar',
                    onConfirm: () => {
                        // Limpiar formulario
                        this.currentRating = 0;
                        this.setRating(0);
                        document.getElementById('reviewComment').value = '';
                        
                        // Recargar restaurante para mostrar nueva reseña
                        this.loadRestaurant(this.currentRestaurant.id);
                    }
                });
            } else {
                showDialog({
                    title: 'Error',
                    message: response.error || 'No se pudo publicar la reseña. Intenta de nuevo.',
                    confirmText: 'Entendido',
                    cancelText: 'Cerrar'
                });
            }
        } catch (error) {
            console.error('Error al enviar reseña:', error);
            showDialog({
                title: 'Error',
                message: 'Ocurrió un error al publicar tu reseña. Por favor intenta de nuevo.',
                confirmText: 'Entendido',
                cancelText: 'Cerrar'
            });
        }
    },

    /**
     * Cargar menú del restaurante
     */
    async loadMenu(restaurantId) {
        console.log('🍽️ Cargando menú para restaurante:', restaurantId);
        try {
            const response = await API.get(`/menu?restaurantId=${restaurantId}&availableOnly=true`);
            console.log('📋 Respuesta del menú:', response);
            
            if (response.success && response.data && response.data.length > 0) {
                console.log('✅ Menú tiene items:', response.data.length);
                this.renderMenu(response.data);
            } else {
                console.log('⚠️ Menú vacío o sin datos');
                this.showEmptyMenu();
            }
        } catch (error) {
            console.error('❌ Error al cargar menú:', error);
            this.showEmptyMenu();
        }
    },

    /**
     * Renderizar menú
     */
    renderMenu(menuItems) {
        const menuGrid = document.getElementById('menuGrid');
        if (!menuGrid) return;

        // Agrupar por categoría
        const categories = {
            'Entrada': [],
            'Plato Principal': [],
            'Postre': [],
            'Bebida': [],
            'Otro': []
        };

        menuItems.forEach(item => {
            if (categories[item.category]) {
                categories[item.category].push(item);
            } else {
                categories['Otro'].push(item);
            }
        });

        // Construir HTML
        let menuHTML = '';

        Object.entries(categories).forEach(([category, items]) => {
            if (items.length > 0) {
                menuHTML += `
                    <div class="col-span-full">
                        <h3 class="text-xl font-bold text-gray-800 mb-4 border-b-2 border-amber-500 pb-2">
                            ${category}
                        </h3>
                    </div>
                `;

                items.forEach(item => {
                    menuHTML += `
                        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            ${item.image_url ? `
                                <img src="${item.image_url}" 
                                     alt="${item.name}" 
                                     class="w-full h-48 object-cover"
                                     onerror="this.src='https://via.placeholder.com/400x300?text=Sin+Imagen'">
                            ` : `
                                <div class="w-full h-48 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                                    <svg class="w-20 h-20 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                </div>
                            `}
                            <div class="p-4">
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-bold text-lg text-gray-800">${item.name}</h4>
                                    <span class="text-amber-600 font-bold text-lg">$${item.price.toFixed(2)}</span>
                                </div>
                                ${item.description ? `
                                    <p class="text-gray-600 text-sm">${item.description}</p>
                                ` : ''}
                            </div>
                        </div>
                    `;
                });
            }
        });

        menuGrid.innerHTML = menuHTML;
    },

    /**
     * Mostrar mensaje de menú vacío
     */
    showEmptyMenu() {
        const menuGrid = document.getElementById('menuGrid');
        if (!menuGrid) return;

        menuGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                </svg>
                <p class="text-gray-500 text-lg">Este restaurante aún no ha publicado su menú</p>
            </div>
        `;
    },

    /**
     * Alternar favorito
     */
    async toggleFavorite() {
        try {
            const heartIcon = document.getElementById('heartIcon');
            const isFavorite = heartIcon?.classList.contains('text-red-500');

            if (isFavorite) {
                // Remover de favoritos
                const response = await API.delete(`/favorites/${this.currentRestaurant.id}`);
                if (response.success) {
                    heartIcon.classList.remove('text-red-500', 'fill-current');
                    heartIcon.classList.add('text-gray-400');
                    showDialog({
                        title: 'Removido de Favoritos',
                        message: 'El restaurante ha sido removido de tus favoritos.',
                        confirmText: 'Entendido',
                        cancelText: 'Cerrar'
                    });
                }
            } else {
                // Agregar a favoritos
                const response = await API.post('/favorites', { restaurantId: this.currentRestaurant.id });
                if (response.success) {
                    heartIcon.classList.remove('text-gray-400');
                    heartIcon.classList.add('text-red-500', 'fill-current');
                    showDialog({
                        title: '¡Agregado a Favoritos!',
                        message: 'El restaurante ha sido agregado a tus favoritos.',
                        confirmText: 'Genial',
                        cancelText: 'Cerrar'
                    });
                }
            }
        } catch (error) {
            console.error('Error al gestionar favorito:', error);
            showDialog({
                title: 'Error',
                message: 'No se pudo actualizar los favoritos. Intenta de nuevo.',
                confirmText: 'Entendido',
                cancelText: 'Cerrar'
            });
        }
    },

    /**
     * Verificar si es favorito
     */
    async checkIfFavorite() {
        try {
            const response = await API.get('/favorites');
            if (response.success && response.data && response.data.favorites) {
                const isFavorite = response.data.favorites.some(
                    fav => fav.restaurant_id === this.currentRestaurant.id
                );

                const heartIcon = document.getElementById('heartIcon');
                if (heartIcon && isFavorite) {
                    heartIcon.classList.remove('text-gray-400');
                    heartIcon.classList.add('text-red-500', 'fill-current');
                }
            }
        } catch (error) {
            console.error('Error al verificar favorito:', error);
        }
    },

    /**
     * Mostrar mensaje de error
     */
    showError(message) {
        showDialog({
            title: 'Error',
            message: message,
            confirmText: 'Volver al Inicio',
            cancelText: 'Cerrar'
        });
    }
};

// Hacer funciones globales para ser llamadas desde HTML
window.setRating = (rating) => RestaurantDetail.setRating(rating);
window.submitReview = () => RestaurantDetail.submitReview();
window.toggleFavorite = () => RestaurantDetail.toggleFavorite();

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar autenticación primero
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Cargar componentes (header, footer)
    if (typeof loadComponents === 'function') {
        await loadComponents();
    }

    // Inicializar detalles del restaurante
    await RestaurantDetail.init();

    // Verificar si es favorito
    await RestaurantDetail.checkIfFavorite();
});
