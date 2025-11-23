# 🚀 ELPLC Production Simulator - START
# Skrypt pomocniczy do uruchamiania aplikacji

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ELPLC Production Simulator" -ForegroundColor Green
Write-Host "  FailSafe Technology" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Sprawdź czy jesteśmy w poprawnym katalogu
if (-not (Test-Path "production-simulator")) {
    Write-Host "❌ Błąd: Nie znaleziono katalogu 'production-simulator'" -ForegroundColor Red
    Write-Host "   Uruchom ten skrypt z katalogu 'hackaton'" -ForegroundColor Yellow
    Write-Host ""
    Pause
    exit 1
}

# Przejdź do katalogu projektu
Set-Location production-simulator

Write-Host "📁 Katalog: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

# Sprawdź czy node_modules istnieje
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instaluję zależności..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

Write-Host "🚀 Uruchamiam serwer deweloperski..." -ForegroundColor Green
Write-Host ""
Write-Host "   Aplikacja będzie dostępna pod:" -ForegroundColor Cyan
Write-Host "   → http://localhost:5173" -ForegroundColor White -BackgroundColor Blue
Write-Host ""
Write-Host "   Naciśnij Ctrl+C aby zatrzymać serwer" -ForegroundColor Gray
Write-Host ""

# Uruchom dev server
npm run dev
