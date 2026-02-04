/**
 * Компонент формы для создания новой задачи
 */
const TodoForm = ({ onAddTodo }) => {
  const [title, setTitle] = React.useState("");
  const [priority, setPriority] = React.useState("medium");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Проверяем, что название задачи не пустое
    if (title.trim()) {
      // Вызываем функцию добавления задачи
      onAddTodo({ title, priority });

      // Очищаем поле ввода
      setTitle("");
      setPriority("medium");
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Введите название задачи"
        required
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        aria-label="Приоритет задачи"
      >
        <option value="high">Высокий</option>
        <option value="medium">Средний</option>
        <option value="low">Низкий</option>
      </select>
      <button type="submit">Добавить</button>
    </form>
  );
};
