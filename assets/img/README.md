# Guía de Imágenes - Buho Eats

## 📁 Estructura de Carpetas

```
assets/img/
├── restaurants/
│   ├── default/          ← 10 imágenes de restaurantes (descargadas)
│   └── uploads/          ← Imágenes subidas por usuarios (vacío por ahora)
└── menu/                 ← 13 imágenes de items del menú (descargadas)
```

## ✅ Imágenes de Restaurantes Descargadas (10/10)

| Archivo | Descripción | Tamaño | Uso Sugerido |
|---------|-------------|--------|--------------|
| `burger-1.jpg` | Hamburguesa gourmet | 71 KB | Restaurante de hamburguesas |
| `pizza-1.jpg` | Pizza italiana | 128 KB | Pizzería |
| `sushi-1.jpg` | Sushi japonés | 297 KB | Restaurante japonés |
| `mexican-1.jpg` | Tacos mexicanos | 125 KB | Restaurante mexicano |
| `italian-1.jpg` | Pasta italiana | 111 KB | Restaurante italiano |
| `steak-1.jpg` | Steak house | 63 KB | Asador/Parrilla |
| `chinese-1.jpg` | Comida china | 102 KB | Restaurante chino |
| `seafood-1.jpg` | Mariscos | 318 KB | Restaurante de mariscos |
| `coffee-1.jpg` | Cafetería | 60 KB | Café/Cafetería |
| `dessert-1.jpg` | Postres | 105 KB | Repostería |

**Total descargado:** ~1.4 MB

## ✅ Imágenes de Menú Descargadas (13/14)

### Entradas
- `bruschetta.jpg` - 42 KB
- `caprese.jpg` - 159 KB
- `carpaccio.jpg` - 58 KB

### Platos Principales
- `pasta-carbonara.jpg` - 44 KB
- `lasagna.jpg` - 112 KB
- `ravioli.jpg` - 54 KB
- ⚠️ `risotto.jpg` - **PENDIENTE** (URLs no disponibles)
- `ossobuco.jpg` - 106 KB

### Postres
- `tiramisu.jpg` - 82 KB
- `panna-cotta.jpg` - 71 KB
- `gelato.jpg` - 115 KB

### Bebidas
- `espresso.jpg` - 32 KB
- `wine.jpg` - 39 KB
- `limoncello.jpg` - 26 KB

**Total descargado:** ~940 KB

## 🔧 Próximos Pasos

### FASE 1: ✅ COMPLETADA
- [x] Crear estructura de carpetas
- [x] Descargar 10 imágenes de restaurantes
- [x] Descargar 13 imágenes de menú
- [ ] ⚠️ Pendiente: risotto.jpg (descargar manualmente o usar placeholder)

### FASE 2: Actualizar Base de Datos
- [ ] Modificar `init.sql` para usar rutas locales
- [ ] Crear registros de restaurantes de demostración
- [ ] Crear registros de menú para "La Bella Notte"
- [ ] Ejecutar `npm run init-db` para reinicializar

### FASE 3: Sistema de Upload (Sin Multer)
- [ ] Implementar conversión a Base64 en frontend
- [ ] Implementar guardado de archivos en backend
- [ ] Servir archivos estáticos desde `/public/uploads`
- [ ] Actualizar formularios de creación de restaurantes

## 📝 Rutas de Imágenes

### Para usar en la base de datos:

```sql
-- Restaurantes
imageUrl: '/assets/img/restaurants/default/burger-1.jpg'

-- Menú
imageUrl: '/assets/img/menu/bruschetta.jpg'

-- Uploads de usuarios (después de implementar)
imageUrl: '/uploads/rest_123_1699123456.jpg'
```

### Para usar en HTML:

```html
<!-- Imagen local -->
<img src="/assets/img/restaurants/default/pizza-1.jpg" alt="Pizza">

<!-- Imagen de API (futuro) -->
<img src="${Config.API_URL}/uploads/rest_123.jpg" alt="Restaurant">
```

## ⚠️ Nota Importante

**Risotto pendiente:** Si necesitas la imagen de risotto, puedes:
1. Buscar manualmente una imagen en Unsplash/Pexels
2. Usar otra imagen de pasta como placeholder
3. Copiar una de las existentes y renombrarla

## 🎯 Siguientes Comandos

```bash
# Verificar imágenes descargadas
Get-ChildItem assets\img\restaurants\default
Get-ChildItem assets\img\menu

# Ver tamaños
Get-ChildItem assets\img\restaurants\default | Measure-Object -Property Length -Sum
Get-ChildItem assets\img\menu | Measure-Object -Property Length -Sum
```

---

**Fecha:** Noviembre 6, 2025  
**Estado:** FASE 1 COMPLETADA (23/24 imágenes)
