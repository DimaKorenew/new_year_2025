# 📋 Резюме адаптации CI/CD для проекта new_year_2025

## ✅ Выполненные изменения

### 1. GitLab CI/CD Pipeline (`.gitlab-ci.yml`)

**Адаптировано:**
- ✅ Название проекта: `ed7_front` → `new_year_2025`
- ✅ GitLab путь: `DanLar/ed7_front` → `edimdoma/new_year_2025`
- ✅ Удалены специфичные переменные Next.js (NEXT_PUBLIC_*)
- ✅ Упрощён build stage (убраны лишние build args)
- ✅ Добавлена переменная `PROJECT_NAME`

**Стадии:**
1. `release` - автоматическое создание версионных тегов
2. `build` - сборка и push Docker образов в registry
3. `deploy_stage` - деплой на staging (автоматически)
4. `deploy_prod` - деплой на production (вручную)

### 2. Ansible Playbook (`deploy.yml`)

**Адаптировано:**
- ✅ Название playbook: `ed7_front` → `new_year_2025`
- ✅ Путь деплоя: `/APP/ed7_front/` → `/APP/new_year_2025/`
- ✅ Добавлено копирование `nginx.conf`
- ✅ Удалены лишние переменные окружения (GTM_ID, HAWK_TOKEN)
- ✅ Добавлена очистка старых образов

**Задачи:**
1. Создание директории `/APP/new_year_2025/`
2. Копирование `docker-compose.yml` и `nginx.conf`
3. Логин в Docker Registry
4. Pull и запуск контейнеров
5. Очистка старых образов (>72ч)

### 3. Docker Compose (`docker-compose.yml`)

**Добавлено:**
- ✅ Поддержка GitLab Container Registry
- ✅ Динамические image теги: `${CI_REGISTRY}/edimdoma/new_year_2025/[service]:${CI_COMMIT_TAG}`
- ✅ Переменная окружения `FRONTEND_PORT` (по умолчанию 8088)
- ✅ Переменная `NODE_ENV` для backend
- ✅ Fallback значения для локальной разработки

### 4. Inventory (`inventory.ini`)

**Обновлено:**
- ✅ Закомментированы примеры хостов
- ✅ Добавлены инструкции для настройки
- ✅ Добавлена группа `[local]` для тестирования

### 5. Новые файлы

**Созданы:**
- ✅ `CI_CD_README.md` - подробная документация по CI/CD
- ✅ `env.example` - пример переменных окружения
- ✅ `.gitlabci-example.env` - пример GitLab CI переменных
- ✅ `logs/.gitkeep` - директория для Ansible логов

### 6. Обновлён `.gitignore`

**Добавлено:**
- ✅ `.env` файлы
- ✅ Docker временные файлы
- ✅ Ansible retry файлы
- ✅ Исключение для `logs/.gitkeep`

## 🔧 Что нужно настроить вручную

### 1. GitLab CI/CD Variables

В GitLab: **Settings → CI/CD → Variables**

| Переменная | Значение | Protected | Masked |
|-----------|----------|-----------|---------|
| `SSH_PRIVATE_KEY` | Ваш SSH ключ | ✅ | ❌ |
| `CI_REGISTRY` | git.edimdoma.ru:5050 | ❌ | ❌ |
| `CI_REGISTRY_USER` | gitlab-ci-token | ❌ | ❌ |
| `CI_REGISTRY_PASSWORD` | Токен доступа | ✅ | ✅ |

### 2. Inventory настройка

Отредактируйте `inventory.ini`:

```ini
[stage]
stage_server ansible_host=YOUR_STAGE_IP ansible_user=root

[prod]
prod_server ansible_host=YOUR_PROD_IP ansible_user=root
```

### 3. Подготовка серверов

На каждом сервере (stage/prod):

```bash
# Установить Docker и Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установить Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Добавить SSH ключ GitLab Runner
mkdir -p ~/.ssh
echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## 🚀 Использование

### Деплой на Staging

```bash
# 1. Переключиться на staging ветку
git checkout staging

# 2. Закоммитить изменения
git add .
git commit -m "feat: новая фича"

# 3. Запушить (автоматически создаст тег и задеплоит)
git push origin staging
```

### Деплой на Production

```bash
# 1. Смержить staging в main
git checkout main
git merge staging
git push origin main

# 2. Pipeline создаст тег и соберёт образы
# 3. Вручную запустить deploy_prod в GitLab UI
```

## 📊 Версионирование

Автоматические теги создаются в формате:

- **Staging**: `YY.WW.N-stage` (например, `25.49.0-stage`)
- **Production**: `YY.WW.N` (например, `25.49.0`)

Где:
- `YY` - год (25 = 2025)
- `WW` - номер недели
- `N` - инкрементальный номер

## 🔍 Проверка

### Локально (перед коммитом)

```bash
# С Podman
CI_REGISTRY=localhost CI_COMMIT_TAG=dev podman-compose up --build -d

# С Docker
CI_REGISTRY=localhost CI_COMMIT_TAG=dev docker-compose up --build -d

# Проверить
curl http://localhost:8088
curl http://localhost:3001/health
```

### На сервере (после деплоя)

```bash
# SSH на сервер
ssh root@YOUR_SERVER_IP

# Проверить статус
cd /APP/new_year_2025
docker compose ps

# Проверить логи
docker compose logs -f frontend
docker compose logs -f backend

# Проверить health
curl http://localhost:8088
curl http://localhost:3001/health
```

## 📁 Структура проекта

```
/Users/melnikov/Documents/gitlab/edimdoma/new_year_2025/
├── .gitlab-ci.yml              # GitLab CI/CD pipeline
├── docker-compose.yml          # Docker Compose конфигурация
├── Dockerfile                  # Frontend Dockerfile
├── nginx.conf                  # Nginx конфигурация
├── server/
│   └── Dockerfile              # Backend Dockerfile
├── deploy.yml                  # Ansible playbook
├── ansible.cfg                 # Ansible конфигурация
├── inventory.ini               # Ansible inventory
├── logs/                       # Ansible логи
├── CI_CD_README.md            # Подробная CI/CD документация
├── DOCKER_README.md           # Docker документация
├── env.example                # Пример переменных окружения
└── .gitlabci-example.env      # Пример GitLab CI переменных
```

## 🎯 Различия с исходным проектом

| Аспект | ed7_front (старый) | new_year_2025 (новый) |
|--------|-------------------|----------------------|
| Фреймворк | Next.js | React + Vite |
| Build args | 10+ переменных | Нет (статичный билд) |
| Backend | Отсутствует | Express.js (Node 18) |
| Контейнеры | 1 (frontend) | 2 (frontend + backend) |
| Порт | 3000 | 8088 (frontend), 3001 (backend) |
| Env vars | NEXT_PUBLIC_* | NODE_ENV |

## ⚠️ Важные замечания

1. **Node версия**: Backend использует Node 18, хотя react-router требует Node 20+. Работает с предупреждениями. Рекомендуется обновить до Node 20 в Dockerfile.

2. **Безопасность**: Убедитесь, что `SSH_PRIVATE_KEY` и `CI_REGISTRY_PASSWORD` помечены как Protected и Masked в GitLab.

3. **Портры**: Убедитесь, что порты 8088 и 3001 открыты на серверах.

4. **Backup**: Настройте регулярный backup перед внедрением в production.

5. **Мониторинг**: Рекомендуется настроить мониторинг (Prometheus, Grafana и т.д.).

## 📚 Документация

- **CI/CD**: `CI_CD_README.md` - подробное руководство
- **Docker**: `DOCKER_README.md` - инструкции по Docker/Podman
- **Деплой**: `deploy.yml` - Ansible playbook
- **Этот файл**: `DEPLOYMENT_SUMMARY.md` - краткое резюме

## ✅ Готовность к деплою

- [x] GitLab CI/CD адаптирован
- [x] Ansible playbook обновлён
- [x] Docker Compose настроен для registry
- [x] Inventory подготовлен (требует настройки хостов)
- [x] Документация создана
- [x] Локально протестировано
- [ ] GitLab CI/CD переменные настроены
- [ ] Серверы подготовлены
- [ ] SSH доступ настроен
- [ ] Первый деплой выполнен

## 🆘 Поддержка

При возникновении проблем:
1. Проверьте `CI_CD_README.md` для детальных инструкций
2. Проверьте логи в GitLab CI/CD
3. Проверьте `logs/ansible-log.log`
4. Проверьте логи контейнеров на сервере

