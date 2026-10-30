$ErrorActionPreference = 'Stop'
$phpExe = Join-Path $env:LOCALAPPDATA 'Programs\PHP-8.5.12\php.exe'
$port = 8765

if (-not (Test-Path -LiteralPath $phpExe)) {
  throw "Khong tim thay PHP tai: $phpExe"
}

$existing = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($existing) {
  Write-Output "May chu loi chuc dang chay: http://127.0.0.1:$port/"
  exit 0
}

$logDir = Join-Path $env:LOCALAPPDATA 'Programs\PHP-8.5.12\logs'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$outputLog = Join-Path $logDir 'wishes-server-output.log'
$errorLog = Join-Path $logDir 'wishes-server-error.log'
$server = Start-Process -FilePath $phpExe `
  -ArgumentList @('-S', "127.0.0.1:$port", '-t', $PSScriptRoot) `
  -WorkingDirectory $PSScriptRoot `
  -WindowStyle Hidden `
  -RedirectStandardOutput $outputLog `
  -RedirectStandardError $errorLog `
  -PassThru

Start-Sleep -Milliseconds 700
if ($server.HasExited) {
  throw "PHP server khong khoi dong duoc. Xem $errorLog"
}

Write-Output "May chu loi chuc dang chay: http://127.0.0.1:$port/"
Write-Output "Mo trang thiệp qua dia chi tren; khong mo index.html truc tiep."
