# Script para descargar imágenes de items del menú
# Ejecutar con: powershell -ExecutionPolicy Bypass -File download-menu-images.ps1

Write-Host "DESCARGADOR DE IMAGENES DE MENU" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

$outputDir = "..\assets\img\menu"

# Crear directorio si no existe
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

# Imágenes para items del menú (La Bella Notte - Italiana)
$menuImages = @(
    # Entradas
    @{
        Name = "bruschetta.jpg"
        Url = "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&q=80"
        Description = "Bruschetta"
    },
    @{
        Name = "caprese.jpg"
        Url = "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&q=80"
        Description = "Ensalada Caprese"
    },
    @{
        Name = "carpaccio.jpg"
        Url = "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80"
        Description = "Carpaccio de res"
    },
    
    # Platos Principales
    @{
        Name = "pasta-carbonara.jpg"
        Url = "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80"
        Description = "Pasta Carbonara"
    },
    @{
        Name = "lasagna.jpg"
        Url = "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600&q=80"
        Description = "Lasagna"
    },
    @{
        Name = "ravioli.jpg"
        Url = "https://images.unsplash.com/photo-1587740908075-9ea5c015dd23?w=600&q=80"
        Description = "Ravioli"
    },
    @{
        Name = "risotto.jpg"
        Url = "https://images.unsplash.com/photo-1476124369491-f1f26f7f8fac?w=600&q=80"
        Description = "Risotto"
    },
    @{
        Name = "ossobuco.jpg"
        Url = "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=600&q=80"
        Description = "Ossobuco"
    },
    
    # Postres
    @{
        Name = "tiramisu.jpg"
        Url = "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80"
        Description = "Tiramisú"
    },
    @{
        Name = "panna-cotta.jpg"
        Url = "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80"
        Description = "Panna Cotta"
    },
    @{
        Name = "gelato.jpg"
        Url = "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80"
        Description = "Gelato"
    },
    
    # Bebidas
    @{
        Name = "espresso.jpg"
        Url = "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80"
        Description = "Espresso"
    },
    @{
        Name = "wine.jpg"
        Url = "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80"
        Description = "Vino tinto"
    },
    @{
        Name = "limoncello.jpg"
        Url = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80"
        Description = "Limoncello"
    }
)

$success = 0
$failed = 0

foreach ($image in $menuImages) {
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

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Descargadas: $success imagenes" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "Fallidas: $failed imagenes" -ForegroundColor Red
}
Write-Host "`nImagenes guardadas en: $outputDir" -ForegroundColor Cyan
Write-Host "`nListo! Ahora tienes imagenes para el menu de La Bella Notte.`n"
