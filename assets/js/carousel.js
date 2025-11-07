/**
 * Carousel - Componente de carrusel para mostrar restaurantes destacados
 */

const Carousel = {
    currentSlide: 1,
    totalSlides: 0,
    interval: null,
    restaurants: [],

    /**
     * Inicializa el carrusel con restaurantes
     * @param {Array} restaurants - Array de restaurantes a mostrar (máximo 4)
     */
    async init(restaurants = null) {
        try {
            // Obtenerlos de la API
            if (!restaurants) {
                console.log('Cargando restaurantes para el carrusel...');
                const response = await RestaurantAPI.getAll({ limit: 4, sort: 'created_at', order: 'DESC' });
                console.log('Respuesta del API:', response);
                
                // Verificar la estructura de la respuesta
                if (response.success && response.data && response.data.restaurants) {
                    this.restaurants = response.data.restaurants.slice(0, 4);
                } else {
                    console.warn('Estructura de respuesta inesperada:', response);
                    this.restaurants = [];
                }
            } else {
                this.restaurants = restaurants.slice(0, 4); // Máximo 4
            }

            this.totalSlides = this.restaurants.length;

            console.log(`Total de slides del carrusel: ${this.totalSlides}`);

            if (this.totalSlides === 0) {
                console.warn('No hay restaurantes para mostrar en el carrusel');
                return;
            }

            this.renderSlides();
            this.renderIndicators();
            this.startAutoPlay();
        } catch (error) {
            console.error('Error inicializando carrusel:', error);
        }
    },

    /**
     * Renderiza los slides del carrusel
     */
    renderSlides() {
        const container = document.getElementById('carousel');
        if (!container) return;

        container.innerHTML = this.restaurants.map((restaurant, index) => {
            const slideNumber = index + 1;
            const isActive = slideNumber === 1;
            
            return `
                <div class="carousel-item absolute w-full h-full transition-opacity duration-500 ${isActive ? '' : 'opacity-0'}" data-slide="${slideNumber}">
                    <img 
                        src="${restaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop'}" 
                        alt="${restaurant.name}" 
                        class="w-full h-full object-cover"
                        onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop'"
                    >
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                        <h4 class="text-3xl font-bold text-white mb-2">${restaurant.name}</h4>
                        <p class="text-white/90 mb-3">${restaurant.description || 'Descubre este increíble restaurante'}</p>
                        <div class="flex items-center space-x-4">
                            <div class="flex items-center">
                                <span class="text-yellow-400 mr-1">⭐</span>
                                <span class="text-white font-semibold">${restaurant.average_rating || '0.0'}</span>
                            </div>
                            <span class="text-white/80">•</span>
                            <span class="text-white/80">${restaurant.cuisine_type || 'Variada'}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Renderiza los indicadores del carrusel
     */
    renderIndicators() {
        const container = document.getElementById('carouselIndicators');
        if (!container) return;

        container.innerHTML = Array.from({ length: this.totalSlides }, (_, index) => {
            const slideNumber = index + 1;
            const isActive = slideNumber === 1;
            
            return `
                <button 
                    onclick="Carousel.goToSlide(${slideNumber})" 
                    class="carousel-indicator w-3 h-3 rounded-full transition ${isActive ? 'bg-white' : 'bg-white/50'}" 
                    data-slide="${slideNumber}"
                ></button>
            `;
        }).join('');
    },

    /**
     * Va a un slide específico
     * @param {number} slideNumber - Número del slide (1-based)
     */
    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;

        const slides = document.querySelectorAll('.carousel-item');
        const indicators = document.querySelectorAll('.carousel-indicator');

        // Ocultar todos los slides
        slides.forEach(slide => slide.classList.add('opacity-0'));
        
        // Resetear todos los indicadores
        indicators.forEach(indicator => {
            indicator.classList.remove('bg-white');
            indicator.classList.add('bg-white/50');
        });

        // Mostrar el slide activo
        const activeSlide = document.querySelector(`.carousel-item[data-slide="${slideNumber}"]`);
        const activeIndicator = document.querySelector(`.carousel-indicator[data-slide="${slideNumber}"]`);

        if (activeSlide) activeSlide.classList.remove('opacity-0');
        if (activeIndicator) {
            activeIndicator.classList.remove('bg-white/50');
            activeIndicator.classList.add('bg-white');
        }

        this.currentSlide = slideNumber;
    },

    /**
     * Va al slide anterior
     */
    previous() {
        let newSlide = this.currentSlide - 1;
        if (newSlide < 1) newSlide = this.totalSlides;
        this.goToSlide(newSlide);
        this.resetAutoPlay();
    },

    /**
     * Va al siguiente slide
     */
    next() {
        let newSlide = this.currentSlide + 1;
        if (newSlide > this.totalSlides) newSlide = 1;
        this.goToSlide(newSlide);
        this.resetAutoPlay();
    },

    /**
     * Inicia el auto-play del carrusel
     */
    startAutoPlay() {
        this.interval = setInterval(() => {
            this.next();
        }, 5000); // Cambia cada 5 segundos
    },

    /**
     * Detiene el auto-play
     */
    stopAutoPlay() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },

    /**
     * Reinicia el auto-play
     */
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
};

// Exportar para uso global
window.Carousel = Carousel;
