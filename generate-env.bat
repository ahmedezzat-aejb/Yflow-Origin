@echo off
setlocal enabledelayedexpansion

:: Generate random hex values
set "chars=0123456789abcdef"

:: API Key (64 hex chars)
set "apiKey="
for /l %%i in (1,1,64) do (
    set /a "rand=!random! %% 16"
    set "apiKey=!apiKey!!chars:~!rand!,1!"
)

:: Postgres Password (32 hex chars)
set "postgresPassword="
for /l %%i in (1,1,32) do (
    set /a "rand=!random! %% 16"
    set "postgresPassword=!postgresPassword!!chars:~!rand!,1!"
)

:: JWT Secret (32 hex chars)
set "jwtSecret="
for /l %%i in (1,1,32) do (
    set /a "rand=!random! %% 16"
    set "jwtSecret=!jwtSecret!!chars:~!rand!,1!"
)

:: Encryption Key (16 hex chars)
set "encryptionKey="
for /l %%i in (1,1,16) do (
    set /a "rand=!random! %% 16"
    set "encryptionKey=!encryptionKey!!chars:~!rand!,1!"
)

echo AP_API_KEY=!apiKey!
echo AP_POSTGRES_PASSWORD=!postgresPassword!
echo AP_JWT_SECRET=!jwtSecret!
echo AP_ENCRYPTION_KEY=!encryptionKey!

endlocal
