# 🦉 Guía para Admin - Buho Eats

## 📋 Información de Cuenta

**Credenciales de Administrador Default:**
- **Email:** `admin@buhoeats.com`
- **Contraseña:** `Admin123!`
- **Rol:** Admin (Administrador del sistema)

---

## 🎯 ¿Qué es un Admin?

Como **Admin**, eres el **moderador y gestor principal** de toda la plataforma Buho Eats.

**Tu responsabilidad es:**
- 🚩 Moderar reseñas reportadas por owners
- 👥 Gestionar usuarios (strikes, bans)
- 📊 Monitorear estadísticas generales del sistema
- ⚖️ Mantener la comunidad segura y funcional

---

## 🚀 Navegacion principal

### 1. **Iniciar sesión**
   - Ve a la página de login: `http://localhost:5500/pages/login.html`
   - Ingresa tu email y contraseña
   - Serás redirigido al **Dashboard de Administración**

### 2. **Vista del Dashboard**
   Al entrar verás tu panel de control dividido en secciones:
   
   **📊 Estadísticas Generales** (parte superior)
   - Total de usuarios registrados
   - Total de restaurantes activos
   - Total de reseñas publicadas
   - **Reportes pendientes** (badge rojo si hay)

   **🚩 Reseñas Reportadas** (sección principal)
   - Lista de reseñas que los owners han flageado
   - Aquí tomas decisiones: aprobar, eliminar, o dar strikes (maximo 3)

   **👥 Gestión de Usuarios**
   - Tabla con todos los usuarios de la plataforma
   - Control de strikes y baneos 

   **🍽️ Gestión de Restaurantes**
   - Lista de restaurantes en la plataforma

### 3. **Menú de navegación (Dropdown)**
   Al hacer clic en tu foto de perfil:
   - 👤 **Mi Perfil** (editar datos personales)
   - 🚪 **Cerrar Sesión**

---

## 💬 Funcionalidades Principales

### 🚩 **1. Moderar Reseñas Reportadas**

Esta es tu **tarea principal**. Los owners pueden reportar reseñas inapropiadas.

**Cada reporte muestra:**
- 🍽️ **Restaurante** donde se publicó
- 👤 **Usuario** que escribió la reseña
- 📝 **Contenido** de la reseña
- ⚠️ **Motivo** del reporte (spam, ofensivo, falso)
- 🏢 **Owner** que la reportó
- 📅 **Fecha** del reporte

**Acciones que puedes tomar:**

#### ✅ **Aprobar** (dejar la reseña)
- La reseña es válida, el reporte no procede
- La reseña permanece visible
- El reporte se marca como "resuelto - aprobado"
- No se aplican sanciones

#### ❌ **Eliminar** (borrar la reseña)
- La reseña es inapropiada pero no grave
- Se elimina de la plataforma
- El usuario **NO** recibe strike
- Útil para: comentarios fuera de lugar, etc.

#### 🔨 **Eliminar + Strike**
- La reseña es inapropiada Y grave
- Se elimina de la plataforma
- El usuario **SÍ** recibe un strike
- Útil para: spam, lenguaje ofensivo, contenido falso/malicioso

**Ejemplo de interfaz:**
```
┌─────────────────────────────────────────────────┐
│ ⚠️ Reporte #1 - La Bella Notte                  │
│                                                  │
│ Usuario: @maria_gomez (0 strikes)               │
│ Reseña: "Horrible, nunca vayan, es una         │
│          porquería absoluta..."                 │
│                                                  │
│ Motivo: Contenido ofensivo                      │
│ Reportó: owner@buhoeats.com (Marco Rossi)      │
│ Fecha: 07/11/2025 - 14:30                      │
│                                                  │
│ [✅ Aprobar] [❌ Eliminar] [🔨 Eliminar+Strike] │
└─────────────────────────────────────────────────┘
```

---

### ⚠️ **2. Sistema de Strikes**

**Reglas del sistema:**
- **1 strike:** Primera falta
- **2 strikes:** Segunda falta
- **3 strikes:** **AUTO-BAN** (la cuenta se desactiva automáticamente)

**¿Cuándo dar un strike?**
- ✅ Reseñas con lenguaje ofensivo/vulgar
- ✅ Spam o comentarios sin sentido
- ✅ Reseñas falsas o maliciosas
- ✅ Abuso del sistema de reportes

**Gestión de Strikes:**
- Ver cuántos strikes tiene cada usuario


---

### 🚫 **3. Banear Usuarios**

**Banear usuario:**
- Puedes banear **directamente** sin esperar 3 strikes
- Para casos graves: amenazas, discriminación, acoso
- Usuario baneado:
  - ❌ **NO puede hacer login**
  - ❌ Sus reseñas se eliminan 
  - ⚠️ Se le indica al intentar iniciar al usuario un mensaje de "Cuenta desactivada"

**Interfaz de gestión de usuarios:**
```
┌─────────────────────────────────────────┐
│ 👥 GESTIÓN DE USUARIOS                  │
│ [Todos ▼] Buscar: [___________] [🔍]    │
│                                          │
│ Nombre          │ Email        │ Strikes │
│─────────────────┼──────────────┼─────────┼
│ Juan Pérez      │ juan@...     │ 2/3 ⚠️  │
│ Ana López       │ ana@...      │ 0/3     │
│ Carlos (BAN)    │ carlos@...   │ 3/3 ❌  │ 
└───────────────────────────────────────────┘

Iconos:
🔨 = Dar Strike
🚫 = Banear
✅ = Desbanear
```

---

### 🍽️ **4. Gestión de Restaurantes**

**Ver todos los restaurantes:**
- Lista de los restaurantes 
- Información del owner
- Total de reseñas recibidas

### 📊 **5. Estadísticas del Sistema**

En la parte superior del dashboard verás cards con:

**👥 Total de Usuarios**

**🍽️ Total de Restaurantes**

**📝 Total de Reseñas**
- Reseñas publicadas

**🚩 Reportes Pendientes**
- Número de reseñas reportadas sin revisar
- **Badge rojo** si hay reportes pendientes

---

## 🗄️ Base de Datos y API

### **📊 Tabla: `review_reports` (NUEVA - Crear)**

Esta tabla guarda los reportes de reseñas que los owners flagean:

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

CREATE INDEX IF NOT EXISTS idx_reports_review ON review_reports(review_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON review_reports(status);
```

**Campos:**
- `review_id`: ID de la reseña reportada
- `reporter_id`: ID del owner que reportó (debe ser owner del restaurante)
- `reason`: Motivo del reporte (spam, ofensivo, falso, otro)
- `description`: Descripción adicional (opcional)
- `status`: Estado del reporte (pendiente/aprobado/rechazado)
- `resolved_at`: Fecha en que el admin resolvió
- `resolved_by`: ID del admin que resolvió

### **👥 Tabla: `users` (Modificar)**

Agregar campo de strikes a la tabla existente:

```sql
ALTER TABLE users ADD COLUMN strikes INTEGER DEFAULT 0 CHECK(strikes >= 0 AND strikes <= 3);
```

### **🔧 Endpoints de API Necesarios**

#### **1. Obtener reportes pendientes** (Admin)
```
GET /api/admin/reports?status=pendiente
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "review": {
        "id": 45,
        "rating": 1,
        "comment": "Horrible, nunca vayan...",
        "user": {
          "id": 12,
          "name": "María Gómez",
          "email": "maria@example.com",
          "strikes": 0
        },
        "restaurant": {
          "id": 1,
          "name": "La Bella Notte"
        }
      },
      "reporter": {
        "id": 2,
        "name": "Marco Rossi",
        "email": "owner@buhoeats.com"
      },
      "reason": "ofensivo",
      "description": "Lenguaje inapropiado",
      "created_at": "2025-11-07T14:30:00Z"
    }
  ],
  "total": 3
}
```

#### **2. Aprobar reporte** (Admin)
```
POST /api/admin/reports/:reportId/approve
```
**Request Body:**
```json
{
  "adminId": 1
}
```
**Acción:**
- Marca el reporte como `status = 'aprobado'`
- La reseña permanece visible
- NO se da strike al usuario

#### **3. Eliminar reseña sin strike** (Admin)
```
POST /api/admin/reports/:reportId/reject-review
```
**Request Body:**
```json
{
  "adminId": 1
}
```
**Acción:**
- Marca el reporte como `status = 'rechazado'`
- Elimina la reseña (`DELETE FROM reviews WHERE id = ?`)
- NO se da strike al usuario

#### **4. Eliminar reseña CON strike** (Admin)
```
POST /api/admin/reports/:reportId/reject-with-strike
```
**Request Body:**
```json
{
  "adminId": 1,
  "userId": 12
}
```
**Acción:**
- Marca el reporte como `status = 'rechazado'`
- Elimina la reseña
- Incrementa strikes del usuario: `UPDATE users SET strikes = strikes + 1 WHERE id = ?`
- **Si strikes >= 3:** Auto-ban → `UPDATE users SET is_active = 0 WHERE id = ?`

#### **5. Obtener lista de usuarios** (Admin)
```
GET /api/admin/users?page=1&limit=10&search=&filter=all
```
**Filtros:**
- `all`: Todos los usuarios
- `banned`: Solo usuarios baneados (is_active = 0)
- `with-strikes`: Usuarios con strikes > 0

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com",
      "role": "user",
      "strikes": 2,
      "isActive": 1,
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 156,
    "page": 1,
    "pages": 16
  }
}
```

#### **6. Banear usuario manualmente** (Admin)
```
POST /api/admin/users/:userId/ban
```
**Request Body:**
```json
{
  "adminId": 1,
  "reason": "Acoso a otros usuarios"
}
```
**Acción:**
- `UPDATE users SET is_active = 0 WHERE id = ?`
- Opcionalmente: Eliminar todas sus reseñas

#### **7. Desbanear usuario** (Admin)
```
POST /api/admin/users/:userId/unban
```
**Request Body:**
```json
{
  "adminId": 1
}
```
**Acción:**
- `UPDATE users SET is_active = 1, strikes = 0 WHERE id = ?`

#### **8. Obtener estadísticas generales** (Admin)
```
GET /api/admin/stats
```
**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 156,
    "totalRestaurants": 5,
    "totalReviews": 340,
    "pendingReports": 3,
    "bannedUsers": 2
  }
}
```

#### **9. Obtener lista de restaurantes** (Admin)
```
GET /api/admin/restaurants?page=1&limit=10
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "La Bella Notte",
      "owner": {
        "id": 2,
        "name": "Marco Rossi",
        "email": "owner@buhoeats.com"
      },
      "rating": 4.5,
      "totalReviews": 45,
      "isActive": 1
    }
  ]
}
```

### **🔐 Middleware de Autorización**

Todos los endpoints de admin deben validar:
```javascript
// middleware/adminAuth.js
function requireAdmin(req, res, next) {
    const user = req.user; // Del JWT
    
    if (!user || user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Acceso denegado. Se requiere rol de administrador.'
        });
    }
    
    next();
}
```

### **📝 Validaciones Backend**

**Al reportar una reseña (Owner):**
1. Verificar que el usuario sea owner
2. Verificar que el restaurante pertenezca a ese owner
3. Verificar que la reseña exista
4. No permitir duplicados (mismo review_id + reporter_id)

**Al moderar (Admin):**
1. Verificar que el usuario sea admin
2. Verificar que el reporte esté pendiente
3. Si se da strike, validar que el usuario no sea admin u owner
4. Al llegar a 3 strikes, desactivar automáticamente

---

## 🎭 Escenarios de Prueba

### **Escenario 1: Revisar reporte de reseña**
1. Inicia sesión como admin
2. Ve a la sección **"Reseñas Reportadas"**
3. Lee el contenido de la reseña reportada
4. Revisa el motivo del reporte
5. Decide: ¿Es válido el reporte?
   - Si NO → **Aprobar** la reseña
   - Si SÍ (leve) → **Eliminar** sin strike
   - Si SÍ (grave) → **Eliminar + Strike**
6. Si llega a 3/3 → **Auto-ban**


### **Escenario 2: Ver estadísticas generales**
1. Observa los cards en la parte superior del dashboard
2. Revisa:
   - ¿Cuántos usuarios hay?
   - ¿Cuántos restaurantes?
   - ¿Hay reportes pendientes?
3. Si hay badge rojo → revisa reportes inmediatamente

---

## 🔍 Qué buscar / Probar

### ✅ **Funcionalidades que debes implementar:**

**�️ Base de Datos:**
- ⏳ Crear tabla `review_reports`
- ⏳ Agregar campo `strikes` a tabla `users`
- ⏳ Crear índices necesarios

**🔌 Backend (API):**
- ⏳ Endpoint: GET `/api/admin/reports` (obtener reportes)
- ⏳ Endpoint: POST `/api/admin/reports/:id/approve` (aprobar reporte)
- ⏳ Endpoint: POST `/api/admin/reports/:id/reject-review` (eliminar sin strike)
- ⏳ Endpoint: POST `/api/admin/reports/:id/reject-with-strike` (eliminar + strike)
- ⏳ Endpoint: GET `/api/admin/users` (lista de usuarios con paginación)
- ⏳ Endpoint: POST `/api/admin/users/:id/ban` (banear usuario)
- ⏳ Endpoint: POST `/api/admin/users/:id/unban` (desbanear usuario)
- ⏳ Endpoint: GET `/api/admin/stats` (estadísticas generales)
- ⏳ Endpoint: GET `/api/admin/restaurants` (lista de restaurantes)
- ⏳ Middleware `requireAdmin()` para proteger rutas

**🎨 Frontend:**
- ⏳ Página dashboard de admin (`dashboard-admin.html`)
- ⏳ Sección de reseñas reportadas con botones de acción
- ⏳ Tabla de usuarios con paginación y filtros
- ⏳ Cards de estadísticas en la parte superior
- ⏳ Lista de restaurantes
- ⏳ Toast de confirmación al tomar acciones
- ⏳ Mostrar strikes de usuarios (0/3, 1/3, 2/3, 3/3)
- ⏳ Indicador visual cuando usuario tiene 2 strikes (advertencia)
- ⏳ Badge rojo en reportes pendientes

---

## ❌ Restricciones del Admin

**Como Admin, NO debes:**
- ❌ Dejar reseñas (tu rol es moderar, no participar)
- ❌ Agregar restaurantes a favoritos
- ❌ Explorar como usuario normal (tu dashboard es diferente)

**Tu enfoque es 100% moderación y gestión.**

---

## 🎨 Diseño Sugerido del Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  🦉 BUHO EATS                                           │
│                                  [Admin ▼]              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📊 ESTADÍSTICAS GENERALES                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ 👥 Usuarios │ │ 🍽️ Restaur. │ │ 🚩 Reportes │      │
│  │     156     │ │      5      │ │   3 🔴      │      │
│  │ ─────────── │ │ ─────────── │ │ ─────────── │ 
                                                         │
│  🚩 RESEÑAS REPORTADAS (3 pendientes)                  │
│  ┌────────────────────────────────────────────────┐    │
│  │ ⚠️ Reporte #1 - La Bella Notte                 │    │
│  │ Usuario: @maria_gomez (0 strikes)              │    │
│  │ Reseña: "Horrible, nunca vayan, es una        │    │
│  │          porquería absoluta..."                │    │
│  │ Motivo: Contenido ofensivo                     │    │
│  │ Reportó: Marco Rossi (owner@buhoeats.com)     │    │
│  │ Fecha: 07/11/2025 - 14:30                     │    │
│  │                                                 │    │
│  │ [✅ Aprobar] [❌ Eliminar] [🔨 Eliminar+Strike]│    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ ⚠️ Reporte #2 - Burger Paradise                │    │
│  │ Usuario: @carlos_ruiz (2 strikes) ⚠️           │    │
│  │ Reseña: "SPAM SPAM SPAM visiten mi            │    │
│  │          página web..."                        │    │
│  │ Motivo: Spam                                   │    │
│  │ Reportó: owner@buhoeats.com                   │    │
│  │                                                 │    │
│  │ [✅ Aprobar] [❌ Eliminar] [🔨 Eliminar+Strike]│    │
│  │                            (Causará BAN! ⚠️)   │    │
│  └────────────────────────────────────────────────┘ 
                   < 1 [2] >          │
   │
│                                                          │
│  👥 GESTIÓN DE USUARIOS                                 │
│  [Todos ▼] [Buscar: ___________] [🔍]                  │
│  ┌────────────────────────────────────────────┐         │
│  │ Nombre      │ Email       │ Rol   │ Strikes│    
│  │─────────────┼─────────────┼───────┼────────┼        │
│  │ Juan Pérez  │ juan@...    │ user  │ 2/3 ⚠️ │        │
│  │ Ana López   │ ana@...     │ user  │ 0/3    │         │
│  │ Marco Rossi │ owner@...   │ owner │ 0/3    │         │
│  │ Carlos (BAN)│ carlos@...  │ user  │ 3/3 ❌ │        │
│  └────────────────────────────────────────────┘        │
│  Mostrando 4 de 156 usuarios 
                   < 1 [2] >          │
│                                                         │
│  🍽️ GESTIÓN DE RESTAURANTES                            │
│  ┌──────────────────────────────────  │
│  │ Restaurante       │ Owner       │  │
│  │───────────────────┼─────────────┼ │
│  │ La Bella Notte    │ Marco Rossi │   │
│  │ Burger Paradise   │ Marco Rossi │   │
│  │ Pizza Napoletana  │ Marco Rossi │    │
│  │ Sushi Master      │ Marco Rossi │  │
│  │ Taquería El Güero │ Marco Rossi │ │
│  └──────────────────────────────────────┘  
                   < 1 [2] >          │
 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```