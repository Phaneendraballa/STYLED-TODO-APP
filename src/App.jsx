
import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

function App() {
  // State
  const [todos, setTodos] = useState(() => {
    const raw = localStorage.getItem("todos_v2");
    return raw ? JSON.parse(raw) : [];
  });
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | completed

  const inputRef = useRef(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("todos_v2", JSON.stringify(todos));
  }, [todos]);

  const remaining = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos]
  );

  const filteredTodos = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  // Handlers
  const addTodo = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const newTodo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id) => {
    // add a transient exit animation flag
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, _removing: true } : t)));
    // wait for CSS animation duration (match --anim-duration in CSS)
    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }, 220);
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      addTodo(e);
    }
  };

  return (
    <div className="page">
      <main className="card">
        <header className="card__header">
          <h1 className="app-title">Todo</h1>
          <p className="app-subtitle">
            Stay organized. {remaining} task{remaining !== 1 ? "s" : ""} left.
          </p>
        </header>

        <section className="form-section">
          <form className="todo-form" onSubmit={addTodo}>
            <div className="input-wrap">
              <span className="input-icon" aria-hidden>📝</span>
              <input
                ref={inputRef}
                type="text"
                className="todo-input"
                placeholder="Add a new task..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="New todo"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              aria-label="Add todo"
              title="Add todo"
            >
              <span className="btn-icon" aria-hidden>＋</span>
              <span className="btn-text">Add</span>
            </button>
          </form>

          <div className="filters">
            <button
              className={`chip ${filter === "all" ? "chip--active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`chip ${filter === "active" ? "chip--active" : ""}`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={`chip ${filter === "completed" ? "chip--active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
            <div className="spacer" />
            <button
              className="btn btn-ghost small"
              onClick={clearCompleted}
              disabled={!todos.some((t) => t.completed)}
              title="Clear completed"
            >
              Clear completed
            </button>
          </div>
        </section>

        <section className="list-section">
          {filteredTodos.length === 0 ? (
            <div className="empty">
              <div className="empty__illustration" aria-hidden>📭</div>
              <p className="empty__text">
                {todos.length === 0
                  ? "Your list is empty. Add your first task!"
                  : "Nothing here. Try a different filter."}
              </p>
            </div>
          ) : (
            <ul className="todo-list" role="list">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className={`todo-item ${todo.completed ? "is-completed" : ""} ${
                    todo._removing ? "is-removing" : ""
                  }`}
                >
                  <button
                    className={`checkbox ${todo.completed ? "checkbox--on" : ""}`}
                    onClick={() => toggleTodo(todo.id)}
                    aria-pressed={todo.completed}
                    aria-label={todo.completed ? "Mark as active" : "Mark as completed"}
                    title={todo.completed ? "Mark as active" : "Mark as completed"}
                  >
                    {todo.completed ? "✓" : ""}
                  </button>

                  <span className="todo-text">{todo.text}</span>

                  <div className="actions">
                    <button
                      className="icon-btn danger"
                      onClick={() => deleteTodo(todo.id)}
                      aria-label="Delete todo"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="card__footer">
          <small className="meta">
            Built with React • Smooth transitions • Responsive layout
          </small>
        </footer>
      </main>
    </div>
  );
}

export default App;