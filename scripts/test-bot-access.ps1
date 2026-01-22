# Script para verificar acceso de bots a URLs
# Uso: .\scripts\test-bot-access.ps1 <url>

param(
    [Parameter(Mandatory=$true)]
    [string]$Url
)

Write-Host "Testing bot access to: $Url" -ForegroundColor Cyan
Write-Host ""

$bots = @(
    @{ Name = "LinkedInBot"; UserAgent = "LinkedInBot/1.0" },
    @{ Name = "Facebook Bot"; UserAgent = "facebookexternalhit/1.1" },
    @{ Name = "WhatsApp Bot"; UserAgent = "WhatsApp/2.0" },
    @{ Name = "Twitter Bot"; UserAgent = "Twitterbot/1.0" }
)

foreach ($bot in $bots) {
    Write-Host "Testing: $($bot.Name) ($($bot.UserAgent))" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -UserAgent $bot.UserAgent -UseBasicParsing -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ Status: $($response.StatusCode) OK" -ForegroundColor Green
            Write-Host "  ✅ Bot can access the URL" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Status: $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401) {
            Write-Host "  ❌ Status: 401 Unauthorized" -ForegroundColor Red
            Write-Host "  ❌ Deployment Protection is blocking this bot!" -ForegroundColor Red
        } elseif ($statusCode -eq 403) {
            Write-Host "  ❌ Status: 403 Forbidden" -ForegroundColor Red
            Write-Host "  ❌ Access is forbidden for this bot!" -ForegroundColor Red
        } else {
            Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
}

Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  - 200 OK: Bot can access (OG previews will work)" -ForegroundColor Green
Write-Host "  - 401 Unauthorized: Deployment Protection is blocking (fix in Vercel Settings)" -ForegroundColor Red
Write-Host "  - 403 Forbidden: Access denied (check Vercel settings)" -ForegroundColor Red
