# 📋 TODO LIST - Buho Eats Frontend

## ✅ Completado

- [x] Estructura básica del proyecto
- [x] Configuración de Tailwind CSS
- [x] Página de Login con validaciones
- [x] Página de Sign Up (Registro) con selección de roles
- [x] Sistema de autenticación básico
- [x] Módulo de API para comunicación con backend

---

## 🎯 En Desarrollo

### Fase 1: Autenticación y Base (Actual)
- [ ] Descargar Tailwind CSS para uso offline
- [ ] Página de recuperación de contraseña
- [ ] Validaciones más robustas en formularios
- [ ] Mensajes de error más descriptivos

---

## 📌 Pendiente

### Fase 2: Dashboards por Rol

#### Dashboard de Usuario Común (Cliente)
- [ ] Diseño del dashboard principal
- [ ] Navegación y menú lateral/superior
- [ ] Vista de perfil de usuario
- [ ] Edición de perfil
- [ ] Historial de reseñas del usuario

#### Dashboard de Propietario (Owner)
- [ ] Dashboard con estadísticas del local
- [ ] Gestión de información del local (nombre, dirección, horarios)
- [ ] Gestión del menú (crear, editar, eliminar platillos)
- [ ] Subida de imágenes del local y platillos
- [ ] Vista de reseñas recibidas
- [ ] Estadísticas de calificaciones

#### Dashboard de Admin
- [ ] Panel de administración general
- [ ] Gestión de usuarios (ver, editar, eliminar, cambiar roles)
- [ ] Gestión de locales (aprobar, rechazar, eliminar)
- [ ] Vista de todas las reseñas
- [ ] Moderación de contenido
- [ ] Estadísticas generales del sistema

### Fase 3: Funcionalidades Principales

#### Sistema de Locales
- [ ] Página de listado de locales/restaurantes
- [ ] Filtros de búsqueda (por categoría, ubicación, calificación)
- [ ] Barra de búsqueda con autocompletado
- [ ] Tarjetas de locales (preview)
- [ ] Página de detalle de local
  - [ ] Información completa del local
  - [ ] Galería de imágenes
  - [ ] Menú completo con precios
  - [ ] Mapa de ubicación
  - [ ] Horarios de atención

#### Sistema de Reseñas
- [ ] Componente de reseña individual
- [ ] Formulario para crear reseña
  - [ ] Sistema de calificación (estrellas 1-5)
  - [ ] Textarea para comentario
  - [ ] Validaciones
- [ ] Editar reseña propia
- [ ] Eliminar reseña propia
- [ ] Mostrar promedio de calificaciones
- [ ] Ordenar reseñas (más recientes, mejor calificadas, etc.)
- [ ] Paginación de reseñas

#### Sistema de Menú
- [ ] Vista de menú por categorías
- [ ] Tarjetas de platillos con:
  - [ ] Imagen
  - [ ] Nombre
  - [ ] Descripción
  - [ ] Precio
  - [ ] Disponibilidad
- [ ] Modal de detalle de platillo

### Fase 4: Componentes Reutilizables

- [ ] Navbar/Header componente
- [ ] Sidebar componente
- [ ] Footer componente
- [ ] Modal genérico
- [ ] Sistema de notificaciones/toasts
- [ ] Loader/Spinner
- [ ] Breadcrumbs
- [ ] Paginación
- [ ] Sistema de tabs
- [ ] Cards genéricas
- [ ] Formularios genéricos

### Fase 5: Funcionalidades Adicionales

- [ ] Sistema de favoritos (marcar locales favoritos)
- [ ] Búsqueda avanzada con múltiples filtros
- [ ] Ordenamiento de resultados
- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat/mensajería (opcional)
- [ ] Sistema de reportes (reportar reseñas inapropiadas)
- [ ] Modo oscuro/claro
- [ ] Responsive design completo

### Fase 6: Optimización y Seguridad

- [ ] Validación de inputs (XSS prevention)
- [ ] CSRF tokens
- [ ] Rate limiting en formularios
- [ ] Sanitización de datos
- [ ] Optimización de imágenes
- [ ] Lazy loading de imágenes
- [ ] Code splitting
- [ ] Minificación de archivos CSS/JS
- [ ] Caché de assets
- [ ] Service Worker (PWA opcional)

### Fase 7: Testing y Documentación

- [ ] Testing manual de todas las funcionalidades
- [ ] Documentación de componentes
- [ ] Guía de uso para cada rol
- [ ] Manual de despliegue
- [ ] Documentación de API endpoints necesarios

---

## 🔐 Consideraciones de Seguridad (Importante)

### Frontend Security Checklist
- [ ] Input validation en todos los formularios
- [ ] Sanitización de HTML para prevenir XSS
- [ ] No exponer información sensible en localStorage
- [ ] Implementar timeout de sesión
- [ ] HTTPS obligatorio (configurar en servidor)
- [ ] Headers de seguridad (CSP, X-Frame-Options, etc.)
- [ ] Validación de tokens JWT
- [ ] Logout seguro (limpiar todo el estado)

### Hardening del Servidor (Backend)
- [ ] Configurar firewall (iptables/ufw)
- [ ] Deshabilitar servicios innecesarios
- [ ] Configurar permisos mínimos
- [ ] Fail2ban para protección contra fuerza bruta
- [ ] Logs de auditoría
- [ ] Actualización regular de dependencias

---

## 📱 Estructura de Páginas Necesarias

```
pages/
├── login.html              ✅ (Hecho)
├── signup.html             ✅ (Hecho)
├── forgot-password.html    ⏳ (Pendiente)
├── dashboard-user.html     ⏳ (Pendiente)
├── dashboard-owner.html    ⏳ (Pendiente)
├── dashboard-admin.html    ⏳ (Pendiente)
├── profile.html            ⏳ (Pendiente)
├── edit-profile.html       ⏳ (Pendiente)
├── restaurants.html        ⏳ (Pendiente) - Listado de locales
├── restaurant-detail.html  ⏳ (Pendiente) - Detalle de local
├── my-reviews.html         ⏳ (Pendiente) - Mis reseñas
├── manage-restaurant.html  ⏳ (Pendiente) - Gestión de local (owner)
├── manage-menu.html        ⏳ (Pendiente) - Gestión de menú (owner)
└── admin/                  ⏳ (Pendiente)
    ├── users.html
    ├── restaurants.html
    └── reviews.html
```

---

## 💡 Notas Importantes

### Tailwind CSS Offline
Para usar Tailwind sin internet en la VM:
1. Descargar el archivo CDN: https://cdn.tailwindcss.com
2. Guardar en `libs/tailwind.min.js`
3. Actualizar referencias en todas las páginas

### Backend Endpoints Necesarios
Documentar los endpoints que necesitarás del backend:
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/logout`
- GET `/api/user/profile`
- PUT `/api/user/profile`
- GET `/api/restaurants`
- GET `/api/restaurants/:id`
- POST `/api/reviews`
- PUT `/api/reviews/:id`
- DELETE `/api/reviews/:id`
... (agregar más según necesidades)

---

## 🎨 Paleta de Colores

```css
Primary: #FF6B35    (Naranja)
Secondary: #F7931E  (Naranja claro)
Dark: #2C3E50       (Azul oscuro)
Light: #ECF0F1      (Gris claro)
Success: #27AE60    (Verde)
Danger: #E74C3C     (Rojo)
Warning: #F39C12    (Amarillo)
```

---

**Última actualización:** 29 de octubre de 2025
**Prioridad actual:** Fase 1 - Autenticación
**Siguiente paso:** Crear dashboards para cada rol
