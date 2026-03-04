# Скрипт для сборки Docker контейнера с исправлениями русского языка
$dockerPath = "C:\Program Files\Docker\Docker\resources\bin\docker.exe"

# Останавливаем текущие контейнеры
Write-Host "Остановка текущих контейнеров..."
& $dockerPath compose -p Yflowdown

# Устанавливаем переменные окружения для сборки без credential helper
$env:DOCKER_CONFIG = ""
$env:DOCKER_BUILDKIT = "1"

# Собираем новый образ
Write-Host "Сборка нового образа с исправлениями..."
& $dockerPath build -t yflow-ru . --no-cache 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Образ успешно собран!"

    # Обновляем docker-compose для использования нового образа
    $composeContent = Get-Content docker-compose.yml
    $composeContent = $composeContent -replace 'build: \.', 'image: yflow-ru'
    Set-Content docker-compose.yml $composeContent

    Write-Host "Запуск контейнера с новым образом..."
    & $dockerPath compose -p Yflowup -d

    Write-Host "Готово! Контейнер запущен с русским языком по умолчанию."
} else {
    Write-Host "Ошибка сборки образа!"
}
