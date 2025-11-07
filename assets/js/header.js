/**
 * Header utilities
 * Funciones comunes para el header en todas las páginas
 */

/**
 * Toggle del menú de usuario
 */
function toggleUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

/**
 * Cerrar el menú si se hace click fuera
 */
document.addEventListener('click', function(event) {
    const userMenuButton = document.getElementById('userMenuButton');
    const dropdown = document.getElementById('userMenuDropdown');
    
    if (userMenuButton && dropdown) {
        if (!userMenuButton.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.add('hidden');
        }
    }
});

/**
 * Cargar información del usuario en el header
 */
async function loadUserInfo() {
    try {
        // Obtener usuario desde Auth
        const user = Auth.getUser();
        
        if (!user) {
            console.warn('No hay usuario autenticado');
            return;
        }
        
        const firstName = user.firstName || user.first_name;
        
        // Actualizar el nombre del usuario
        const userName = document.getElementById('userName');
        if (userName && firstName) {
            userName.textContent = firstName;
            // Asegurar que sea visible en desktop (quitar hidden, mantener md:block)
            userName.classList.remove('hidden');
        }
        
        // También actualizar el span dentro del botón de menú (para páginas que lo usan)
        const userNameSpan = document.querySelector('#userMenuButton span');
        if (userNameSpan && firstName && userNameSpan.id !== 'userName') {
            userNameSpan.textContent = firstName;
        }
        
        // Cargar foto de perfil desde el backend
        try {
            const token = await Auth.getToken();
            const apiUrl = typeof CONFIG !== 'undefined' ? CONFIG.API_URL : 'http://localhost:3000/api';
            
            console.log('Cargando foto de perfil del usuario...');
            
            const response = await fetch(`${apiUrl}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Datos del perfil:', result);
                
                if (result.success && result.data.profilePhoto) {
                    const profilePhotoImg = document.getElementById('userProfilePhoto');
                    const fallbackDiv = document.getElementById('userAvatarFallback');
                    
                    console.log('Foto de perfil encontrada:', result.data.profilePhoto);
                    console.log('Elemento img encontrado:', profilePhotoImg);
                    
                    if (profilePhotoImg) {
                        profilePhotoImg.src = result.data.profilePhoto;
                        profilePhotoImg.style.display = 'block';
                        if (fallbackDiv) fallbackDiv.style.display = 'none';
                        console.log('Foto de perfil actualizada en el header');
                    } else {
                        console.warn('No se encontró el elemento userProfilePhoto');
                    }
                } else {
                    console.log('No hay foto de perfil en los datos del usuario');
                }
            }
        } catch (error) {
            console.log('No se pudo cargar la foto de perfil:', error);
            // No es crítico, se usa el fallback
        }
        
    } catch (error) {
        console.error('Error cargando información del usuario:', error);
    }
}

/**
 * Mostrar opción "Inicio" en el menú solo si NO estamos en dashboard
 */
function showHomeOptionIfNeeded() {
    const currentPage = document.body.getAttribute('data-page');
    const homeOption = document.getElementById('menuHomeOption');
    
    if (homeOption && currentPage !== 'dashboard') {
        homeOption.classList.remove('hidden');
        homeOption.classList.add('block');
    }
}

/**
 * Corregir rutas del header dependiendo de la página actual
 */
function fixHeaderLinks() {
    // Detectar si estamos en la raíz o en /pages/
    const currentPath = window.location.pathname;
    const isInPagesFolder = currentPath.includes('/pages/');
    
    // Si no estamos en /pages/, no hay que hacer nada (las rutas ya son correctas)
    if (!isInPagesFolder) return;
    
    // Obtener todos los links del header que apuntan a páginas
    const links = document.querySelectorAll('#userMenuDropdown a[href]');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        
        // Si el href ya es correcto (empieza con #, http, o tiene ../), no tocarlo
        if (href.startsWith('#') || href.startsWith('http') || href.includes('../')) {
            return;
        }
        
        // Si es un archivo .html sin ruta, no hacer nada (ya está bien)
        // Las rutas en header.html ya son relativas y funcionan dentro de /pages/
    });
}

// Hacer las funciones globales
window.loadUserInfo = loadUserInfo;
window.showHomeOptionIfNeeded = showHomeOptionIfNeeded;
window.fixHeaderLinks = fixHeaderLinks;

// Ejecutar funciones cuando se carga el script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        fixHeaderLinks();
        // Cargar info del usuario si está autenticado
        if (typeof Auth !== 'undefined' && Auth.isAuthenticated()) {
            loadUserInfo();
        }
    });
} else {
    fixHeaderLinks();
    // Cargar info del usuario si está autenticado
    if (typeof Auth !== 'undefined' && Auth.isAuthenticated()) {
        loadUserInfo();
    }
}
