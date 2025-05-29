# Настройка Telegram уведомлений для заявок

## 1. Создание Telegram бота

1. Найдите в Telegram бота @BotFather
2. Отправьте команду `/newbot`
3. Укажите имя вашего бота (например: "Вахта Заявки Бот")
4. Укажите username бота (например: "vakhtazayavki_bot")
5. Скопируйте полученный токен (например: `123456789:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw`)

## 2. Получение Chat ID

### Вариант 1: Через группу/канал (рекомендуется)
1. Создайте группу или канал в Telegram
2. Добавьте вашего бота в группу/канал как администратора
3. Отправьте любое сообщение в группу/канал
4. Перейдите по ссылке: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Найдите в ответе поле `"chat":{"id":-1001234567890}` - это ваш Chat ID

### Вариант 2: Личные сообщения
1. Напишите боту любое сообщение
2. Перейдите по ссылке: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Найдите в ответе поле `"chat":{"id":123456789}` - это ваш Chat ID

## 3. Настройка переменных окружения в Netlify

В админ-панели Netlify перейдите в:
**Site settings → Environment variables → Add a variable**

Добавьте следующие переменные:

### Telegram переменные:
```
TELEGRAM_BOT_TOKEN = 123456789:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw
TELEGRAM_CHAT_ID = -1001234567890
```

### Firebase переменные:
```
NEXT_PUBLIC_FIREBASE_API_KEY = your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 123456789
NEXT_PUBLIC_FIREBASE_APP_ID = 1:123456789:web:abcdefghijklmnop
```

## 4. Проверка настройки

После развертывания сайта:
1. Заполните форму отклика на любую вакансию
2. Проверьте Firestore - должна появиться запись в коллекции `applications`
3. Проверьте Telegram - должно прийти уведомление в указанную группу/канал

## 5. Структура уведомления в Telegram

Бот будет отправлять сообщения в следующем формате:

```
🔔 Новая заявка на вакансию!

📋 Вакансия: Грузчик на склад
🏢 Компания: ООО "Логистика"
📍 Локация: Москва
💰 Зарплата: 50000 - 70000 руб

👤 Соискатель:
• Имя: Иван Петров
• Телефон: +7 999 123-45-67
• Email: ivan@example.com
• Сообщение: Готов приступить к работе немедленно

🆔 ID заявки: abc123def456
🆔 ID вакансии: vac789xyz012

⏰ Дата подачи: 28.05.2025, 15:30:45
```

## 6. Коллекция applications в Firestore

Каждая заявка сохраняется в Firestore со следующей структурой:

```javascript
{
  vacancyId: "vacancy-id-string",
  applicantName: "Имя соискателя",
  applicantPhone: "+7 999 123-45-67",
  applicantEmail: "email@example.com", // может быть null
  message: "Дополнительное сообщение", // может быть null
  createdAt: Timestamp,
  status: "new"
}
```

## Возможные проблемы и решения

### Бот не отправляет сообщения
- Проверьте правильность токена бота
- Убедитесь, что бот добавлен в группу как администратор
- Проверьте Chat ID (должен начинаться с `-` для групп)

### Заявки не сохраняются в Firestore
- Проверьте Firebase переменные окружения
- Убедитесь, что правила безопасности Firestore разрешают запись
- Проверьте логи Netlify Functions

### Ошибки CORS
- Убедитесь, что домен сайта добавлен в настройки Firebase
- Проверьте заголовки CORS в Netlify функции
