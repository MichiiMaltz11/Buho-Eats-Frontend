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
 * Función de logout compartida
 */
function logout() {
    if (typeof Auth !== 'undefined') {
        Auth.logout();
    } else {
        // Fallback si Auth no está disponible
        localStorage.clear();
        window.location.href = '../index.html';
    }
}

/**
 * Cargar información del usuario en el header
 */
function loadUserInfo() {
    try {
        // Usar directamente 'user_data' como clave
        const userDataStr = localStorage.getItem('user_data');
        console.log('🔍 Intentando cargar info del usuario...');
        console.log('📦 user_data en localStorage:', userDataStr);
        
        if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            console.log('✅ Datos del usuario parseados:', userData);
            
            const userName = document.getElementById('userName');
            console.log('🎯 Elemento userName encontrado:', userName);
            
            if (userName && userData.firstName) {
                // Usar firstName directamente
                userName.textContent = userData.firstName;
                console.log('✨ Nombre actualizado a:', userData.firstName);
            } else {
                console.warn('⚠️ No se encontró userName element o userData.firstName');
                console.log('userName element:', userName);
                console.log('userData.firstName:', userData.firstName);
            }
        } else {
            console.warn('⚠️ No hay user_data en localStorage');
            console.log('🔑 Todas las claves en localStorage:', Object.keys(localStorage));
        }
    } catch (error) {
        console.error('❌ Error cargando información del usuario:', error);
    }
}

// Hacer la función global
window.loadUserInfo = loadUserInfo;

// Cargar información del usuario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para asegurar que el header se haya cargado
    setTimeout(loadUserInfo, 200);
});
