# 📦 Instrucciones para Usar Tailwind CSS Offline

## Problema
En tu proyecto de seguridad, la VM **NO tendrá acceso a Internet**, por lo que no podrás usar el CDN de Tailwind directamente.

## Soluciones

### ✅ Opción 1: Usar Tailwind Play CDN Descargado (Recomendado para desarrollo rápido)

1. **Mientras tengas Internet** (antes de llevar el proyecto a la VM), descarga el archivo:
   
   ```bash
   # En Windows PowerShell
   Invoke-WebRequest -Uri "https://cdn.tailwindcss.com" -OutFile "libs/tailwind.js"
   ```

2. **Actualiza las referencias en tus HTML:**
   
   Cambia esto:
   ```html
   <script src="https://cdn.tailwindcss.com"></script>
   ```
   
   Por esto:
   ```html
   <script src="../libs/tailwind.js"></script>
   ```

3. **Archivos a actualizar:**
   - `pages/login.html`
   - `pages/signup.html`
   - Cualquier otra página que uses Tailwind

### ✅ Opción 2: Tailwind CLI (Más profesional)

Si quieres un enfoque más robusto:

1. **Instala Tailwind (mientras tengas Internet):**
   
   ```bash
   npm init -y
   npm install -D tailwindcss
   npx tailwindcss init
   ```

2. **Crea un archivo de entrada CSS** (`assets/css/tailwind-input.css`):
   
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. **Configura `tailwind.config.js`:**
   
   ```javascript
   module.exports = {
     content: [
       "./pages/**/*.html",
       "./components/**/*.html",
       "./index.html",
       "./assets/js/**/*.js"
     ],
     theme: {
       extend: {
         colors: {
           primary: '#FF6B35',
           secondary: '#F7931E',
           dark: '#2C3E50',
           light: '#ECF0F1',
         }
       },
     },
     plugins: [],
   }
   ```

4. **Genera el CSS compilado:**
   
   ```bash
   npx tailwindcss -i ./assets/css/tailwind-input.css -o ./assets/css/tailwind.css --minify
   ```

5. **Usa el CSS generado en tus HTML:**
   
   ```html
   <link rel="stylesheet" href="../assets/css/tailwind.css">
   ```

### ✅ Opción 3: Copiar archivo CDN manualmente

1. **Abre en tu navegador:**
   ```
   https://cdn.tailwindcss.com
   ```

2. **Guarda el contenido** (Ctrl+S) como `tailwind.js` en la carpeta `libs/`

3. **Actualiza referencias** en tus archivos HTML

---

## 🎯 Recomendación para tu Proyecto

Para el proyecto de seguridad, usa la **Opción 1** porque:
- ✅ Es la más simple
- ✅ No requiere Node.js en la VM
- ✅ Funciona offline completamente
- ✅ Fácil de implementar

---

## 📝 Checklist antes de llevar a la VM

- [ ] Descargar Tailwind CDN a archivo local
- [ ] Actualizar todas las referencias en los HTML
- [ ] Probar que funciona sin Internet (desconecta WiFi y prueba)
- [ ] Copiar todas las fuentes/assets que uses
- [ ] Verificar que no haya otras referencias a CDNs externos

---

## 🚀 Comandos Útiles

### Descargar Tailwind (PowerShell):
```powershell
# Crear directorio libs si no existe
New-Item -ItemType Directory -Force -Path libs

# Descargar Tailwind
Invoke-WebRequest -Uri "https://cdn.tailwindcss.com" -OutFile "libs/tailwind.js"
```

### Verificar que funciona offline:
```powershell
# Iniciar servidor local
python -m http.server 8080
# O con PHP
php -S localhost:8080
```

Luego abre `http://localhost:8080/pages/login.html` en tu navegador

---

## ⚠️ Notas Importantes

1. **El archivo descargado del CDN es GRANDE** (~500KB+) pero contiene TODO Tailwind
2. **No necesitas Internet** una vez descargado
3. **Funciona exactamente igual** que el CDN
4. **En producción**, considera usar la Opción 2 (CLI) para generar solo el CSS que usas

---

## 🔧 Troubleshooting

### "Las clases de Tailwind no funcionan"
- Verifica que el path al archivo sea correcto
- Abre la consola del navegador (F12) y busca errores 404
- Asegúrate de que el archivo `tailwind.js` exista en `libs/`

### "No puedo descargar el archivo"
- Usa curl: `curl https://cdn.tailwindcss.com -o libs/tailwind.js`
- O simplemente ábrelo en el navegador y copia/pega el contenido

### "Mi VM es Linux sin entorno gráfico"
- Perfecto! Usa Python/PHP/Node para servir archivos
- Accede desde otra máquina en la misma red
- O usa `curl/wget` para probar las rutas

---

**Siguiente paso:** Después de configurar Tailwind offline, continúa con los dashboards! 🦉
