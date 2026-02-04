const express = require("express");
const router = express.Router();
const TodoController = require("../controllers/todos");

// Получить все задачи
router.get("/", TodoController.getAllTodos);

// Создать новую задачу
router.post("/", TodoController.createTodo);

// Обновить статус задачи (выполнена/не выполнена)
router.patch("/:id", TodoController.updateTodo);

// Отметить задачу как выполненную
router.put("/:id/done", TodoController.markTodoAsDone);

module.exports = router;
