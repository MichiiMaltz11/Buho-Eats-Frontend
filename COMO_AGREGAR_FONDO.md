# 🖼️ Guía para Agregar Imagen de Fondo

## ✅ Cambios ya realizados:

### 1. **Paleta de colores actualizada**
```css
Azul principal:  #3D405B  ← Cuadros y elementos principales
Verde azulado:   #588B8B  ← Botones y acentos
Verde (éxito):   #06BB0C  ← Botones de confirmación
Rojo (peligro):  #C11D0C  ← Botones de cancelación
Blanco:          #FFFFFF
Negro:           #2C2C2C
```

### 2. **Código de imagen de fondo agregado**
- ✅ En `assets/css/main.css`
- ✅ En `pages/login.html`
- ✅ En `pages/signup.html`

---

## 🎨 Cómo agregar tu imagen de fondo

### Paso 1: Coloca tu imagen de fondo

Copia tu imagen de fondo a la carpeta:

```
assets/
  └── img/
      └── background.jpg    ← Coloca aquí tu imagen de fondo
```

### Paso 2: Formatos recomendados

**Formato:**
- JPG o PNG
- JPG si es foto (menor tamaño)
- PNG si tiene transparencias

**Tamaño:**
- Ancho: 1920px o superior (Full HD)
- Alto: 1080px o superior
- Resolución optimizada: No más de 2MB

**Optimización:**
- Usa TinyPNG.com o TinyJPG.com para reducir peso
- Mantén la calidad pero reduce el tamaño del archivo

---

## 🔧 Opciones de personalización

### Opción 1: Cambiar el nombre de la imagen

Si tu imagen se llama diferente (ej: `mi-fondo.jpg`), actualiza las rutas:

**En `assets/css/main.css`:**
```css
body {
    background-image: url('../img/mi-fondo.jpg');
}
```

**En `pages/login.html` y `pages/signup.html`:**
```css
body {
    background-image: url('../assets/img/mi-fondo.jpg');
}
```

### Opción 2: Ajustar la opacidad del overlay

El overlay (capa blanca semi-transparente) mejora la legibilidad del texto.

**En `pages/login.html` y `pages/signup.html`, busca:**
```css
body::before {
    background: rgba(255, 255, 255, 0.85);  ← Cambia 0.85
}
```

**Valores:**
- `0.0` = Completamente transparente (se ve todo el fondo)
- `0.5` = 50% transparente
- `0.85` = 85% transparente (recomendado para legibilidad)
- `1.0` = Completamente blanco (no se ve el fondo)

### Opción 3: Cambiar color del overlay

Si prefieres un overlay de otro color:

```css
/* Overlay azul claro */
background: rgba(61, 64, 91, 0.15);  /* Tu azul con transparencia */

/* Overlay negro */
background: rgba(0, 0, 0, 0.3);

/* Overlay sin color (más nítido) */
background: transparent;  /* Sin overlay */
```

### Opción 4: Ajustar posición del fondo

```css
body {
    background-position: center;      /* Centrado (default) */
    /* O usa: */
    background-position: top;         /* Arriba */
    background-position: bottom;      /* Abajo */
    background-position: left;        /* Izquierda */
    background-position: right;       /* Derecha */
}
```

### Opción 5: Cambiar tamaño del fondo

```css
body {
    background-size: cover;           /* Cubre toda la pantalla (default) */
    /* O usa: */
    background-size: contain;         /* Se ajusta al contenedor */
    background-size: 100% 100%;       /* Estira para llenar */
}
```

### Opción 6: Fondo fijo o con scroll

```css
body {
    background-attachment: fixed;     /* Fijo (no se mueve al hacer scroll) */
    /* O usa: */
    background-attachment: scroll;    /* Se mueve con el scroll */
}
```

---

## 🎯 Configuración recomendada

Para la mejor experiencia visual:

```css
body {
    background-image: url('../assets/img/background.jpg');
    background-size: cover;              /* Cubre toda la pantalla */
    background-position: center;         /* Centrado */
    background-attachment: fixed;        /* Fijo, no se mueve */
    background-repeat: no-repeat;        /* No se repite */
}

body::before {
    background: rgba(255, 255, 255, 0.85);  /* Overlay blanco 85% */
}
```

---

## 💡 Tips importantes

### 1. **Sin imagen de fondo todavía**
- ✅ No hay problema, se mostrará fondo blanco
- ✅ El código ya está listo, solo agrega la imagen

### 2. **Optimizar rendimiento**
- Comprime tu imagen antes de usarla
- Usa formato JPG para fotos (menor tamaño)
- Mantén el archivo bajo 2MB

### 3. **Testing**
- Prueba con diferentes niveles de overlay (0.5, 0.7, 0.85)
- Asegúrate de que el texto sea legible
- Verifica en diferentes tamaños de pantalla

### 4. **Fallback**
- Si la imagen no carga, se mostrará fondo blanco
- No habrá errores visibles

---

## 📂 Estructura de archivos de imagen

```
assets/
  └── img/
      ├── background.jpg      ← Imagen de fondo
      ├── logo.png           ← Logo principal
      ├── logo-text.png      ← Tipografía
      └── README.txt         ← Instrucciones
```

---

## 🚀 Checklist

- [ ] Tengo mi imagen de fondo lista
- [ ] La imagen está optimizada (menos de 2MB)
- [ ] La copié a `assets/img/background.jpg`
- [ ] Refresqué el navegador (Ctrl + F5)
- [ ] Ajusté el overlay si es necesario
- [ ] El texto se lee claramente

---

## 🔍 Troubleshooting

### "No veo la imagen de fondo"
1. Verifica que el archivo esté en `assets/img/`
2. Verifica el nombre: debe ser exactamente `background.jpg` o actualiza la ruta
3. Refresca con Ctrl + F5 (limpia caché)
4. Abre la consola (F12) y busca errores 404

### "La imagen se ve pixelada"
- Tu imagen es muy pequeña
- Usa una imagen de al menos 1920x1080px

### "La imagen pesa mucho"
- Comprime con TinyJPG.com
- Reduce la calidad al 80-85%

### "No se lee bien el texto"
- Aumenta el overlay: `rgba(255, 255, 255, 0.9)`
- O usa overlay oscuro: `rgba(0, 0, 0, 0.5)`

---

**¡Listo!** Solo copia tu imagen y refresca el navegador 🎨
