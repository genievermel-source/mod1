# Модуль 1 — AIPPM

Первый модуль курса **AI Product & Project Management (AIPPM)**.

## Проекты

### 🔄 Ретроспектива команды

Мини-приложение для командных ретроспектив с real-time обновлениями.

**Возможности:**
- Создание уникальной ссылки на ретроспективу
- Канбан-доска с 4 колонками: «Что было хорошо», «Что было плохо», «Благодарности», «Что можно улучшить»
- Мгновенное отображение новых карточек у всех участников (WebSocket)

**Стек:** React + Vite, Node.js + Express, PostgreSQL, Docker

## Быстрый старт

```bash
git clone https://github.com/genievermel-source/mod1.git
cd mod1/retro
docker-compose up --build
```

Откройте **http://localhost:8081**

## Структура

```
retro/
├── client/       # React + Vite (nginx в Docker)
├── server/       # Node.js + Express + WebSocket
├── init.sql      # Схема БД
└── docker-compose.yml
```

## Контакты

genievermel@gmail.com
