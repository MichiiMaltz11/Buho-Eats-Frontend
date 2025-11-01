/**
 * Componente de Diálogo Personalizado
 * Buho Eats - Sistema de confirmaciones y alertas
 */

let dialogCallback = null;

/**
 * Muestra un diálogo de confirmación personalizado
 * @param {Object} options - Configuración del diálogo
 * @param {string} options.title - Título del diálogo
 * @param {string} options.message - Mensaje del diálogo
 * @param {string} options.confirmText - Texto del botón de confirmación (default: 'Aceptar')
 * @param {string} options.cancelText - Texto del botón de cancelar (default: 'Cancelar')
 * @param {Function} options.onConfirm - Callback cuando se confirma
 * @param {Function} options.onCancel - Callback cuando se cancela
 * 
 * @example
 * showDialog({
 *     title: 'Eliminar registro',
 *     message: '¿Estás seguro de eliminar este elemento?',
 *     confirmText: 'Sí, eliminar',
 *     cancelText: 'No, conservar',
 *     onConfirm: () => {
 *         console.log('Confirmado');
 *     },
 *     onCancel: () => {
 *         console.log('Cancelado');
 *     }
 * });
 */
function showDialog(options) {
    const dialog = document.getElementById('customDialog');
    const title = document.getElementById('dialogTitle');
    const message = document.getElementById('dialogMessage');
    const confirmBtn = document.getElementById('dialogConfirmBtn');
    const cancelBtn = document.getElementById('dialogCancelBtn');
    
    // Configurar contenido
    title.textContent = options.title || 'Confirmación';
    message.textContent = options.message || '¿Estás seguro?';
    confirmBtn.textContent = options.confirmText || 'Aceptar';
    cancelBtn.textContent = options.cancelText || 'Cancelar';
    
    // Guardar callbacks
    dialogCallback = {
        onConfirm: options.onConfirm || null,
        onCancel: options.onCancel || null
    };
    
    // Mostrar el diálogo
    dialog.classList.remove('hidden');
    dialog.classList.add('flex');
    
    // Animación de entrada
    setTimeout(() => {
        dialog.querySelector('.bg-white').classList.add('scale-100');
    }, 10);
}

/**
 * Cierra el diálogo y ejecuta el callback correspondiente
 * @param {boolean} confirmed - Si fue confirmado (true) o cancelado (false)
 */
function closeDialog(confirmed) {
    const dialog = document.getElementById('customDialog');
    
    // Animación de salida
    dialog.querySelector('.bg-white').classList.remove('scale-100');
    
    setTimeout(() => {
        dialog.classList.add('hidden');
        dialog.classList.remove('flex');
        
        // Ejecutar callback correspondiente
        if (confirmed && dialogCallback?.onConfirm) {
            dialogCallback.onConfirm();
        } else if (!confirmed && dialogCallback?.onCancel) {
            dialogCallback.onCancel();
        }
        
        dialogCallback = null;
    }, 200);
}

// Cerrar con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const dialog = document.getElementById('customDialog');
        if (dialog && !dialog.classList.contains('hidden')) {
            closeDialog(false);
        }
    }
});

// Cerrar al hacer clic fuera del modal
document.addEventListener('click', function(e) {
    const dialog = document.getElementById('customDialog');
    if (dialog && e.target === dialog) {
        closeDialog(false);
    }
});
