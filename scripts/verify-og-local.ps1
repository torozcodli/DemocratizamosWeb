# Script para verificar Open Graph localmente
# Ejecuta: .\scripts\verify-og-local.ps1

Write-Host "Verificando meta tags de Open Graph..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$pages = @("/", "/blog", "/programas", "/herramientas", "/nosotros", "/aviso-de-privacidad")

foreach ($page in $pages) {
    $url = "$baseUrl$page"
    Write-Host "Verificando: $url" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -ErrorAction Stop
        $html = $response.Content
        
        # Buscar meta tags usando Select-String
        $ogTitleMatch = $html | Select-String -Pattern 'property="og:title"\s+content="([^"]+)"'
        $ogDescMatch = $html | Select-String -Pattern 'property="og:description"\s+content="([^"]+)"'
        $ogImageMatch = $html | Select-String -Pattern 'property="og:image"\s+content="([^"]+)"'
        
        $ogTitle = if ($ogTitleMatch) { $ogTitleMatch.Matches.Groups[1].Value } else { $null }
        $ogDescription = if ($ogDescMatch) { $ogDescMatch.Matches.Groups[1].Value } else { $null }
        $ogImage = if ($ogImageMatch) { $ogImageMatch.Matches.Groups[1].Value } else { $null }
        
        if ($ogTitle) {
            Write-Host "  OK og:title: $ogTitle" -ForegroundColor Green
        } else {
            Write-Host "  ERROR og:title: NO ENCONTRADO" -ForegroundColor Red
        }
        
        if ($ogDescription) {
            $desc = if ($ogDescription.Length -gt 60) { $ogDescription.Substring(0, 60) + "..." } else { $ogDescription }
            Write-Host "  OK og:description: $desc" -ForegroundColor Green
        } else {
            Write-Host "  ERROR og:description: NO ENCONTRADO" -ForegroundColor Red
        }
        
        if ($ogImage) {
            Write-Host "  OK og:image: $ogImage" -ForegroundColor Green
            if ($ogImage -like "http*") {
                Write-Host "  OK og:image es URL absoluta" -ForegroundColor Green
            } else {
                Write-Host "  ADVERTENCIA og:image es URL relativa (normal en desarrollo)" -ForegroundColor Yellow
            }
        } else {
            Write-Host "  ERROR og:image: NO ENCONTRADO" -ForegroundColor Red
        }
        
        Write-Host ""
    } catch {
        Write-Host "  ERROR: $_" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "Verificacion completada" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para ver los meta tags manualmente:" -ForegroundColor Yellow
Write-Host "  1. Abre http://localhost:3000 en tu navegador" -ForegroundColor White
Write-Host "  2. Presiona Ctrl+Shift+I (DevTools)" -ForegroundColor White
Write-Host "  3. Ve a la pestaña Elements" -ForegroundColor White
Write-Host "  4. Busca og:image con Ctrl+F" -ForegroundColor White
