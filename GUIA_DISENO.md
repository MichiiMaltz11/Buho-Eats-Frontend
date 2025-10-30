# 🎨 Guía de Diseño - Buho Eats

## Paleta de Colores Oficial

### Colores Principales
```css
#3D405B  →  Azul principal
            Uso: Cuadros, elementos principales, textos importantes
            
#588B8B  →  Verde azulado
            Uso: Botones principales, acentos, hover states
```

### Colores de Acción
```css
#06BB0C  →  Verde (Confirmación)
            Uso: Botones de "Aceptar", "Guardar", "Confirmar"
            
#C11D0C  →  Rojo (Cancelación)
            Uso: Botones de "Cancelar", "Eliminar", "Rechazar"
```

### Colores Neutros
```css
#FFFFFF  →  Blanco
            Uso: Fondos de tarjetas, textos sobre fondos oscuros
            
#2C2C2C  →  Negro/Gris oscuro
            Uso: Textos principales, elementos oscuros
            
#F5F5F5  →  Gris claro
            Uso: Fondos alternativos, secciones
```

---

## 📐 Aplicación de Colores

### En CSS Variables
```css
:root {
    --primary-color: #3D405B;      /* Azul principal */
    --secondary-color: #588B8B;    /* Verde azulado */
    --success-color: #06BB0C;      /* Verde confirmación */
    --danger-color: #C11D0C;       /* Rojo cancelación */
    --light-color: #FFFFFF;        /* Blanco */
    --dark-color: #2C2C2C;         /* Negro */
}
```

### En Tailwind CSS
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#3D405B',
                secondary: '#588B8B',
                success: '#06BB0C',
                danger: '#C11D0C',
                light: '#FFFFFF',
                dark: '#2C2C2C',
            }
        }
    }
}
```

---

## 🎯 Uso de Colores por Componente

### Botones

**Botón Principal (Acción primaria)**
```html
<button class="bg-secondary hover:bg-opacity-90 text-white">
    Acción Principal
</button>
```
Color: #588B8B (Verde azulado)

**Botón de Confirmación**
```html
<button class="bg-success hover:bg-opacity-90 text-white">
    Guardar / Confirmar
</button>
```
Color: #06BB0C (Verde)

**Botón de Cancelación**
```html
<button class="bg-danger hover:bg-opacity-90 text-white">
    Cancelar / Eliminar
</button>
```
Color: #C11D0C (Rojo)

**Botón Secundario (Outline)**
```html
<button class="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white">
    Acción Secundaria
</button>
```
Color: #588B8B (Verde azulado)

### Tarjetas y Contenedores

**Tarjeta Principal**
```html
<div class="bg-white border-2 border-primary rounded-lg shadow-lg">
    Contenido
</div>
```
Fondo: #FFFFFF (Blanco)
Borde: #3D405B (Azul principal)

**Sección Destacada**
```html
<div class="bg-primary text-white rounded-lg p-6">
    Contenido destacado
</div>
```
Fondo: #3D405B (Azul principal)

### Textos

**Título Principal**
```html
<h1 class="text-primary font-bold text-4xl">
    Buho Eats
</h1>
```
Color: #3D405B (Azul principal)

**Texto Normal**
```html
<p class="text-gray-700">
    Texto descriptivo
</p>
```
Color: #333333 (Gris oscuro)

**Enlaces**
```html
<a href="#" class="text-secondary hover:underline">
    Enlace
</a>
```
Color: #588B8B (Verde azulado)

---

## 🖼️ Assets de Diseño

### Logos
```
assets/img/logo.png          ← Logo principal (icono/símbolo)
assets/img/logo-text.png     ← Tipografía "Buho Eats"
```

**Especificaciones:**
- Formato: PNG con transparencia
- Logo: 300x300px mínimo
- Tipografía: 400x100px aproximadamente

### Imagen de Fondo
```
assets/img/background.jpg    ← Imagen de fondo de las páginas
```

**Especificaciones:**
- Formato: JPG o PNG
- Tamaño: 1920x1080px o superior
- Peso: Menos de 2MB (optimizado)

---

## 🎨 Efectos y Sombras

### Sombras
```css
/* Sombra ligera */
box-shadow: 0 2px 10px rgba(61, 64, 91, 0.1);

/* Sombra pronunciada */
box-shadow: 0 4px 20px rgba(61, 64, 91, 0.15);

/* Sombra en hover */
box-shadow: 0 8px 30px rgba(61, 64, 91, 0.2);
```

### Bordes Redondeados
```css
border-radius: 8px;   /* Standard */
border-radius: 12px;  /* Tarjetas grandes */
border-radius: 50%;   /* Círculos (avatares, iconos) */
```

### Transiciones
```css
transition: all 0.3s ease;           /* Suave */
transition: transform 0.2s ease;     /* Rápida (botones) */
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind)
```
sm:  640px   → Tablets pequeñas
md:  768px   → Tablets
lg:  1024px  → Laptops
xl:  1280px  → Desktops
2xl: 1536px  → Pantallas grandes
```

### Ejemplo de uso
```html
<div class="w-full md:w-1/2 lg:w-1/3">
    <!-- 100% en móvil, 50% en tablet, 33% en desktop -->
</div>
```

---

## 🎭 Estados de Componentes

### Botones

**Normal**
```css
background: #588B8B;
```

**Hover**
```css
background: #588B8B;
opacity: 0.9;
transform: scale(1.05);
```

**Active/Pressed**
```css
background: #4A7A7A;
transform: scale(0.98);
```

**Disabled**
```css
background: #CCCCCC;
cursor: not-allowed;
opacity: 0.6;
```

### Inputs

**Normal**
```css
border: 1px solid #D1D5DB;
```

**Focus**
```css
border: 2px solid #588B8B;
ring: 2px solid rgba(88, 139, 139, 0.2);
```

**Error**
```css
border: 2px solid #C11D0C;
```

**Success**
```css
border: 2px solid #06BB0C;
```

---

## ✨ Patrones de Diseño

### Patrón de fondo decorativo
```css
background-image: url("data:image/svg+xml,...");
/* Patrón sutil con el color primario al 5% de opacidad */
```

### Overlay para legibilidad
```css
/* Sobre imágenes de fondo */
background: rgba(255, 255, 255, 0.85);
```

---

## 📋 Checklist de Personalización

- [ ] Logos colocados en `assets/img/`
- [ ] Imagen de fondo agregada
- [ ] Colores verificados en todas las páginas
- [ ] Botones usando los colores correctos
- [ ] Textos legibles sobre fondos
- [ ] Hover states funcionando
- [ ] Responsive design probado

---

## 🚀 Próximos Pasos

Cuando crees nuevas páginas o componentes:

1. **Usa la paleta de colores definida**
2. **Mantén consistencia** en botones y tarjetas
3. **Prueba en diferentes dispositivos**
4. **Verifica accesibilidad** (contraste de colores)

---

**Archivo creado:** 29 de octubre de 2025
**Paleta oficial de Buho Eats** 🦉
