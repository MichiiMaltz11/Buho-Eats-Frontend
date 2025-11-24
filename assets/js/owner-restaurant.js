/**
 * Owner Restaurant Management
 * Gestión del restaurante para el dueño
 */

let currentRestaurant = null;
let currentMenu = [];
let currentReviews = [];

// ==============================================
// UTILIDADES
// ==============================================

/**
 * Des-escapar HTML (convertir entidades HTML a caracteres normales)
 */
function unescapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent;
}

// ==============================================
// INICIALIZACIÓN
// ==============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar que sea owner
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const user = Auth.getUser();
    if (user.role !== 'owner') {
        Utils.showToast('Acceso denegado. Solo para owners.', 'error');
        setTimeout(() => window.location.href = 'dashboard-user.html', 2000);
        return;
    }

    // Cargar datos del restaurante
    await loadRestaurantData();
});

// ==============================================
// CARGAR DATOS
// ==============================================

async function loadRestaurantData() {
    try {
        const token = await Auth.getToken();
        const apiUrl = CONFIG.API_URL;

        // Obtener restaurante del owner
        const response = await fetch(`${apiUrl}/owner/restaurant`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('No se pudo cargar el restaurante');
        }

        const result = await response.json();
        
        if (result.success && result.data) {
            currentRestaurant = result.data;
            renderRestaurant();
            await loadMenu();
            await loadReviews();
        } else {
            throw new Error(result.error || 'Restaurante no encontrado');
        }

    } catch (error) {
        console.error('Error cargando restaurante:', error);
        Utils.showToast('Error al cargar tu restaurante', 'error');
    }
}

function renderRestaurant() {
    if (!currentRestaurant) return;

    // Información básica
    document.getElementById('restaurantName').textContent = currentRestaurant.name || 'Sin nombre';
    document.getElementById('restaurantDescription').textContent = currentRestaurant.description || 'Sin descripción';
    document.getElementById('restaurantCategory').textContent = currentRestaurant.cuisine_type || 'Sin categoría';
    document.getElementById('restaurantAddress').textContent = currentRestaurant.address || 'Sin dirección';
    document.getElementById('restaurantPhone').textContent = currentRestaurant.phone || 'Sin teléfono';
    document.getElementById('restaurantEmail').textContent = currentRestaurant.email || 'Sin email';
    document.getElementById('restaurantHours').textContent = currentRestaurant.opening_hours || 'Sin horarios';
    document.getElementById('restaurantRating').textContent = currentRestaurant.average_rating?.toFixed(1) || '0.0';
    document.getElementById('totalReviews').textContent = currentRestaurant.total_reviews || 0;

    // Banner image
    if (currentRestaurant.image_url) {
        let url = currentRestaurant.image_url;
        // Si la URL no empieza con http, prepéndele el host del backend
        if (!/^https?:/.test(url)) {
            url = CONFIG.API_URL.replace(/\/api.*/, '') + url;
        }
        document.getElementById('restaurantBanner').src = url;
    }
}

async function loadMenu() {
    try {
        const token = await Auth.getToken();
        const response = await fetch(`${CONFIG.API_URL}/owner/menu`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error cargando menú');

        const result = await response.json();
        currentMenu = result.success ? result.data : [];
        renderMenu();

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('menuContainer').innerHTML = '<p class="text-gray-500 text-center py-8">No se pudo cargar el menú</p>';
    }
}

function renderMenu() {
    const container = document.getElementById('menuContainer');
    
    if (currentMenu.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No tienes platillos aún. ¡Agrega el primero!</p>';
        return;
    }

    // Agrupar por categoría
    const categories = {
        'Entrada': [],
        'Plato Principal': [],
        'Postre': [],
        'Bebida': [],
        'Otro': []
    };

    currentMenu.forEach(item => {
        const cat = item.category || 'Otro';
        if (categories[cat]) {
            categories[cat].push(item);
        } else {
            categories['Otro'].push(item);
        }
    });

    // Renderizar HTML
    let html = '';
    
    Object.keys(categories).forEach(category => {
        const items = categories[category];
        if (items.length === 0) return;

        html += `
            <div class="mb-8">
                <h3 class="text-2xl font-bold text-primary mb-4">${category}s</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        `;

        items.forEach(item => {
            let imageUrl = item.image_url || '/assets/img/menu/placeholder.jpg';
            // Si la URL no empieza con http y es de uploads, prepéndele el host del backend
            if (imageUrl.startsWith('/uploads/')) {
                imageUrl = CONFIG.API_URL.replace(/\/api.*/, '') + imageUrl;
            }
            html += `
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div class="flex gap-4 mb-2">
                        <img src="${imageUrl}" alt="${item.name}" class="w-24 h-24 object-cover rounded-lg" onerror="this.src='/assets/img/menu/placeholder.jpg'">
                        
                        <div class="flex-1">
                            <h4 class="font-bold text-lg text-gray-800">${item.name}</h4>
                            <p class="text-sm text-gray-600 mb-2">${item.description || 'Sin descripción'}</p>
                            <p class="text-xl font-bold text-secondary">$${item.price}</p>
                        </div>
                        
                        <div class="flex flex-col gap-2">
                            <button onclick="editMenuItem(${item.id})" class="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button onclick="deleteMenuItem(${item.id})" class="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
    });

    container.innerHTML = html;
}

async function loadReviews() {
    try {
        if (!currentRestaurant || !currentRestaurant.id) {
            document.getElementById('reviewsContainer').innerHTML = '<p class="text-gray-500 text-center py-8">No hay reseñas disponibles</p>';
            return;
        }

        // El endpoint correcto es /api/reviews?restaurantId=X
        const response = await fetch(`${CONFIG.API_URL}/reviews?restaurantId=${currentRestaurant.id}`);
        
        if (!response.ok) {
            console.warn('No se pudieron cargar las reseñas:', response.status);
            currentReviews = [];
        } else {
            const result = await response.json();
            console.log('Reseñas recibidas:', result);
            // El backend devuelve { data: { reviews: [...], pagination: {...} } }
            currentReviews = result.success && result.data && result.data.reviews ? result.data.reviews : [];
        }
        
        renderReviews();

    } catch (error) {
        console.error('Error cargando reseñas:', error);
        currentReviews = [];
        renderReviews();
    }
}

function renderReviews() {
    const container = document.getElementById('reviewsContainer');
    
    if (currentReviews.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">Aún no hay reseñas</p>';
        return;
    }

    let html = '<div class="space-y-4">';
    
    currentReviews.forEach(review => {
        const stars = '⭐'.repeat(review.rating);
        const date = new Date(review.created_at).toLocaleDateString('es-MX');
        const userName = review.first_name ? `${review.first_name} ${review.last_name || ''}`.trim() : 'Usuario';
        // Si la reseña ya fue reportada, mostrar bandera roja rellena y deshabilitar botón
        const alreadyReported = !!review.already_reported;
        html += `
            <div class="border rounded-lg p-4 bg-gray-50">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <p class="font-semibold text-gray-800">${userName}</p>
                        <p class="text-sm text-gray-500">${date}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-yellow-400">${stars}</span>
                        <button ${alreadyReported ? 'disabled' : ''} onclick="${alreadyReported ? '' : `reportReview(${review.id})`}" class="p-2 ${alreadyReported ? 'text-red-700 cursor-not-allowed opacity-70' : 'text-red-600 hover:bg-red-50'} rounded transition" title="${alreadyReported ? 'Ya reportada' : 'Reportar reseña'}">
                            <svg class="w-5 h-5" fill="${alreadyReported ? 'currentColor' : 'none'}" stroke="${alreadyReported ? 'none' : 'currentColor'}" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                            </svg>
                        </button>
                    </div>
                </div>
                <p class="text-gray-700">${unescapeHtml(review.comment) || 'Sin comentario'}</p>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// ==============================================
// MODALES - INFORMACIÓN
// ==============================================

function openEditInfoModal() {
    if (!currentRestaurant) return;
    
    document.getElementById('editName').value = currentRestaurant.name || '';
    document.getElementById('editDescription').value = currentRestaurant.description || '';
    document.getElementById('editCuisineType').value = currentRestaurant.cuisine_type || '';
    document.getElementById('editAddress').value = currentRestaurant.address || '';
    document.getElementById('editPhone').value = currentRestaurant.phone || '';
    document.getElementById('editEmail').value = currentRestaurant.email || '';
    document.getElementById('editHours').value = currentRestaurant.opening_hours || '';
    
    document.getElementById('editInfoModal').classList.add('active');
}

function closeEditInfoModal() {
    document.getElementById('editInfoModal').classList.remove('active');
}

async function saveRestaurantInfo() {
    try {
        const data = {
            name: document.getElementById('editName').value.trim(),
            description: document.getElementById('editDescription').value.trim(),
            cuisine_type: document.getElementById('editCuisineType').value.trim(),
            address: document.getElementById('editAddress').value.trim(),
            phone: document.getElementById('editPhone').value.trim(),
            email: document.getElementById('editEmail').value.trim(),
            opening_hours: document.getElementById('editHours').value.trim()
        };

        if (!data.name || !data.address) {
            Utils.showToast('Nombre y dirección son obligatorios', 'error');
            return;
        }

        const token = await Auth.getToken();
        const response = await fetch(`${CONFIG.API_URL}/owner/restaurant`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            Utils.showToast('Información actualizada correctamente', 'success');
            closeEditInfoModal();
            await loadRestaurantData();
        } else {
            throw new Error(result.error || 'Error al actualizar');
        }

    } catch (error) {
        console.error('Error:', error);
        Utils.showToast('Error al guardar los cambios', 'error');
    }
}

// ==============================================
// MODALES - FOTO
// ==============================================

function openPhotoModal() {
    document.getElementById('photoModal').classList.add('active');
    document.getElementById('photoPreview').classList.add('hidden');
    document.getElementById('photoInput').value = '';
}

function closePhotoModal() {
    document.getElementById('photoModal').classList.remove('active');
}

function previewPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('photoPreviewImg').src = e.target.result;
        document.getElementById('photoPreview').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

async function uploadPhoto() {
    const input = document.getElementById('photoInput');
    const file = input.files[0];

    if (!file) {
        Utils.showToast('Selecciona una imagen', 'error');
        return;
    }

    try {
        // Convertir archivo a Base64
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        const token = await Auth.getToken();
        const response = await fetch(`${CONFIG.API_URL}/owner/restaurant/photo`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: base64 })
        });

        const result = await response.json();

        if (result.success) {
            Utils.showToast('Foto actualizada correctamente', 'success');
            closePhotoModal();
                // Actualizar el banner inmediatamente para evitar caché
                if (result.data && result.data.imageUrl) {
                    document.getElementById('restaurantBanner').src = result.data.imageUrl + '?v=' + Date.now();
                }
                await loadRestaurantData();
        } else {
            throw new Error(result.error || 'Error al subir foto');
        }

    } catch (error) {
        console.error('Error:', error);
        Utils.showToast('Error al subir la foto', 'error');
    }
}

// ==============================================
// MODALES - MENÚ
// ==============================================

function openAddMenuItemModal() {
    document.getElementById('menuItemModalTitle').textContent = 'Agregar Platillo';
    document.getElementById('menuItemId').value = '';
    document.getElementById('menuItemName').value = '';
    document.getElementById('menuItemDescription').value = '';
    document.getElementById('menuItemPrice').value = '';
    document.getElementById('menuItemCategory').value = 'Plato Principal';
    document.getElementById('menuItemImage').value = '';
    document.getElementById('menuItemImagePreview').classList.add('hidden');
    
    document.getElementById('menuItemModal').classList.add('active');
}

function editMenuItem(id) {
    const item = currentMenu.find(m => m.id === id);
    if (!item) return;

    document.getElementById('menuItemModalTitle').textContent = 'Editar Platillo';
    document.getElementById('menuItemId').value = item.id;
    document.getElementById('menuItemName').value = item.name;
    document.getElementById('menuItemDescription').value = item.description || '';
    document.getElementById('menuItemPrice').value = item.price;
    document.getElementById('menuItemCategory').value = item.category || 'Plato Principal';
    document.getElementById('menuItemImage').value = '';
    document.getElementById('menuItemImagePreview').classList.add('hidden');
    
    document.getElementById('menuItemModal').classList.add('active');
}

function closeMenuItemModal() {
    document.getElementById('menuItemModal').classList.remove('active');
}

function previewMenuItemPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('menuItemImagePreviewImg').src = e.target.result;
        document.getElementById('menuItemImagePreview').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

async function saveMenuItem() {
    try {
        const id = document.getElementById('menuItemId').value;
        const name = document.getElementById('menuItemName').value.trim();
        const description = document.getElementById('menuItemDescription').value.trim();
        const price = parseFloat(document.getElementById('menuItemPrice').value);
        const category = document.getElementById('menuItemCategory').value;
        const imageFile = document.getElementById('menuItemImage').files[0];

        if (!name || !price || price <= 0) {
            Utils.showToast('Nombre y precio válido son obligatorios', 'error');
            return;
        }

        const token = await Auth.getToken();
        const url = id ? `${CONFIG.API_URL}/owner/menu/${id}` : `${CONFIG.API_URL}/owner/menu`;
        const method = id ? 'PUT' : 'POST';

        // Construir datos
        const data = { name, description, price, category };
        
        // Si hay imagen, convertir a Base64
        if (imageFile) {
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(imageFile);
            });
            data.image = base64;
        }

        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            Utils.showToast(id ? 'Platillo actualizado' : 'Platillo agregado', 'success');
            closeMenuItemModal();
            await loadMenu();
        } else {
            throw new Error(result.error || 'Error al guardar');
        }

    } catch (error) {
        console.error('Error:', error);
        Utils.showToast('Error al guardar el platillo', 'error');
    }
}

async function deleteMenuItem(id) {
    const confirmed = await showConfirmDialog(
        'Eliminar Platillo',
        '¿Estás seguro de eliminar este platillo? Esta acción no se puede deshacer.'
    );
    
    if (!confirmed) return;

    try {
        const token = await Auth.getToken();
        const response = await fetch(`${CONFIG.API_URL}/owner/menu/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (result.success) {
            Utils.showToast('Platillo eliminado', 'success');
            await loadMenu();
        } else {
            throw new Error(result.error || 'Error al eliminar');
        }

    } catch (error) {
        console.error('Error:', error);
        Utils.showToast('Error al eliminar el platillo', 'error');
    }
}

// ==============================================
// REPORTAR RESEÑAS
// ==============================================

let currentReportReviewId = null;

async function reportReview(reviewId) {
    currentReportReviewId = reviewId;
    document.getElementById('reportModal').classList.add('active');
}

async function closeReportModal(confirm) {
    document.getElementById('reportModal').classList.remove('active');
    
    if (!confirm || !currentReportReviewId) {
        currentReportReviewId = null;
        return;
    }

    const selectedReason = document.querySelector('input[name="reportReason"]:checked')?.value || 'otro';

    try {
        const token = await Auth.getToken();
        const response = await fetch(`${CONFIG.API_URL}/owner/reviews/${currentReportReviewId}/report`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reason: selectedReason,
                description: 'Reportado por el owner'
            })
        });

        const result = await response.json();

        if (result.success) {
            Utils.showToast('Reseña reportada al admin', 'success');
            // Recargar reseñas para actualizar el estado de la bandera
            await loadReviews();
        } else {
            // Mostrar el error específico del backend
            Utils.showToast(result.error || 'Error al reportar', 'error');
        }

    } catch (error) {
        console.error('Error:', error);
        Utils.showToast('Error al reportar la reseña', 'error');
    }
    
    currentReportReviewId = null;
}

// ==============================================
// MODAL DE CONFIRMACIÓN GENÉRICO
// ==============================================

let confirmResolve = null;

function showConfirmDialog(title, message) {
    return new Promise((resolve) => {
        confirmResolve = resolve;
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        document.getElementById('confirmModal').classList.add('active');
    });
}

function closeConfirmModal(confirmed) {
    document.getElementById('confirmModal').classList.remove('active');
    if (confirmResolve) {
        confirmResolve(confirmed);
        confirmResolve = null;
    }
}

// Hacer funciones globales
window.openEditInfoModal = openEditInfoModal;
window.closeEditInfoModal = closeEditInfoModal;
window.saveRestaurantInfo = saveRestaurantInfo;
window.openPhotoModal = openPhotoModal;
window.closePhotoModal = closePhotoModal;
window.previewPhoto = previewPhoto;
window.uploadPhoto = uploadPhoto;
window.previewMenuItemPhoto = previewMenuItemPhoto;
window.openAddMenuItemModal = openAddMenuItemModal;
window.editMenuItem = editMenuItem;
window.closeMenuItemModal = closeMenuItemModal;
window.saveMenuItem = saveMenuItem;
window.deleteMenuItem = deleteMenuItem;
window.reportReview = reportReview;
window.closeConfirmModal = closeConfirmModal;
window.closeReportModal = closeReportModal;
