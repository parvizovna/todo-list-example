const Todo = require("../models/todo");

const VALID_PRIORITIES = ["low", "medium", "high"];

const normalizePriority = (priority = "medium") => {
  const normalized = String(priority).toLowerCase();
  if (!VALID_PRIORITIES.includes(normalized)) {
    throw new Error("Недопустимый приоритет");
  }
  return normalized;
};

/**
 * Контроллер для работы с задачами
 */
const TodoController = {
  /**
   * Получить все задачи
   * @param {Object} req Объект запроса Express
   * @param {Object} res Объект ответа Express
   */
  getAllTodos: async (req, res) => {
    try {
      const todos = await Todo.getAll();
      res.json(todos);
    } catch (error) {
      console.error("Ошибка при получении задач:", error);
      res.status(500).json({ error: "Ошибка при получении задач" });
    }
  },

  /**
   * Создать новую задачу
   * @param {Object} req Объект запроса Express
   * @param {Object} res Объект ответа Express
   */
  createTodo: async (req, res) => {
    try {
      const { title, priority = "medium" } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Название задачи обязательно" });
      }

      let normalizedPriority;
      try {
        normalizedPriority = normalizePriority(priority);
      } catch (priorityError) {
        return res.status(400).json({ error: priorityError.message });
      }

      const todo = await Todo.create({ title, priority: normalizedPriority });
      res.status(201).json(todo);
    } catch (error) {
      console.error("Ошибка при создании задачи:", error);
      res.status(500).json({ error: "Ошибка при создании задачи" });
    }
  },

  /**
   * Обновить статус задачи
   * @param {Object} req Объект запроса Express
   * @param {Object} res Объект ответа Express
   */
  updateTodo: async (req, res) => {
    try {
      const { id } = req.params;
      const { completed, priority } = req.body;
      const updates = {};

      if (completed !== undefined) {
        updates.completed = completed;
      }

      if (priority !== undefined) {
        try {
          updates.priority = normalizePriority(priority);
        } catch (priorityError) {
          return res.status(400).json({ error: priorityError.message });
        }
      }

      if (!Object.keys(updates).length) {
        return res
          .status(400)
          .json({ error: "Нет данных для обновления задачи" });
      }

      const todo = await Todo.update(id, updates);
      res.json(todo);
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);

      if (error.message === "Задача не найдена") {
        return res.status(404).json({ error: "Задача не найдена" });
      }

      res.status(500).json({ error: "Ошибка при обновлении задачи" });
    }
  },
  /**
   * Отметить задачу как выполненную
   * @param {Object} req Объект запроса Express
   * @param {Object} res Объект ответа Express
   */
  markTodoAsDone: async (req, res) => {
    try {
      const { id } = req.params;

      const todo = await Todo.update(id, { completed: true });
      res.json(todo);
    } catch (error) {
      console.error("Ошибка при отметке задачи как выполненной:", error);

      if (error.message === "Задача не найдена") {
        return res.status(404).json({ error: "Задача не найдена" });
      }

      res
        .status(500)
        .json({ error: "Ошибка при отметке задачи как выполненной" });
    }
  },
};

module.exports = TodoController;
