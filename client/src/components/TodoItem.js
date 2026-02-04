/**
 * Компонент для отображения отдельной задачи
 */
const TodoItem = ({ todo, onToggleComplete, onPriorityChange }) => {
  const [isPriorityOpen, setIsPriorityOpen] = React.useState(false);
  const priorityRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        priorityRef.current &&
        !priorityRef.current.contains(event.target)
      ) {
        setIsPriorityOpen(false);
      }
    };

    if (isPriorityOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPriorityOpen]);
  // Форматирование даты создания
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const priorityLabels = {
    high: "Высокий",
    medium: "Средний",
    low: "Низкий",
  };

  const handlePrioritySelect = (value) => {
    setIsPriorityOpen(false);
    if (value !== todo.priority) {
      onPriorityChange(todo.id, value);
    }
  };

  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggleComplete(todo.id, !todo.completed)}
      />
      <div className="todo-item-content">
        <span className="todo-item-text">{todo.title}</span>
        <span className="created-at">{formatDate(todo.created_at)}</span>
      </div>
      <div className="priority-dropdown-wrapper" ref={priorityRef}>
        <button
          type="button"
          className={`priority-badge priority-${todo.priority}`}
          onClick={() => setIsPriorityOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={isPriorityOpen}
        >
          {priorityLabels[todo.priority] || "Средний"}
        </button>
        {isPriorityOpen && (
          <ul className="priority-dropdown" role="menu">
            {Object.entries(priorityLabels).map(([value, label]) => (
              <li key={value} role="menuitem">
                <button
                  type="button"
                  className={`priority-option ${
                    value === todo.priority ? "active" : ""
                  }`}
                  onClick={() => handlePrioritySelect(value)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};
