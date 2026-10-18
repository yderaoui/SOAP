$ErrorActionPreference = 'Stop'
$soapReady = $false
try { $soapPage = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2; $soapReady = $soapPage.Content.Contains('Escape the Timeline') } catch {}
if (-not $soapReady) {
  Start-Process -FilePath 'node' -ArgumentList 'server.cjs' -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
  for ($soapAttempt = 0; $soapAttempt -lt 30; $soapAttempt++) {
    Start-Sleep -Milliseconds 200
    try { $soapPage = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2; if ($soapPage.Content.Contains('Escape the Timeline')) { $soapReady = $true; break } } catch {}
  }
}
if (-not $soapReady) { throw 'SOAP could not start. Check that Node.js is installed and port 3000 is free.' }
Start-Process 'http://localhost:3000'
