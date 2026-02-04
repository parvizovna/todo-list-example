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

const seedTodos = () => {
  const checkSql = "SELECT COUNT(*) AS count FROM todos";
  db.get(checkSql, [], (countErr, row) => {
    if (countErr) {
      console.error("Ошибка при проверке количества задач:", countErr.message);
      return;
    }

    if (row.count === 0) {
      const seedSql = `
        INSERT INTO todos (title, completed, priority) VALUES
        ('Изучить Node.js', 0, 'high'),
        ('Изучить React', 0, 'medium'),
        ('Создать todo-list приложение', 0, 'low')
      `;

      db.exec(seedSql, (seedErr) => {
        if (seedErr) {
          console.error("Ошибка при добавлении тестовых данных:", seedErr.message);
        } else {
          console.log("Тестовые задачи добавлены автоматически");
        }
      });
    }
  });
};

const ensurePriorityColumn = (callback) => {
  const infoSql = "PRAGMA table_info(todos)";
  db.all(infoSql, [], (infoErr, columns) => {
    if (infoErr) {
      console.error("Ошибка при получении схемы таблицы:", infoErr.message);
      callback();
      return;
    }

    const hasPriority = columns.some((column) => column.name === "priority");

    if (hasPriority) {
      callback();
      return;
    }

    const alterSql =
      "ALTER TABLE todos ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium'";
    db.exec(alterSql, (alterErr) => {
      if (alterErr) {
        console.error("Ошибка при добавлении столбца priority:", alterErr.message);
      } else {
        console.log("Столбец priority добавлен");
      }
      callback();
    });
  });
};

// Создаем подключение к базе данных
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Ошибка при подключении к базе данных:", err.message);
  } else {
    console.log("Подключение к базе данных SQLite установлено");

    // Читаем SQL схему из файла
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

    // Выполняем SQL запрос для создания таблицы
    db.exec(schema, (schemaErr) => {
      if (schemaErr) {
        console.error("Ошибка при создании таблицы:", schemaErr.message);
      } else {
        console.log("Таблица todos создана или уже существует");
        ensurePriorityColumn(seedTodos);
      }
    });
  }
});

// Функция для закрытия соединения с базой данных
const closeDatabase = () => {
  db.close((err) => {
    if (err) {
      console.error("Ошибка при закрытии базы данных:", err.message);
    } else {
      console.log("Соединение с базой данных закрыто");
    }
  });
};

// Обработка сигналов завершения для корректного закрытия базы данных
process.on("SIGINT", closeDatabase);
process.on("SIGTERM", closeDatabase);

module.exports = db;
