/**
 * Компонент для отображения списка задач
 */
const TodoList = ({ todos, onToggleComplete, onPriorityChange }) => {
  // Если задач нет, показываем сообщение
  if (!todos || todos.length === 0) {
    return (
      <div className="message info">
        Нет задач. Добавьте новую задачу с помощью формы выше.
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onPriorityChange={onPriorityChange}
        />
      ))}
    </ul>
  );
};
