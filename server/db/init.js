const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

// Убедимся, что директория data существует
const dataDir = path.join(__dirname, "../../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Путь к файлу базы данных
const dbPath = path.join(dataDir, "todos.db");

// Удаляем существующую базу данных, если она есть
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log("Существующая база данных удалена");
}

// Создаем новую базу данных
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Ошибка при создании базы данных:", err.message);
    process.exit(1);
  }
  console.log("Новая база данных создана");

  // Читаем SQL схему из файла
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

  // Выполняем SQL запрос для создания таблицы
  db.exec(schema, (err) => {
    if (err) {
      console.error("Ошибка при создании таблицы:", err.message);
      process.exit(1);
    }
    console.log("Таблица todos создана");

    // Добавляем тестовые данные
    const insertSql = `
      INSERT INTO todos (title, completed, priority) VALUES 
      ('Изучить Node.js', 0, 'high'),
      ('Изучить React', 0, 'medium'),
      ('Создать todo-list приложение', 0, 'low')
    `;

    db.exec(insertSql, (err) => {
      if (err) {
        console.error("Ошибка при добавлении тестовых данных:", err.message);
        process.exit(1);
      }
      console.log("Тестовые данные добавлены");

      // Закрываем соединение с базой данных
      db.close((err) => {
        if (err) {
          console.error("Ошибка при закрытии базы данных:", err.message);
          process.exit(1);
        }
        console.log("Инициализация базы данных завершена успешно");
      });
    });
  });
});
