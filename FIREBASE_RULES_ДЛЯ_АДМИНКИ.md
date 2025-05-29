# 🔐 Правила Firebase Firestore для работы с админкой

## 🚨 ВАЖНО: Обновленные правила безопасности

Чтобы ваша админка могла создавать, редактировать и удалять вакансии, а основной сайт мог их читать, используйте эти правила:

## Вариант 1: Простые правила (рекомендуется для быстрого решения)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Вакансии - полный доступ для всех (пока без аутентификации)
    match /vacancies/{document} {
      allow read, write: if true;
    }

    // Заявки - только создание для пользователей
    match /applications/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }

    // Преимущества (features) - полный доступ
    match /features/{document} {
      allow read, write: if true;
    }

    // Все остальное запрещено
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Вариант 2: Более безопасные правила (с проверкой домена)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Функция проверки админского домена
    function isAdminDomain() {
      return request.headers.origin != null &&
             (request.headers.origin.matches('.*localhost.*') ||
              request.headers.origin.matches('.*your-admin-domain\\.netlify\\.app.*') ||
              request.headers.origin.matches('.*your-admin-domain\\.com.*'));
    }

    // Вакансии
    match /vacancies/{document} {
      allow read: if true; // Чтение для всех
      allow write: if isAdminDomain(); // Запись только с админки
    }

    // Заявки - только создание с основного сайта
    match /applications/{document} {
      allow create: if true;
      allow read, update, delete: if isAdminDomain(); // Админка может читать заявки
    }

    // Преимущества
    match /features/{document} {
      allow read: if true;
      allow write: if isAdminDomain();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Вариант 3: С аутентификацией (самый безопасный)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Функция проверки админа (нужно настроить Firebase Auth)
    function isAdmin() {
      return request.auth != null &&
             request.auth.token.email != null &&
             request.auth.token.email.matches('.*@yourdomain\\.com');
    }

    // Вакансии
    match /vacancies/{document} {
      allow read: if true; // Чтение для всех
      allow write: if isAdmin(); // Запись только для админов
    }

    // Заявки
    match /applications/{document} {
      allow create: if true; // Создание для всех
      allow read, update, delete: if isAdmin(); // Управление только админам
    }

    // Преимущества
    match /features/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 🚀 Быстрое решение

**Для немедленного решения проблемы используйте Вариант 1:**

1. Откройте Firebase Console
2. Перейдите в Firestore Database → Rules
3. Замените текущие правила на код из Варианта 1
4. Нажмите "Опубликовать"

Это даст полный доступ к вакансиям и преимуществам, сохранив ограничения только для заявок.

## 🔒 Для продакшена рекомендуется

Настройте аутентификацию и используйте Вариант 3:

1. **Настройте Firebase Authentication**
2. **Добавьте логин в админку**
3. **Используйте правила с проверкой аутентификации**

## 📝 Примечания

- **Вариант 1** - подходит для разработки и тестирования
- **Вариант 2** - средний уровень безопасности
- **Вариант 3** - максимальная безопасность для продакшена

Выберите подходящий вариант в зависимости от ваших требований к безопасности.

---
*После применения правил ваша админка снова сможет управлять вакансиями!*
