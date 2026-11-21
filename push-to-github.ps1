# Push VayuMitra to GitHub
Set-Location -Path $PSScriptRoot

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   VayuMitra - Push Project to GitHub" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$repoUrl = Read-Host "Enter your GitHub Repository URL (e.g. https://github.com/username/repo.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "[ERROR] No repository URL entered. Aborting." -ForegroundColor Red
    exit 1
}

Write-Host "Setting remote origin to $repoUrl..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $repoUrl

Write-Host "Pushing main branch to GitHub..." -ForegroundColor Green
git push -u origin main
