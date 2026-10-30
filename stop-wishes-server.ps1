$ErrorActionPreference = 'Stop'
$server = Get-CimInstance Win32_Process -Filter "Name = 'php.exe'" |
  Where-Object { $_.CommandLine -like '*-S 127.0.0.1:8765*' -and $_.CommandLine -like "*$PSScriptRoot*" }

if ($server) {
  Stop-Process -Id $server.ProcessId -Force
  Write-Output 'Da dung may chu loi chuc.'
} else {
  Write-Output 'May chu loi chuc khong chay.'
}
