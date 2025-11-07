# Script para descargar imágenes de restaurantes de Unsplash
# Ejecutar con: powershell -ExecutionPolicy Bypass -File download-images.ps1

Write-Host "DESCARGADOR DE IMAGENES PARA BUHO EATS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$outputDir = "..\assets\img\restaurants\default"

# Crear directorio si no existe
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

# Lista de imágenes de restaurantes (Unsplash con tamaño optimizado)
$images = @(
    @{
        Name = "burger-1.jpg"
        Url = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
        Description = "Hamburguesa gourmet"
    },
    @{
        Name = "pizza-1.jpg"
        Url = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80"
        Description = "Pizza italiana"
    },
    @{
        Name = "sushi-1.jpg"
        Url = "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80"
        Description = "Sushi japonés"
    },
    @{
        Name = "mexican-1.jpg"
        Url = "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80"
        Description = "Tacos mexicanos"
    },
    @{
        Name = "italian-1.jpg"
        Url = "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80"
        Description = "Pasta italiana"
    },
    @{
        Name = "steak-1.jpg"
        Url = "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80"
        Description = "Steak house"
    },
    @{
        Name = "chinese-1.jpg"
        Url = "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80"
        Description = "Comida china"
    },
    @{
        Name = "seafood-1.jpg"
        Url = "https://images.unsplash.com/photo-1559737558-2f5a35f4523d?w=800&q=80"
        Description = "Mariscos"
    },
    @{
        Name = "coffee-1.jpg"
        Url = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80"
        Description = "Cafetería"
    },
    @{
        Name = "dessert-1.jpg"
        Url = "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80"
        Description = "Postres"
    }
)

$success = 0
$failed = 0

foreach ($image in $images) {
    $outputPath = Join-Path $outputDir $image.Name
    
    Write-Host "Descargando: $($image.Description)..." -NoNewline
    
    try {
        Invoke-WebRequest -Uri $image.Url -OutFile $outputPath -ErrorAction Stop
        Write-Host " OK" -ForegroundColor Green
        $success++
    }
    catch {
        Write-Host " ERROR" -ForegroundColor Red
        $failed++
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Descargadas: $success imagenes" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "Fallidas: $failed imagenes" -ForegroundColor Red
}
Write-Host "`nImagenes guardadas en: $outputDir" -ForegroundColor Cyan
Write-Host "`nListo! Ahora puedes usar estas imagenes en tu aplicacion.`n"
