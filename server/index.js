const express = require("express");
const cors = require("cors");
const path = require("path");
const todosRoutes = require("./routes/todos");

// Инициализация базы данных
require("./db");

// Создание экземпляра приложения Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Разрешаем кросс-доменные запросы
app.use(express.json()); // Парсинг JSON в теле запроса

// Логирование запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware для установки CSP заголовка
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src https://fonts.googleapis.com https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
  );
  next();
});

// Обслуживание статических файлов из директории client
app.use(express.static(path.join(__dirname, "../client")));

// Маршруты API
app.use("/api/todos", todosRoutes);

// Маршрут для всех остальных запросов - возвращаем index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Что-то пошло не так!" });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`API доступно по адресу: http://localhost:${PORT}/api/todos`);
  console.log(`Клиент доступен по адресу: http://localhost:${PORT}`);
});

// Обработка сигналов завершения
process.on("SIGINT", () => {
  console.log("Сервер завершает работу");
  process.exit(0);
});
