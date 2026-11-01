$ErrorActionPreference = "Stop"

$backendDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$wrapperProps = Join-Path $PSScriptRoot "maven-wrapper.properties"
$distributionUrl = "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.9/apache-maven-3.9.9-bin.zip"

if (Test-Path $wrapperProps) {
    foreach ($line in Get-Content $wrapperProps) {
        if ($line -match "^distributionUrl=(.+)$") {
            $distributionUrl = $Matches[1].Trim() -replace "\\:", ":"
        }
    }
}

$m2WrapperDir = Join-Path $env:USERPROFILE ".m2\wrapper\dists\apache-maven-3.9.9"
$mvnCmd = Join-Path $m2WrapperDir "apache-maven-3.9.9\bin\mvn.cmd"

if (-not (Test-Path $mvnCmd)) {
    New-Item -ItemType Directory -Force -Path $m2WrapperDir | Out-Null
    $zipFile = Join-Path $m2WrapperDir "maven.zip"
    Write-Host "Downloading Apache Maven 3.9.9 from $distributionUrl ..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $distributionUrl -OutFile $zipFile -UseBasicParsing
    Expand-Archive -Path $zipFile -DestinationPath $m2WrapperDir -Force
    Remove-Item $zipFile -Force
}

Push-Location $backendDir
try {
    & $mvnCmd @args
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
