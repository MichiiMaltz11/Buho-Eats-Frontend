# 🎨 Guía para Personalizar el Logo y Colores

## ✅ Cambios ya realizados:

### 1. **Index.html actualizado**
- ✅ Ahora redirige automáticamente al login
- ✅ No más pantalla de inicio innecesaria

### 2. **Color azul distintivo aplicado**
- ✅ Color #3D405B actualizado en todas las páginas
- ✅ Cambios en: `main.css`, `login.html`, `signup.html`

---

## 🖼️ Cómo agregar tus propios logos

### Paso 1: Colocar las imágenes

Copia tus imágenes de logo a la carpeta correcta:

```
assets/
  └── img/
      ├── logo.png               ← Tu logo principal (negro/oscuro)
      ├── logo-text.png          ← Tu tipografía "Buho Eats" (negro/oscuro)
      ├── logo-light.png         ← Tu logo principal (blanco/light) para fondos oscuros
      └── logo-text-light.png    ← Tu tipografía "Buho Eats" (blanco/light) para fondos oscuros
```

**Uso:**
- `logo.png` y `logo-text.png` → Para páginas con fondo claro (Login, Sign Up)
- `logo-light.png` y `logo-text-light.png` → Para header y footer con fondo azul oscuro

### Paso 2: Formatos recomendados

**Para los logos principales (oscuros):**
- Formato: PNG con fondo transparente
- Tamaño: 300x300px mínimo (se ajusta automáticamente)
- Peso: Menos de 100KB idealmente
- Color: Negro o color oscuro (para fondos claros)

**Para los logos light (blancos):**
- Formato: PNG con fondo transparente
- Tamaño: 300x300px mínimo
- Peso: Menos de 100KB idealmente
- Color: Blanco o color claro (para fondos oscuros azules)

**Para la tipografía:**
- Formato: PNG con fondo transparente
- Tamaño: 400x100px aproximadamente (ancho x alto)
- Peso: Menos de 50KB idealmente
- Versiones: Normal (oscura) y Light (blanca)

---

## 📍 Ubicación de las imágenes en el código

### Login y Sign Up (fondo claro):
```html
<!-- Logo principal oscuro -->
<img src="../assets/img/logo.png" alt="Buho Eats Logo">

<!-- Tipografía oscura -->
<img src="../assets/img/logo-text.png" alt="Buho Eats">
```

### Header y Footer (fondo azul oscuro):
```html
<!-- Logo principal blanco/light -->
<img src="../assets/img/logo-light.png" alt="Buho Eats Logo">

<!-- Tipografía blanca/light -->
<img src="../assets/img/logo-text-light.png" alt="Buho Eats">
```

### Si usas nombres diferentes:

**Opción A:** Renombra tus archivos a `logo.png` y `logo-text.png`

**Opción B:** Cambia las rutas en el código:

1. Abre `pages/login.html`
2. Busca `../assets/img/logo.png`
3. Cámbialo por tu nombre, ejemplo: `../assets/img/mi-logo.png`
4. Haz lo mismo en `pages/signup.html`

---

## 🎨 Sistema de Fallback (respaldo)

El código tiene un **sistema inteligente de fallback**:

```
1. Intenta cargar tu logo → Si existe: ✅ Muestra tu logo
2. Si no existe → ⚠️ Muestra el emoji 🦉 como respaldo
```

Esto significa que:
- ✅ **Funcionará** aunque no pongas el logo aún
- ✅ **Se verá profesional** cuando agregues tus imágenes
- ✅ **No habrá errores** ni imágenes rotas

---

## 🔧 Personalización adicional

### Cambiar el tamaño del logo:

En `login.html` y `signup.html`, busca:

```html
<!-- Logo principal -->
<img src="../assets/img/logo.png" class="mx-auto h-24 w-auto">
```

Cambia `h-24` por:
- `h-16` = Más pequeño
- `h-32` = Más grande
- `h-40` = Mucho más grande

### Cambiar el tamaño de la tipografía:

```html
<!-- Tipografía -->
<img src="../assets/img/logo-text.png" class="mx-auto h-12 mb-2">
```

Cambia `h-12` por el tamaño que prefieras.

---

## 🎯 Colores actualizados

Tu paleta de colores oficial de Buho Eats:

```css
Azul principal:  #3D405B  ← Cuadros y elementos principales
Verde azulado:   #588B8B  ← Botones y acentos
Verde (éxito):   #06BB0C  ← Botones de confirmación
Rojo (peligro):  #C11D0C  ← Botones de cancelación
Blanco:          #FFFFFF  ← Fondos y textos claros
Negro:           #2C2C2C  ← Textos oscuros
```

---

## � Checklist

- [ ] Tengo mi logo principal en versión oscura
- [ ] Tengo mi logo principal en versión blanca/light
- [ ] Tengo mi tipografía en versión oscura
- [ ] Tengo mi tipografía en versión blanca/light
- [ ] Los archivos están en formato PNG con transparencia
- [ ] Los copié a `assets/img/` con los nombres correctos:
  - `logo.png` (oscuro)
  - `logo-light.png` (blanco)
  - `logo-text.png` (oscuro)
  - `logo-text-light.png` (blanco)
- [ ] Refresqué el navegador para ver los cambios

---

## 💡 Tips

1. **PNG con transparencia** se ve mejor que JPG
2. **Optimiza las imágenes** antes de usarlas (usa TinyPNG.com)
3. **Guarda tus originales** en alta resolución aparte
4. **Prueba diferentes tamaños** hasta que se vea bien

---

## 🚀 Siguiente paso

1. Copia tus logos a `assets/img/`
2. Refresca el navegador (Ctrl + F5)
3. ¡Listo! Deberías ver tus logos

Si tienes problemas:
- Verifica que el nombre del archivo sea correcto
- Asegúrate de que esté en la carpeta correcta
- Abre la consola del navegador (F12) para ver errores

---

**¿Necesitas ayuda?** Pregúntame y te ayudo a ajustar el tamaño, posición o lo que necesites! 🦉
