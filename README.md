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
VITE_API_URL=???
```

### 📌 Бэкенд (`.env`):
```env
PORT=3000
MONGODB_URI=???
CLIENT_URL=???
JWT_SECRET=???
REFRESH_SECRET=???
EMAIL_SECRET=???
SMTP_USER=???
SMTP_PASS=???
```

### Скриншоты приложения: [Скриншоты](https://github.com/Idzey/toDo-List/blob/main/screenshot.md)

### Опубликованная версия: [Сайт](https://to-do-list-gold-eight-80.vercel.app)
P.S. *Может немного долго загружаться бэкенд, так как опубликован на Render (холодный старт).*
