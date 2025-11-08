# 🍽️ Guía para Owner - Buho Eats

## 📋 Información de Cuenta

**Credenciales de Owner Default (para pruebas):**
- **Email:** `owner@buhoeats.com`
- **Contraseña:** `Admin123!`
- **Rol:** Owner (Dueño de restaurante)
- **Restaurante:** La Bella Notte (ya configurado)

**O puedes crear tu propia cuenta:**
- Ve a **Sign Up** y regístrate normalmente
- El sistema te pedirá el nombre de tu restaurante y dirección
- Los demás campos del restaurante los completarás después de iniciar sesión

---

## 🎯 ¿Qué es un Owner?

Como **Owner**, eres dueño de **UN SOLO restaurante** en la plataforma.

**Diferencias con un usuario normal:**
- ❌ **NO puedes** explorar otros restaurantes
- ❌ **NO puedes** dejar reseñas 
- ❌ **NO verás** el botón de favoritos (corazón)
- ✅ **SÍ puedes** gestionar completamente TU restaurante
- ✅ **SÍ puedes** moderar reseñas (flagear comentarios inapropiados)
- ✅ **SÍ verás** estadísticas de tu negocio

---

## 🚀 Navegacion principal 

### **Opción A: Usar cuenta de prueba (La Bella Notte)**
1. Ve a la página de login: `http://localhost:5500/pages/login.html`
2. Ingresa: `owner@buhoeats.com` / `Admin123!`
3. Serás redirigido a **La Bella Notte** (ya tiene menú completo)

### **Opción B: Crear tu propia cuenta de owner**
1. Ve a **Sign Up**: `http://localhost:5500/pages/signup.html`
2. Llena tus datos personales (nombre, apellido, email, contraseña)
3. **Selecciona el rol:** `Owner` (dueño de restaurante)
4. El formulario te pedirá **información básica** del restaurante:
   - 📝 **Nombre del restaurante** (obligatorio)
   - 📍 **Dirección** (obligatorio)
5. Haz clic en **"Registrarse"**
6. La cuenta se crea con esos 2 campos mínimos
7. Inicia sesión con tu nuevo usuario

### **Después del primer login:**
- Serás redirigido a **la página de tu restaurante**
- Tu restaurante estará **incompleto** (solo tiene nombre y dirección)
- **Ahora puedes completar** toda la información faltante:
  - Descripción completa
  - Teléfono y email de contacto
  - Tipo de cocina (italiana, mexicana, etc.)
  - Rango de precios ($, $$, $$$, $$$$)
  - Horarios de apertura
  - Foto del restaurante
  - Menú completo

### **Vista de tu restaurante**
Al entrar, verás la página de tu restaurante en **modo edición** (igual a `restaurant-detail.html` pero con opciones de gestión):
- ✏️ **Editar información** del restaurante (completar campos faltantes)
- 📸 **Cambiar foto** principal del restaurante
- 🍽️ **Gestionar menú** (agregar, editar, eliminar platillos)
- 🚩 **Moderar reseñas** de los usuarios

### **Menú de navegación (Dropdown)**
Al hacer clic en tu foto de perfil, verás:
- 👤 **Mi Perfil** (editar datos personales)
- 📊 **Estadísticas** (en lugar de "Favoritos")
- 🚪 **Cerrar Sesión**

---

## 🏗️ Configuración Inicial (si creaste cuenta nueva)

**Cuando creas una cuenta de owner por Sign Up:**
1. Solo se guardan **2 campos obligatorios** del restaurante:
   - Nombre del restaurante
   - Dirección

2. **Los demás campos quedan vacíos** (esto es NORMAL, no es error):
   - Descripción → `null`
   - Teléfono → `null`
   - Email → `null`
   - Tipo de cocina → `null`
   - Rango de precios → `null`
   - Horarios → `null`
   - Foto → imagen por defecto

3. **Tu primera tarea** al entrar será completar estos campos:
   - Ve a **"Editar Información"** en tu restaurante
   - Llena todos los campos faltantes
   - Guarda los cambios

4. **Agregar menú:**
   - Tu restaurante empieza sin platillos (menú vacío)
   - Ve a la sección **"Menú"**
   - Haz clic en **"Agregar Platillo"**
   - Crea tus items por categoría (Entradas, Platos, Postres, Bebidas)

---

## 💬 Funcionalidades Principales

### ✅ **1. Editar información del restaurante**
- Nombre del restaurante
- Descripción completa
- Dirección y teléfono
- Email de contacto
- Horarios de apertura
- Tipo de cocina

### ✅ **2. Cambiar foto del restaurante**
- Sube una nueva imagen principal
- La foto aparecerá en el banner superior

### ✅ **3. Gestionar menú**
Tu restaurante tiene **8 platillos** organizados en 4 categorías:

**Entradas:**
- Bruschetta al Pomodoro ($89)
- Insalata Caprese ($125)

**Platos Principales:**
- Spaghetti alla Carbonara ($185)
- Lasagna alla Bolognese ($195)

**Postres:**
- Tiramisù Classico ($95)
- Panna Cotta ai Frutti di Bosco ($85)

**Bebidas:**
- Espresso Italiano ($45)
- Vino Tinto de la Casa ($95)

**Puedes:**
- ➕ Agregar nuevos platillos
- ✏️ Editar nombre, descripción, precio, categoría
- 🖼️ Cambiar imagen del platillo
- 🗑️ Eliminar platillos

### ✅ **4. Ver y moderar reseñas**
- **Ver todas las reseñas** que los usuarios dejan en tu restaurante
- **Flagear reseñas inapropiadas** 🚩
  - Si una reseña tiene contenido ofensivo, spam o falso
  - Al flagear, se envía una notificación al admin
  - El admin decidirá si la elimina o no
- **NO puedes eliminar reseñas directamente** 
- **NO puedes dejar reseñas** 

### ✅ **5. Ver estadísticas** 📊
- Rating promedio de tu restaurante ⭐
- Total de reseñas recibidas
- Distribución de calificaciones (cuántas de 1⭐, 2⭐, 3⭐, 4⭐, 5⭐)
- Engament tipo visitas de la pagina del local

### ✅ **6. Gestionar perfil**
- Cambiar tu foto de perfil
- Editar nombre, apellido, email
- Actualizar contraseña

---

## 🎭 Escenarios de Prueba

### **Escenario 1: Crear cuenta nueva de owner**
1. Ve a **Sign Up**
2. Llena tus datos personales
3. Selecciona rol: **Owner**
4. Ingresa:
   - Nombre del restaurante: "Mi Restaurante"
   - Dirección: "Calle Falsa 123"
5. Regístrate
6. Inicia sesión
7. Verás tu restaurante **incompleto** (solo nombre y dirección)

### **Escenario 2: Completar información del restaurante**
1. Entra a tu restaurante (modo owner)
2. Haz clic en **"Editar Información"** ✏️
3. Completa los campos faltantes:
   - Descripción completa del restaurante
   - Teléfono y email de contacto
   - Tipo de cocina (Mexicana, Italiana, etc.)
   - Horarios de apertura
4. Guarda los cambios
5. Tu restaurante ahora está completo

### **Escenario 3: Cambiar foto del restaurante**
1. En la vista de tu restaurante
2. Haz clic en **"Cambiar Foto"** 📸 (sobre la imagen del banner)
3. Selecciona una nueva imagen
4. La foto se actualiza y aparece en el banner

### **Escenario 4: Agregar platillos al menú**
1. Ve a la sección **"Menú"** de tu restaurante
2. Haz clic en **"Agregar Platillo"** ➕
3. Completa el formulario:
   - Nombre del platillo
   - Descripción
   - Precio
   - Categoría (Entrada, Plato Principal, Postre, Bebida)
   - Imagen (opcional)
4. Guarda el platillo
5. Aparece en tu menú bajo la categoría seleccionada

### **Escenario 5: Editar/eliminar platillos existentes**
1. Haz clic en un platillo del menú
2. Opciones:
   - ✏️ **Editar:** Cambiar precio, descripción, nombre
   - 🗑️ **Eliminar:** Borrar el platillo permanentemente

### **Escenario 6: Moderar reseñas**
1. Lee las reseñas de tu restaurante
2. Si encuentras una reseña inapropiada, haz clic en **"Reportar"** 🚩
3. Selecciona el motivo (spam, ofensivo, falso)
4. Confirma el reporte
5. El admin recibirá una notificación para revisar

### **Escenario 7: Ver estadísticas**
1. Haz clic en tu foto de perfil (esquina superior derecha)
2. Selecciona **"Estadísticas"** 📊
3. Observa:
   - Rating promedio actual
   - Total de reseñas
   - Distribución de calificaciones (1⭐ a 5⭐)
   - Engagement y visitas a tu página

### **Escenario 8: Actualizar tu perfil personal**
1. Ve a **"Mi Perfil"** 👤
2. Cambia tu foto de perfil
3. Actualiza tu información personal (nombre, email)
4. Guarda los cambios

---

## 🔍 Qué buscar / Probar

### ✅ **Funcionalidades que SÍ funcionan (actuales):**
- ✅ Login / Logout
- ✅ Ver los restaurante completos
- ✅ Ver reseñas de usuarios
- ✅ Ver menú actual (8 platillos)
- ✅ Editar perfil personal
- ✅ Cambiar foto de perfil
- ✅ Notificaciones toast

### ⚠️ **Funcionalidades que debes implementar (tu trabajo):**
- ⏳ **Sign Up para owners:** Formulario ya esta pero el backend aun no trabaja con lo del owner 
- ⏳ **Completar restaurante:** Permitir editar toda la información después del registro
- ⏳ **Editar información del restaurante:** Descripción, teléfono, horarios, tipo cocina, etc.
- ⏳ **Cambiar foto del restaurante:** Subir nueva imagen principal
- ⏳ **CRUD de menú:** Agregar/editar/eliminar platillos
- ⏳ **Toggle disponibilidad:** Marcar platillos como disponibles/agotados
- ⏳ **Flagear reseñas:** Reportar comentarios inapropiados al admin
- ⏳ **Ver estadísticas:** Rating, distribución, engagement
- ⏳ **Ocultar favoritos:** El botón ❤️ no debe aparecer para owners
- ⏳ **Deshabilitar reseñas:** Owner no puede dejar reseñas en su propio restaurante
- ⏳ **Redirección:** Al login, owner va directo a su restaurante (no al dashboard)

---

## ❌ Restricciones Importantes

**Como Owner, NO puedes:**
- ❌ Ver el dashboard general de restaurantes (no navegas libremente)
- ❌ Explorar otros restaurantes de la plataforma
- ❌ Dejar reseñas en los restaurante
- ❌ Agregar restaurantes a favoritos (el botón ❤️ no aparece)
- ❌ Eliminar reseñas directamente (solo puedes reportarlas)
- ❌ Acceder a la sección "Favoritos" (en su lugar tienes "Estadísticas")

**Tu enfoque es 100% en gestionar EL restaurante.**


## 🗄️ Base de Datos y API

### **📊 Tabla: `restaurants` (Ya existe)**

La tabla ya está creada, solo necesita usarse correctamente:

```sql
CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    cuisine_type TEXT,
    price_range TEXT CHECK(price_range IN ('$', '$$', '$$$', '$$$$')),
    opening_hours TEXT,
    owner_id INTEGER,
    image_url TEXT,
    rating REAL DEFAULT 0.0,
    average_rating REAL DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1 CHECK(is_active IN (0, 1)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);
```

**Campos obligatorios:** `name`, `address`  
**Campos opcionales:** Todos los demás (pueden ser NULL)

### **📊 Tabla: `menu_items` (Ya existe)**

```sql
CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL CHECK(price >= 0),
    category TEXT CHECK(category IN ('Entrada', 'Plato Principal', 'Postre', 'Bebida', 'Otro')),
    image_url TEXT,
    is_available INTEGER DEFAULT 1 CHECK(is_available IN (0, 1)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);
```

### **📊 Tabla: `review_reports` (NUEVA - Compartida con Admin)**

Esta tabla ya fue definida en la guía del admin, sirve para que owners reporten reseñas:

```sql
CREATE TABLE IF NOT EXISTS review_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    review_id INTEGER NOT NULL,
    reporter_id INTEGER NOT NULL,
    reason TEXT NOT NULL CHECK(reason IN ('spam', 'ofensivo', 'falso', 'otro')),
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pendiente' CHECK(status IN ('pendiente', 'aprobado', 'rechazado')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    resolved_by INTEGER,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
);
```

---

### **🔧 Endpoints de API Necesarios**

#### **1. Registrar Owner con Restaurante**
```
POST /api/auth/register
```
**Request Body:**
```json
{
  "firstName": "Marco",
  "lastName": "Rossi",
  "email": "marco@restaurant.com",
  "password": "MiPassword123!",
  "role": "owner",
  "restaurant": {
    "name": "Mi Restaurante",
    "address": "Calle Principal 123"
  }
}
```
**Acción Backend:**
1. Crear usuario en tabla `users` con `role = 'owner'`
2. Crear restaurante en tabla `restaurants` con `name` y `address`
3. Asociar: `UPDATE restaurants SET owner_id = ? WHERE id = ?`
4. Retornar token JWT

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR...",
    "user": {
      "id": 3,
      "firstName": "Marco",
      "role": "owner",
      "restaurantId": 6
    }
  }
}
```

#### **2. Obtener Restaurante del Owner**
```
GET /api/owner/restaurant
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "Mi Restaurante",
    "description": null,
    "address": "Calle Principal 123",
    "phone": null,
    "email": null,
    "cuisine_type": null,
    "price_range": null,
    "opening_hours": null,
    "image_url": "/assets/img/restaurants/default/italian-1.jpg",
    "rating": 0.0,
    "total_reviews": 0,
    "ownerId": 3
  }
}
```

#### **3. Actualizar Información del Restaurante**
```
PUT /api/owner/restaurant
```
**Request Body:**
```json
{
  "description": "Auténtica cocina italiana con recetas tradicionales",
  "phone": "555-1234",
  "email": "contacto@mirestaurante.com",
  "cuisine_type": "Italiana",
  "price_range": "$$",
  "opening_hours": "Lun-Dom: 12:00-23:00"
}
```
**Validación Backend:**
- Verificar que el usuario sea owner
- Verificar que el restaurante pertenezca al owner actual
- Solo permitir actualizar campos permitidos (no cambiar owner_id, rating, etc.)

**Response:**
```json
{
  "success": true,
  "message": "Restaurante actualizado correctamente"
}
```

#### **4. Cambiar Foto del Restaurante**
```
POST /api/owner/restaurant/photo
```
**Content-Type:** `multipart/form-data`

**Request:**
- `photo`: Archivo de imagen (JPG, PNG)

**Acción Backend:**
1. Validar que sea imagen válida
2. Validar tamaño (max 5MB)
3. Guardar en carpeta `assets/img/restaurants/`
4. Actualizar `image_url` en tabla `restaurants`

**Response:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "/assets/img/restaurants/restaurant-6.jpg"
  }
}
```

#### **5. Obtener Menú del Restaurante**
```
GET /api/owner/menu
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "name": "Bruschetta",
      "description": "Pan tostado con tomate...",
      "price": 89.00,
      "category": "Entrada",
      "image_url": "/assets/img/menu/bruschetta.jpg",
      "is_available": 1
    }
  ],
  "total": 8
}
```

#### **6. Agregar Platillo al Menú**
```
POST /api/owner/menu
```
**Request Body:**
```json
{
  "name": "Pasta Carbonara",
  "description": "Pasta con pancetta y huevo",
  "price": 185.00,
  "category": "Plato Principal",
  "image_url": "/assets/img/menu/carbonara.jpg"
}
```
**Validación:**
- `name`: Requerido, min 3 caracteres
- `price`: Requerido, > 0
- `category`: Debe ser una de las categorías válidas
- Verificar que el owner sea dueño del restaurante

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 16,
    "name": "Pasta Carbonara",
    "price": 185.00
  }
}
```

#### **7. Editar Platillo**
```
PUT /api/owner/menu/:itemId
```
**Request Body:**
```json
{
  "name": "Spaghetti Carbonara",
  "description": "Pasta italiana con salsa cremosa",
  "price": 195.00
}
```
**Validación:**
- Verificar que el platillo pertenezca al restaurante del owner
- Solo permitir actualizar campos seguros

#### **8. Eliminar Platillo**
```
DELETE /api/owner/menu/:itemId
```
**Response:**
```json
{
  "success": true,
  "message": "Platillo eliminado correctamente"
}
```

#### **9. Reportar Reseña**
```
POST /api/owner/reviews/:reviewId/report
```
**Request Body:**
```json
{
  "reason": "ofensivo",
  "description": "Lenguaje inapropiado y ofensivo"
}
```
**Validación Backend:**
1. Verificar que el usuario sea owner
2. Verificar que la reseña pertenezca a SU restaurante
3. No permitir reportar dos veces la misma reseña
4. Guardar en tabla `review_reports`

**Response:**
```json
{
  "success": true,
  "message": "Reseña reportada. El admin la revisará pronto."
}
```

#### **10. Obtener Estadísticas del Restaurante**
```
GET /api/owner/stats
```
**Response:**
```json
{
  "success": true,
  "data": {
    "rating": 4.5,
    "totalReviews": 45,
    "distribution": {
      "5": 20,
      "4": 15,
      "3": 8,
      "2": 1,
      "1": 1
    },
    "recentReviews": [
      {
        "id": 123,
        "user": "Ana López",
        "rating": 5,
        "comment": "Excelente comida",
        "date": "2025-11-05"
      }
    ]
  }
}
```

---

### **🔐 Middleware de Autorización**

```javascript
// middleware/ownerAuth.js
function requireOwner(req, res, next) {
    const user = req.user; // Del JWT
    
    if (!user || user.role !== 'owner') {
        return res.status(403).json({
            success: false,
            error: 'Acceso denegado. Se requiere rol de owner.'
        });
    }
    
    next();
}

// Verificar que el recurso pertenezca al owner
async function requireOwnRestaurant(req, res, next) {
    const ownerId = req.user.id;
    const restaurantId = req.params.restaurantId || req.user.restaurantId;
    
    const restaurant = await db.get(
        'SELECT owner_id FROM restaurants WHERE id = ?',
        [restaurantId]
    );
    
    if (!restaurant || restaurant.owner_id !== ownerId) {
        return res.status(403).json({
            success: false,
            error: 'Este restaurante no te pertenece.'
        });
    }
    
    next();
}
```

---

### **📝 Validaciones Backend Importantes**

**Al registrar owner:**
1. Email único (no debe existir)
2. Contraseña fuerte (min 8 caracteres, mayúscula, número,simbolo)
3. Nombre del restaurante obligatorio (min 3 caracteres)
4. Dirección obligatoria (min 10 caracteres)
5. Crear restaurante Y usuario en transacción (atomicidad)

**Al editar restaurante:**
1. Verificar que el owner sea dueño del restaurante
2. No permitir cambiar `owner_id`, `rating`, `total_reviews`
3. Validar formato de email si se proporciona
4. Validar formato de teléfono si se proporciona

**Al gestionar menú:**
1. Verificar que el platillo pertenezca al restaurante del owner
2. No permitir precios negativos
3. Categoría debe ser válida

**Al reportar reseña:**
1. Verificar que la reseña exista
2. Verificar que la reseña sea de SU restaurante
3. No permitir duplicados (ya reportada por ese owner)

---

## 📝 Resumen de tu trabajo

### **Backend:**
1. 📝 **Modificar endpoint Sign Up:** Aceptar campo `role` y `restaurant` en el body
2. 🍽️ **Crear restaurante al registrar:** Insertar en `restaurants` con `name` y `address`
3. 🔗 **Asociar con owner:** Guardar `owner_id` correctamente
4. 🚩 **Crear tabla `review_reports`:** Para flagear reseñas
5. 📊 **10 endpoints nuevos:** Todos los de arriba (restaurant, menu, stats, reports)

### **Frontend:**

**1. Página: `signup.html`**
- ⏳ Validación frontend antes de enviar
- ⏳ Llamar a `POST /api/auth/register` con todos los datos

**2. Lógica de Login (`auth.js`)**
- ⏳ Al hacer login exitoso, verificar rol del usuario
- ⏳ Si `role === 'owner'`:
  - Guardar `restaurantId` en localStorage
  - Redirigir a `/pages/restaurant-detail.html?id={restaurantId}&mode=owner`
- ⏳ Si `role === 'user'`:
  - Redirigir a `/pages/dashboard-user.html` (normal)

**3. Página: `restaurant-detail.html` (Modo Owner)**
- ⏳ Detectar parámetro `?mode=owner` en la URL
- ⏳ Mostrar botones de edición si es modo owner:
  - ✏️ "Editar Información" (abre modal/formulario)
  - 📸 "Cambiar Foto" (upload de imagen)
  - ➕ "Agregar Platillo" (en sección de menú)
- ⏳ En cada platillo del menú:
  - ✏️ Botón "Editar" (modal con formulario)
  - 🗑️ Botón "Eliminar" (confirmación)
- ⏳ En cada reseña:
  - 🚩 Botón "Reportar" (modal para seleccionar motivo)
- ⏳ **Ocultar:**
  - ❤️ Botón de favoritos
  - ⭐ Sección de "Dejar reseña"

**4. Modal: Editar Información del Restaurante**
- ⏳ Formulario con campos:
  - Descripción (textarea)
  - Teléfono (input tel)
  - Email (input email)
  - Tipo de cocina (select: Italiana, Mexicana, etc.)
     - Horarios (input text)
- ⏳ Botón "Guardar" → `PUT /api/owner/restaurant`
- ⏳ Toast de confirmación al guardar

**5. Modal: Agregar/Editar Platillo**
- ⏳ Formulario con campos:
  - Nombre (input text, obligatorio)
  - Descripción (textarea)
  - Precio (input number, obligatorio, min 0)
  - Categoría (select: Entrada, Plato Principal, Postre, Bebida)
  - Imagen (input file, opcional)
- ⏳ Si es nuevo → `POST /api/owner/menu`
- ⏳ Si es edición → `PUT /api/owner/menu/:id`
- ⏳ Toast de confirmación

**6. Modal: Reportar Reseña**
- ⏳ Selector de motivo (radio buttons):
  - 🚫 Spam
  - 😡 Contenido ofensivo
  - ❌ Información falsa
  - 📝 Otro (con textarea)
- ⏳ Botón "Reportar" → `POST /api/owner/reviews/:id/report`
- ⏳ Toast: "Reseña reportada. El admin la revisará pronto."

**7. Página: `statistics.html` (Nueva)**
- ⏳ Crear página de estadísticas del restaurante
- ⏳ Cards:
  - ⭐ Rating promedio
  - 📝 Total de reseñas
- ⏳ Gráfica de distribución (Chart.js o similar):
  - Barras o pastel mostrando cantidad por estrellas
- ⏳ Lista de reseñas recientes
- ⏳ Obtener datos de `GET /api/owner/stats`

**8. Header: Dropdown de Usuario**
- ⏳ Si `role === 'owner'`:
  - Cambiar "Favoritos" por "Estadísticas"
  - Link a `/pages/statistics.html`
- ⏳ Si `role === 'user'`:
  - Mantener "Favoritos" normal

**9. Script: `owner.js` (Nuevo)**
- ⏳ Crear archivo para funciones específicas del owner
- ⏳ Funciones:
  - `updateRestaurantInfo(data)`
  - `uploadRestaurantPhoto(file)`
  - `addMenuItem(data)`
  - `updateMenuItem(id, data)`
  - `deleteMenuItem(id)`
  - `reportReview(reviewId, reason, description)`
  - `loadStats()`

---

## ⚠️ Nota Importante sobre la Base de Datos

**Cuando se crea un owner nuevo:**
- El restaurante se crea con **solo 2 campos obligatorios:**
  - `name` (nombre del restaurante)
  - `address` (dirección)

**Los demás campos quedan como `NULL`:**
- `description` → `null`
- `phone` → `null`
- `email` → `null`
- `cuisine_type` → `null`
- `price_range` → `null`
- `opening_hours` → `null`
- `image_url` → imagen por defecto o `null`

**Esto NO es un error de la base de datos.** Es el diseño intencional para permitir que el owner complete la información después de su primer login. La base de datos debe aceptar valores `NULL` en estos campos para que funcione correctamente.
