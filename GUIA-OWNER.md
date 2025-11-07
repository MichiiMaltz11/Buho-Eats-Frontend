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


## 📝 Resumen de tu trabajo

### **Backend (base de datos y API):**
1. 📝 **Modificar Sign Up:** Asignacion de roles (user/owner)
2. 🍽️ **Crear restaurante al registrar owner:** Insertar en tabla `restaurants` con `name` y `address` (campos obligatorios)
3. 🔗 **Asociar restaurante con owner:** Guardar `owner_id` en la tabla `restaurants`
4. 🚩 **Tabla de reportes:** Crear tabla `review_reports` para flagear reseñas
5. 📊 **Endpoints de estadísticas:** API para obtener rating, distribución de reseñas, engagement

### **Frontend :**
1. 📋 **Formulario Sign Up extendido:**
   - Validar que esos 2 campos (nombre y direccion) sean obligatorios para owners
   
2. ✏️ **Editar información del restaurante:**
   - Formulario para completar campos faltantes después del registro
   - Campos: descripción, teléfono, email, tipo cocina, precios, horarios
   
3. 📸 **Cambiar foto del restaurante:** 
   - Botón para subir nueva imagen principal
   
4. 🍽️ **CRUD de menú completo:**
   - Agregar platillos (nombre, descripción, precio, categoría, imagen)
   - Editar platillos existentes
   - Eliminar platillos
   
5. 🚩 **Reportar reseñas:**
   - Botón "Reportar" en cada reseña
   - Modal para seleccionar motivo (spam, ofensivo, falso)
   - Enviar reporte al backend para que admin lo revise
   
6. 📊 **Página de estadísticas:**
   - Rating promedio del restaurante
   - Total de reseñas
   - Gráfica de distribución (1⭐ a 5⭐)
   - Engagement y visitas
   
7. 🚫 **Restricciones UI:**
   - Ocultar botón de favoritos (❤️) cuando el usuario es owner
   - Deshabilitar sección de "Dejar reseña" en el restaurante
   - Cambiar "Favoritos" por "Estadísticas" en el dropdown 
   
8. 🏠 **Redirección automática:**
   - Al hacer login, si el usuario es owner → redirigir a la página de SU restaurante
   - NO mostrar dashboard general de restaurantes

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
