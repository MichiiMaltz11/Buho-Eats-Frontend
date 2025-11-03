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
        const userDataStr = localStorage.getItem('user_data');
        
        if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            const userName = document.getElementById('userName');
            
            if (userName && userData.firstName) {
                userName.textContent = userData.firstName;
            }
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

// Hacer la función global
window.loadUserInfo = loadUserInfo;
window.showHomeOptionIfNeeded = showHomeOptionIfNeeded;
