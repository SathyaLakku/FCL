import React, { useEffect, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type Filter = "all" | "active" | "completed";

const LOCAL_STORAGE_KEY = "todos";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) setTodos(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    if (input.trim() === "") return;
    if (editingId !== null) {
      setTodos(
        todos.map((todo) =>
          todo.id === editingId ? { ...todo, text: input } : todo
        )
      );
      setEditingId(null);
    } else {
      setTodos([
        ...todos,
        { id: Date.now(), text: input, completed: false }
      ]);
    }
    setInput("");
  };

  const handleEdit = (id: number, text: string) => {
    setEditingId(id);
    setInput(text);
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggle = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleFilterChange = (f: Filter) => setFilter(f);

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.text.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>To-Do List</h1>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search todos"
          style={{ width: "100%", padding: 8 }}
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => handleFilterChange("all")}
          style={{
            background: filter === "all" ? "#007bff" : "#eee",
            color: filter === "all" ? "#fff" : "#333",
            border: "none",
            padding: "8px 16px",
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange("active")}
          style={{
            background: filter === "active" ? "#007bff" : "#eee",
            color: filter === "active" ? "#fff" : "#333",
            border: "none",
            padding: "8px 16px",
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          Active
        </button>
        <button
          onClick={() => handleFilterChange("completed")}
          style={{
            background: filter === "completed" ? "#007bff" : "#eee",
            color: filter === "completed" ? "#fff" : "#333",
            border: "none",
            padding: "8px 16px",
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          Completed
        </button>
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          style={{ flex: 1, padding: 8 }}
          placeholder="Add a new to-do"
        />
        <button onClick={handleAdd} style={{ marginLeft: 8 }}>
          {editingId !== null ? "Update" : "Add"}
        </button>
      </div>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
        {filteredTodos.map(todo => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
              background: "#f9f9f9",
              borderRadius: 4,
              padding: 8
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
              style={{ marginRight: 8 }}
            />
            <span
              style={{
                flex: 1,
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "#bbb" : "#222"
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => handleEdit(todo.id, todo.text)} style={{ marginRight: 4 }}>
              Edit
            </button>
            <button onClick={() => handleDelete(todo.id)}>
              Delete
            </button>
          </li>
        ))}
        {filteredTodos.length === 0 && (
          <li style={{ textAlign: "center", color: "#888", padding: 16 }}>
            No todos found.
          </li>
        )}
      </ul>
    </div>
  );
}

export default App;