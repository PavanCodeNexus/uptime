# Smoke test: login as seeded owner via demo OTP, then call real Gemini diagnosis.
$base = 'http://localhost:8080/api/v1'
$j = 'application/json'
$phone = '9876543211'
Invoke-RestMethod -Method Post "$base/auth/send-otp" -ContentType $j -Body (@{phone=$phone;purpose='LOGIN'} | ConvertTo-Json) | Out-Null
$auth = Invoke-RestMethod -Method Post "$base/auth/verify-otp" -ContentType $j -Body (@{phone=$phone;otp='123456';purpose='LOGIN';userType='OWNER'} | ConvertTo-Json)
$token = $auth.data.accessToken
Write-Host "login ok, token length: $($token.Length)"
$body = @{description='CNC lathe spindle makes a loud grinding noise and vibrates at high RPM'; industry='INDUSTRIAL'} | ConvertTo-Json
$r = Invoke-RestMethod -Method Post "$base/ai/diagnose" -ContentType $j -Headers @{Authorization="Bearer $token"} -Body $body
$r | ConvertTo-Json -Depth 6
