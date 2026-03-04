# Скрипт для сборки Docker контейнера с исправлениями русского языка
$dockerPath = "C:\Program Files\Docker\Docker\resources\bin\docker.exe"

# Создаем временный config.json для отключения credential helper
$configDir = "$env:USERPROFILE\.docker"
$configFile = "$configDir\config.json"

if (!(Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force
}

# Создаем config без credsStore
$config = @{
    "credsStore" = $null
} | ConvertTo-Json -Depth 10
Set-Content -Path $configFile -Value $config

# Останавливаем текущие контейнеры
Write-Host "Stopping current containers..."
& $dockerPath compose -p Yflowdown

# Собираем новый образ
Write-Host "Building new image with Russian language fixes..."
& $dockerPath build -t yflow-ru . --no-cache

if ($LASTEXITCODE -eq 0) {
    Write-Host "Image built successfully!"

    # Создаем временный docker-compose с новым образом
    $tempComposeFile = "docker-compose-ru.yml"
    $composeContent = @"
services:
  yflow:
    image: yflow-ru
    container_name: yflow
    restart: unless-stopped
    ports:
      - '8080:80'
    depends_on:
      - postgres
      - redis
    env_file: .env
    volumes:
      - ./cache:/usr/src/app/cache
    networks:
      - yflow
  postgres:
    image: 'postgres:14.4'
    container_name: postgres
    restart: unless-stopped
    env_file: .env
    environment:
      - 'POSTGRES_DB=`${AP_POSTGRES_DATABASE}'
      - 'POSTGRES_PASSWORD=`${AP_POSTGRES_PASSWORD}'
      - 'POSTGRES_USER=`${AP_POSTGRES_USERNAME}'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - yflow
  redis:
    image: 'redis:7.0.7'
    container_name: redis
    restart: unless-stopped
    volumes:
      - 'redis_data:/data'
    networks:
      - yflow
volumes:
  postgres_data:
  redis_data:
networks:
  yflow:
"@
    Set-Content -Path $tempComposeFile -Value $composeContent

    Write-Host "Starting container with new image..."
    & $dockerPath compose -f $tempComposeFile -p Yflowup -d

    Write-Host "Done! Container started with Russian language as default."
} else {
    Write-Host "Build failed!"
}
