# RestartHER - One-Click GitHub Push Script
# Ensures Git is in PATH and pushes securely to your GitHub repository

$gitDir = "C:\Users\Sohana Akhtar\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd"
$ghDir = "C:\Users\Sohana Akhtar\AppData\Local\Microsoft\WinGet\Packages\GitHub.cli_Microsoft.Winget.Source_8wekyb3d8bbwe\bin"
$env:Path = "$gitDir;$ghDir;$env:Path"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  RestartHER - Push to GitHub (API Key Safe)              " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Double-check secret safety
$envIgnored = git check-ignore .env
if ($envIgnored -match "\.env") {
    Write-Host "[SECURITY VERIFIED] .env is strictly ignored by Git. Your API key will NOT be uploaded." -ForegroundColor Green
} else {
    Write-Host "[ERROR] .env is not ignored! Aborting push." -ForegroundColor Red
    exit 1
}

# 2. Check current remote
$existingRemote = git remote get-url origin 2>$null
if (-not $existingRemote) {
    Write-Host ""
    Write-Host "No GitHub remote 'origin' configured yet." -ForegroundColor Yellow
    Write-Host "Please create a new repository on GitHub (https://github.com/new) and paste its URL below." -ForegroundColor White
    Write-Host "Example: https://github.com/YOUR_USERNAME/RestartHER.git" -ForegroundColor Gray
    Write-Host ""
    $repoUrl = Read-Host "Enter your GitHub Repository URL"
    if (-not [string]::IsNullOrWhiteSpace($repoUrl)) {
        git remote add origin $repoUrl.Trim()
        Write-Host "Added origin remote: $repoUrl" -ForegroundColor Green
    } else {
        Write-Host "No URL provided. Exiting." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Current remote origin: $existingRemote" -ForegroundColor Green
}

# 3. Push to GitHub
Write-Host ""
Write-Host "Pushing 'main' branch to GitHub..." -ForegroundColor Cyan
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  SUCCESSFULLY PUSHED RESTARTHER TO GITHUB!              " -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "Your code is live on GitHub and your API key remains completely protected." -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Push failed. If you need to authenticate, run: gh auth login" -ForegroundColor Yellow
}
