const db = require("../db");

/**
 * Модель для работы с задачами
 */
const Todo = {
  /**
   * Получить все задачи
   * @returns {Promise<Array>} Массив задач
   */
  getAll: () => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM todos ORDER BY created_at DESC";

      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        // Преобразуем completed из 0/1 в false/true для JSON
        const todos = rows.map((row) => ({
          ...row,
          completed: row.completed === 1,
        }));

        resolve(todos);
      });
    });
  },

  /**
   * Получить задачу по ID
   * @param {number} id ID задачи
   * @returns {Promise<Object>} Объект задачи
   */
  getById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM todos WHERE id = ?";

      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          reject(new Error("Задача не найдена"));
          return;
        }

        // Преобразуем completed из 0/1 в false/true для JSON
        const todo = {
          ...row,
          completed: row.completed === 1,
        };

        resolve(todo);
      });
    });
  },

  /**
   * Создать новую задачу
   * @param {Object} todo Объект задачи
   * @param {string} todo.title Название задачи
   * @returns {Promise<Object>} Созданная задача
   */
  create: (todo) => {
    return new Promise((resolve, reject) => {
      const { title, priority = "medium" } = todo;

      if (!title) {
        reject(new Error("Название задачи обязательно"));
        return;
      }

      const sql = "INSERT INTO todos (title, priority) VALUES (?, ?)";

      db.run(sql, [title, priority], function (err) {
        if (err) {
          reject(err);
          return;
        }

        // this.lastID содержит ID последней вставленной записи
        Todo.getById(this.lastID).then(resolve).catch(reject);
      });
    });
  },

  /**
   * Обновить статус задачи
   * @param {number} id ID задачи
   * @param {Object} updates Объект с обновлениями
   * @param {boolean} updates.completed Статус выполнения
   * @returns {Promise<Object>} Обновленная задача
   */
  update: (id, updates) => {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];

      if (updates.completed !== undefined) {
        fields.push("completed = ?");
        values.push(updates.completed ? 1 : 0);
      }

      if (updates.priority !== undefined) {
        fields.push("priority = ?");
        values.push(updates.priority);
      }

      if (fields.length === 0) {
        reject(new Error("Нет данных для обновления"));
        return;
      }

      const sql = `UPDATE todos SET ${fields.join(", ")} WHERE id = ?`;
      values.push(id);

      db.run(sql, values, function (err) {
        if (err) {
          reject(err);
          return;
        }

        if (this.changes === 0) {
          reject(new Error("Задача не найдена"));
          return;
        }

        Todo.getById(id).then(resolve).catch(reject);
      });
    });
  },
};

module.exports = Todo;
