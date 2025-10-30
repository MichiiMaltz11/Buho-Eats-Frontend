# Buho Eats - Frontend

Frontend para el proyecto Buho Eats, desarrollado con HTML, CSS y JavaScript vanilla.

## 📁 Estructura del Proyecto

```
Buho-Eats-Frontend/
├── assets/
│   ├── css/           # Archivos de estilos CSS
│   │   ├── reset.css  # Reset de estilos por defecto
│   │   └── main.css   # Estilos principales
│   ├── js/            # Scripts JavaScript
│   │   ├── config.js  # Configuración de la app
│   │   ├── api.js     # Módulo de comunicación con API
│   │   ├── auth.js    # Módulo de autenticación
│   │   ├── utils.js   # Funciones helper
│   │   └── main.js    # Script principal
│   ├── img/           # Imágenes
│   └── fonts/         # Fuentes personalizadas
├── pages/             # Páginas HTML adicionales
│   ├── login.html     # ✅ Página de login
│   └── signup.html    # ✅ Página de registro
├── components/        # Componentes HTML reutilizables
├── libs/              # Librerías externas
│   └── tailwind.js    # ✅ Tailwind CSS (offline)
├── index.html         # Página principal
├── README.md          # Este archivo
├── TODO.md            # Lista de tareas del proyecto
└── TAILWIND_OFFLINE.md # Guía de uso de Tailwind offline
```

## 🚀 Requisitos del Proyecto

### Tecnologías Permitidas
- ✅ HTML5
- ✅ CSS3
- ✅ JavaScript Vanilla
- ✅ Tailwind CSS (configurado para uso offline)
- ✅ Librerías: jQuery (si es necesario, con autorización)

### Restricciones
- ❌ No usar frameworks (React, Angular, Vue.js)
- ❌ No acceso a Internet desde la VM
- ❌ No usar XAMPP/LAMPP

## 🛠️ Configuración

### 1. Configurar Backend
Edita `assets/js/config.js` para configurar la URL del backend:

```javascript
const CONFIG = {
    API_URL: 'http://localhost:8000/api',
    // ... resto de configuración
};
```

### 2. Despliegue Local
Esta aplicación debe servirse desde un servidor web. Puedes usar:

**Python:**
```bash
python3 -m http.server 8080
```

**PHP:**
```bash
php -S localhost:8080
```

**Node.js:**
```bash
npx http-server -p 8080
```

## 📝 Medidas de Seguridad

El proyecto implementa las siguientes medidas de seguridad:

1. **Hardening del servidor**
2. **Firewall configurado**
3. **Gestión de permisos mínimos**
4. **Aislamiento de red**

## 🔐 Autenticación

El módulo de autenticación (`assets/js/auth.js`) proporciona:
- Login/Logout
- Gestión de sesiones
- Protección de rutas
- Almacenamiento seguro de tokens

## � Próximos Pasos

### ✅ Completado
1. ✅ Estructura básica del proyecto
2. ✅ Configuración de Tailwind CSS (offline)
3. ✅ Página de Login con validaciones
4. ✅ Página de Sign Up con selección de roles
5. ✅ Sistema de autenticación
6. ✅ Módulo de utilidades

### 🎯 Siguientes Pasos
1. Crear dashboards para cada rol:
   - Dashboard de Usuario (ver locales, reseñas)
   - Dashboard de Propietario (gestionar local y menú)
   - Dashboard de Admin (gestión completa)
2. Implementar listado de locales/restaurantes
3. Página de detalle de local
4. Sistema de reseñas y calificaciones
5. Gestión de menú para propietarios

**📋 Ver TODO.md para la lista completa de tareas**

## 📄 Licencia

Proyecto académico - Universidad [Nombre]
