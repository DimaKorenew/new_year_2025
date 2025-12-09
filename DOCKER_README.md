# 🐳 Docker / Podman инструкция

## Запуск проекта в контейнерах

Проект состоит из двух сервисов:
- **Frontend** (React + Vite + Nginx) - порт **8088**
- **Backend** (Express.js) - порт **3001**

## 🚀 Быстрый старт

### С Podman (рекомендуется для macOS)

```bash
# Запустить Podman машину (если не запущена)
podman machine start podman-machine-default

# Собрать и запустить контейнеры
podman-compose up --build -d

# Проверить статус
podman ps

# Посмотреть логи
podman logs new_year_frontend
podman logs new_year_backend
```

### С Docker

```bash
# Собрать и запустить контейнеры
docker-compose up --build -d

# Проверить статус
docker ps

# Посмотреть логи
docker logs new_year_frontend
docker logs new_year_backend
```

## 📍 Адреса

- **Фронтенд**: http://localhost:8088
- **Backend API**: http://localhost:3001
- **Health check**: http://localhost:3001/health

## 🛠 Управление контейнерами

### Podman

```bash
# Остановить контейнеры
podman-compose down

# Перезапустить
podman-compose restart

# Просмотр логов в реальном времени
podman logs -f new_year_frontend
podman logs -f new_year_backend

# Остановить и удалить все (включая volumes)
podman-compose down -v

# Пересобрать только один сервис
podman-compose up --build -d frontend
podman-compose up --build -d backend
```

### Docker

```bash
# Остановить контейнеры
docker-compose down

# Перезапустить
docker-compose restart

# Просмотр логов в реальном времени
docker logs -f new_year_frontend
docker logs -f new_year_backend

# Остановить и удалить все (включая volumes)
docker-compose down -v

# Пересобрать только один сервис
docker-compose up --build -d frontend
docker-compose up --build -d backend
```

## 📦 Структура Docker

### Файлы конфигурации

- `Dockerfile` - фронтенд (multi-stage build: Node.js → Nginx)
- `server/Dockerfile` - бэкенд (Node.js)
- `docker-compose.yml` - оркестрация сервисов
- `nginx.conf` - конфигурация Nginx для фронтенда
- `.dockerignore` - исключаемые файлы для фронтенда
- `server/.dockerignore` - исключаемые файлы для бэкенда

### Сеть

Контейнеры объединены в сеть `app-network`:
- Frontend проксирует `/api/*` запросы к Backend
- Backend доступен для Frontend по имени `backend:3001`

## 🔧 Разработка

Для разработки рекомендуется использовать локальный запуск без Docker:

```bash
# В корневой директории (фронтенд)
npm install
npm run dev

# В директории server (бэкенд)
cd server
npm install
npm start
```

Frontend будет доступен на `http://localhost:5173`, Backend - на `http://localhost:3001`.

## 🐛 Устранение неполадок

### Podman машина не запускается

```bash
# Проверить статус
podman machine list

# Запустить машину
podman machine start podman-machine-default

# Если не помогает, пересоздать машину
podman machine stop podman-machine-default
podman machine rm podman-machine-default
podman machine init
podman machine start
```

### Порт уже занят

Если порт 8088 или 3001 уже занят, измените в `docker-compose.yml`:

```yaml
ports:
  - "8089:80"  # вместо 8088:80 для frontend
  - "3002:3001"  # вместо 3001:3001 для backend
```

### Контейнеры не видят друг друга

Проверьте, что контейнеры в одной сети:

```bash
# Podman
podman network inspect new_year_2025_app-network

# Docker
docker network inspect new_year_2025_app-network
```

### Ошибки при сборке

Очистите кэш и пересоберите:

```bash
# Podman
podman-compose down
podman system prune -a
podman-compose up --build

# Docker
docker-compose down
docker system prune -a
docker-compose up --build
```

## 📊 Health Checks

Контейнеры имеют встроенные health checks:

```bash
# Podman
podman inspect --format='{{.State.Health.Status}}' new_year_frontend
podman inspect --format='{{.State.Health.Status}}' new_year_backend

# Docker
docker inspect --format='{{.State.Health.Status}}' new_year_frontend
docker inspect --format='{{.State.Health.Status}}' new_year_backend
```

## 🔐 Production рекомендации

Для production окружения рекомендуется:

1. Использовать environment variables для конфигурации
2. Настроить HTTPS через reverse proxy (nginx/traefik)
3. Добавить volume для персистентности данных backend
4. Настроить логирование (ELK, Loki и т.д.)
5. Использовать Docker Secrets для чувствительных данных
6. Настроить автоматические обновления и мониторинг

## 📝 Примечания

- Frontend использует multi-stage build для оптимизации размера образа
- Backend работает в production режиме (NODE_ENV=production)
- Nginx настроен на gzip сжатие и кэширование статики
- API запросы проксируются через Nginx к Backend

