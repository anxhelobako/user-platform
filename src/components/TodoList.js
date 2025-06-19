import React, { useState, useEffect } from "react";

const TodosList = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  return (
    <div>
      <h2>✅ Todo List</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.completed ? "✔" : "❌"} {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodosList;
