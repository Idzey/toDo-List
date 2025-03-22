# ToDo List

Приложение для создания и управления списком задач с аутентификацией и подтверждением почты.

## 🚀 Функционал
- 📋 Создание, редактирование и удаление задач
- ✅ Отметка задач как выполненных
- 📅 Календарь
- 🔐 Аутентификация через JWT
- ✉️ Подтверждение почты при регистрации

## 🛠️ Технологии
- **Frontend:** React, TypeScript, Zustand, Tailwind CSS, React router, Ant Design
- **Backend:** Node.js, Express, MongoDB
- **Аутентификация:** JSON Web Token (JWT)

## 🔮 Планируемые улучшения
- 🎭 Анимации для улучшения пользовательского опыта
- 📅 Напоминания о задачах
- 📊 Статистика выполненных задач

## 📌 Установка и запуск
```sh
# Клонируем репозиторий
git clone https://github.com/Idzey/toDo-List.git
cd toDo-List
```

```sh
# Backend
cd backend
npm install
npm run build
npm run start
```

```sh
# Frontend
cd frontend
npm install
npm run build
npm run preview
```

## 🔧 Настройка переменных окружения
### 📌 Фронтенд (`.env`):
```env
VITE_API_URL = "http://*backend.com*/api"
```

### 📌 Бэкенд (`.env`):
```env
MONGODB_URI = "MONGODB_URI"
CLIENT_URL = "http://*frontend.com*"
JWT_SECRET = "JWTSecret"
REFRESH_SECRET = "RefreshSecret"
EMAIL_SECRET = "EmailSecret"
SMTP_USER = "Google email"
SMTP_PASS = "Google smtp password account"
```

### Скриншоты приложения: [Скриншоты](https://github.com/Idzey/toDo-List/blob/main/screenshot.md)

### Опубликованная версия: [Сайт](https://to-do-list-gold-eight-80.vercel.app)
P.S. *Может немного долго загружаться бэкенд, так как опубликован на Render (холодный старт).*
