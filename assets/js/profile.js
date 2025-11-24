/**
 * Profile Page JavaScript
 * Maneja la carga y edición del perfil del usuario
 */

// Variable global para almacenar la foto temporal
let temporaryPhoto = null;

/**
 * Obtener el token de autenticación desencriptado
 */
async function getAuthToken() {
    // Usar Auth.getToken() que desencripta el token automáticamente
    return await Auth.getToken();
}

/**
 * Wrapper para showDialog que soporta promesas
 */
function showDialogPromise(title, message, needsConfirmation = false) {
    return new Promise((resolve) => {
        showDialog({
            title: title,
            message: message,
            confirmText: 'Aceptar',
            cancelText: 'Cancelar',
            onConfirm: () => resolve(true),
            onCancel: () => resolve(false)
        });
        
        // Si no necesita confirmación, auto-resolver en true al hacer click en aceptar
        if (!needsConfirmation) {
            // Ya está manejado por el onConfirm
        }
    });
}

/**
 * Cargar información del perfil al cargar la página
 */
async function loadProfile() {
    try {
        const token = await getAuthToken();
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // Verificar que API_URL esté definido
        const apiUrl = typeof CONFIG !== 'undefined' ? CONFIG.API_URL : 'http://localhost:3000/api';
        const endpoint = `${apiUrl}/users/profile`;

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success && result.data) {
            const user = result.data;

            // Rellenar campos del formulario
            document.getElementById('firstName').value = user.firstName || '';
            document.getElementById('lastName').value = user.lastName || '';
            document.getElementById('email').value = user.email || '';

            // Actualizar inicial en el fallback
            const firstNameValue = user.firstName || 'U';
            const initial = firstNameValue.charAt(0).toUpperCase();
            document.getElementById('profileInitial').textContent = initial;

            // Actualizar foto de perfil
            const photoImg = document.getElementById('profilePhotoPreview');
            const photoFallback = document.getElementById('profilePhotoFallback');
            
            if (user.profilePhoto) {
                photoImg.src = user.profilePhoto;
                photoImg.style.display = 'block';
                photoFallback.style.display = 'none';
            } else {
                photoImg.style.display = 'none';
                photoFallback.style.display = 'flex';
            }
        } else {
            showDialog({
                title: 'Error',
                message: result.error || 'No se pudo cargar el perfil',
                confirmText: 'Entendido'
            });
        }

    } catch (error) {
        console.error('Error al cargar perfil:', error);
        showDialog({
            title: 'Error',
            message: 'Error al cargar la información del perfil',
            confirmText: 'Entendido'
        });
    }
}

/**
 * Guardar cambios del perfil
 */
async function saveProfile(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validaciones básicas
    if (!firstName || !lastName || !email) {
        showDialog({
            title: 'Error',
            message: 'Por favor completa todos los campos obligatorios',
            confirmText: 'Entendido'
        });
        return;
    }

    // Validar nombre y apellido (mínimo 2 caracteres, solo letras y espacios)
    if (firstName.length < 2 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(firstName)) {
        showDialog({
            title: 'Error',
            message: 'El nombre debe tener al menos 2 caracteres y solo puede contener letras',
            confirmText: 'Entendido'
        });
        return;
    }

    if (lastName.length < 2 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(lastName)) {
        showDialog({
            title: 'Error',
            message: 'El apellido debe tener al menos 2 caracteres y solo puede contener letras',
            confirmText: 'Entendido'
        });
        return;
    }

    // Validar formato de email usando la función de auth.js
    if (!isValidEmail(email)) {
        showDialog({
            title: 'Error',
            message: 'Por favor ingresa un correo electrónico válido',
            confirmText: 'Entendido'
        });
        return;
    }

    // Si hay contraseña nueva, validar
    if (newPassword || confirmPassword || currentPassword) {
        if (!currentPassword) {
            showDialog({
                title: 'Error',
                message: 'Debes ingresar tu contraseña actual para cambiarla',
                confirmText: 'Entendido'
            });
            return;
        }
        if (!newPassword) {
            showDialog({
                title: 'Error',
                message: 'Debes ingresar una nueva contraseña',
                confirmText: 'Entendido'
            });
            return;
        }
        if (newPassword !== confirmPassword) {
            showDialog({
                title: 'Error',
                message: 'Las contraseñas no coinciden',
                confirmText: 'Entendido'
            });
            return;
        }
        
        // Validar fortaleza de contraseña usando la función de auth.js
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            showDialog({
                title: 'Contraseña débil',
                message: 'La nueva contraseña debe cumplir con:\n\n' + passwordValidation.errors.join('\n'),
                confirmText: 'Entendido'
            });
            return;
        }
    }

    try {
        const token = await getAuthToken();
        const apiUrl = typeof CONFIG !== 'undefined' ? CONFIG.API_URL : 'http://localhost:3000/api';

        // 1. Actualizar información básica del perfil
        const profileResponse = await fetch(`${apiUrl}/users/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email })
        });

        const profileResult = await profileResponse.json();

        if (!profileResult.success) {
            showDialog({
                title: 'Error',
                message: profileResult.error || 'Error al actualizar perfil',
                confirmText: 'Entendido'
            });
            return;
        }

        // Actualizar localStorage con nuevo nombre
        localStorage.setItem('firstName', firstName);

        // 2. Si hay foto temporal, guardarla
        if (temporaryPhoto) {
            await updatePhoto(temporaryPhoto);
            temporaryPhoto = null;
        }

        // 3. Si hay cambio de contraseña, procesarlo
        if (currentPassword && newPassword) {
            const passwordResponse = await fetch(`${apiUrl}/users/password`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    currentPassword, 
                    newPassword 
                })
            });

            const passwordResult = await passwordResponse.json();

            if (!passwordResult.success) {
                showDialog({
                    title: 'Error',
                    message: passwordResult.error || 'Error al cambiar contraseña',
                    confirmText: 'Entendido'
                });
                return;
            }

            // Limpiar campos de contraseña
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
        }

        // Mostrar mensaje de éxito
        Utils.showToast('¡Perfil actualizado correctamente!', 'success');

        // Actualizar el nombre en el header usando la función global
        if (typeof window.loadUserInfo === 'function') {
            window.loadUserInfo();
        }

    } catch (error) {
        console.error('Error al guardar perfil:', error);
        showDialog({
            title: 'Error',
            message: 'Error al guardar los cambios',
            confirmText: 'Entendido'
        });
    }
}

/**
 * Vista previa de la foto seleccionada
 */
function previewPhoto(event) {
    const file = event.target.files[0];

    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        showDialog({
            title: 'Error',
            message: 'Por favor selecciona una imagen válida (JPG, PNG, WebP, GIF)',
            confirmText: 'Entendido'
        });
        return;
    }

    // Validar tamaño (5MB máximo para coincidir con el backend)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
        showDialog({
            title: 'Error',
            message: 'La imagen debe ser menor a 5MB',
            confirmText: 'Entendido'
        });
        return;
    }

    // Leer el archivo como base64
    const reader = new FileReader();
    reader.onload = async function(e) {
        const base64Image = e.target.result;
        
        // Mostrar preview (ocultar fallback, mostrar imagen)
        const photoImg = document.getElementById('profilePhotoPreview');
        const photoFallback = document.getElementById('profilePhotoFallback');
        
        photoImg.src = base64Image;
        photoImg.style.display = 'block';
        photoFallback.style.display = 'none';
        
        // Subir inmediatamente al servidor
        await uploadProfilePhoto(base64Image);
    };
    reader.readAsDataURL(file);
}

/**
 * Subir foto de perfil usando el nuevo sistema de upload
 */
async function uploadProfilePhoto(base64Image) {
    const overlay = document.getElementById('uploadingOverlay');
    const photoInput = document.getElementById('photoInput');
    
    try {
        // Mostrar loading overlay
        if (overlay) {
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
        }
        
        // Deshabilitar input durante upload
        if (photoInput) photoInput.disabled = true;

        const token = await getAuthToken();
        const apiUrl = typeof CONFIG !== 'undefined' ? CONFIG.API_URL : 'http://localhost:3000/api';

        // 1. Subir imagen al servidor de uploads
        const uploadResponse = await fetch(`${apiUrl}/upload/image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: base64Image })
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.success) {
            throw new Error(uploadResult.error || 'Error al subir la imagen');
        }

        // 2. Actualizar URL de la foto en el perfil del usuario
        const fullPhotoUrl = `${CONFIG.SERVER_URL}${uploadResult.data.url}`;
        const profileResponse = await fetch(`${apiUrl}/users/photo`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                profilePhoto: fullPhotoUrl
            })
        });

        const profileResult = await profileResponse.json();

        if (!profileResult.success) {
            throw new Error(profileResult.error || 'Error al actualizar el perfil');
        }

        // Éxito
        Utils.showToast('Foto de perfil actualizada correctamente', 'success');

        // Actualizar la foto en el header si existe
        const headerPhoto = document.querySelector('.user-avatar, [alt="User avatar"]');
        if (headerPhoto) {
            headerPhoto.src = fullPhotoUrl;
        }

    } catch (error) {
        console.error('Error al subir foto:', error);
        showDialog({
            title: 'Error',
            message: error.message || 'Error al actualizar la foto de perfil',
            confirmText: 'Entendido'
        });
        
        // Revertir preview
        await loadProfile();
    } finally {
        // Ocultar loading overlay
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
        }
        
        // Re-habilitar input
        if (photoInput) photoInput.disabled = false;
    }
}

/**
 * Actualizar foto de perfil en el servidor (LEGACY - Mantener por compatibilidad)
 */
async function updatePhoto(photoData) {
    try {
        const token = await getAuthToken();
        const apiUrl = typeof CONFIG !== 'undefined' ? CONFIG.API_URL : 'http://localhost:3000/api';

        const response = await fetch(`${apiUrl}/users/photo`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ profilePhoto: photoData })
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Error al actualizar foto');
        }

        return true;

    } catch (error) {
        console.error('Error al actualizar foto:', error);
        throw error;
    }
}

/**
 * Eliminar foto de perfil
 */
async function removePhoto() {
    const confirmed = await showDialogPromise(
        'Confirmar eliminación',
        '¿Estás seguro de que deseas eliminar tu foto de perfil?',
        true
    );

    if (!confirmed) return;

    try {
        const token = await getAuthToken();
        const apiUrl = typeof CONFIG !== 'undefined' ? CONFIG.API_URL : 'http://localhost:3000/api';

        const response = await fetch(`${apiUrl}/users/photo`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success) {
            // Ocultar imagen y mostrar fallback con inicial
            const photoImg = document.getElementById('profilePhotoPreview');
            const photoFallback = document.getElementById('profilePhotoFallback');
            
            photoImg.style.display = 'none';
            photoFallback.style.display = 'flex';
            
            temporaryPhoto = null;

            Utils.showToast('Foto de perfil eliminada', 'success');
        } else {
            showDialog({
                title: 'Error',
                message: result.error || 'Error al eliminar foto',
                confirmText: 'Entendido'
            });
        }

    } catch (error) {
        console.error('Error al eliminar foto:', error);
        showDialog({
            title: 'Error',
            message: 'Error al eliminar la foto de perfil',
            confirmText: 'Entendido'
        });
    }
}

/**
 * Toggle para mostrar/ocultar contraseña
 */
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

/**
 * Cerrar sesión
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user_data');
    window.location.href = 'login.html';
}

/**
 * Toggle del menú de usuario
 */
function toggleUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    dropdown.classList.toggle('hidden');
}

/**
 * Cerrar dropdown al hacer clic fuera
 */
document.addEventListener('click', function(event) {
    const userMenuButton = document.getElementById('userMenuButton');
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    
    if (userMenuButton && userMenuDropdown) {
        if (!userMenuButton.contains(event.target) && !userMenuDropdown.contains(event.target)) {
            userMenuDropdown.classList.add('hidden');
        }
    }
});

/**
 * Inicializar la página cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar autenticación
    const token = await getAuthToken();
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Cargar información del perfil
    loadProfile();

    // Cargar nombre de usuario en el header
    const firstName = localStorage.getItem('firstName');
    if (firstName) {
        const userNameSpan = document.querySelector('#userMenuButton span');
        if (userNameSpan) {
            userNameSpan.textContent = firstName;
        }
    }
    
    // Configurar menú según el rol del usuario
    setTimeout(() => {
        if (typeof configureAdminMenu === 'function') {
            configureAdminMenu();
        }
        if (typeof configureOwnerMenu === 'function') {
            configureOwnerMenu();
        }
    }, 100);
});
