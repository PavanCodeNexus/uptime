# Loads backend/.env (KEY=VALUE lines) into the process environment, then starts Spring Boot.
# Usage:  cd F:\uptime\backend ; .\run-with-env.ps1
Set-Location $PSScriptRoot
if (-not (Test-Path .env)) { Write-Error ".env not found. Copy .env.example to .env and fill it in."; exit 1 }

Get-Content .env | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith('#') -and $line.Contains('=')) {
        $k, $v = $line -split '=', 2
        [Environment]::SetEnvironmentVariable($k.Trim(), $v.Trim(), 'Process')
    }
}
Write-Host "Profile: $env:APP_ENV | DB: $($env:DB_URL -replace '//.*@','//***@')"
.\mvnw.cmd spring-boot:run
