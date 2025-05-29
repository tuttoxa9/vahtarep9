// Instructions: Создам список задач для настройки проекта для деплоя на Netlify

# Задачи для настройки деплоя на Netlify

## Основная проблема
- [x] Клонирован репозиторий
- [x] Исправить ошибку с Firebase конфигурацией
- [x] Настроить переменные окружения
- [x] Обновить netlify.toml для корректного деплоя
- [x] Протестировать сборку локально
- [ ] **in_progress** Задеплоить на Netlify

## Детали проблемы
Ошибка: `Firebase configuration is incomplete. Required environment variables: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID`

## Решение
1. Создать mock Firebase конфигурацию для сборки
2. Добавить переменные окружения в netlify.toml
3. Убедиться что сборка проходит без ошибок

## Дополнительные улучшения
- [ ] Оптимизировать конфигурацию Next.js для статического экспорта
- [ ] Добавить fallback для API routes
