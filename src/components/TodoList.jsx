// src/components/TodoList.js
import React, { useState, useMemo, useEffect } from "react";
import axiosInstance from "../api/axios";
import Form from "./Form";
import { RiCloseCircleLine } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";
import { FaCheckCircle } from "react-icons/fa";
import "../App.css";

const TodosContext = React.createContext([]);

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [lastDeleted, setLastDeleted] = useState(null);

  // Fetch tasks from the backend API on mount
  useEffect(() => {
    axiosInstance
      .get("/tasks")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const addTodo = (todo) => {
    if (!todo.title || /^\s*$/.test(todo.title)) return;
    axiosInstance
      .post("/add-task", todo)
      .then(() => {
        setTodos((prev) => [todo, ...prev]);
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  const removeTodo = (id) => {
    axiosInstance
      .delete(`/delete-task?id=${id}`)
      .then(() => {
        const removedTodo = todos.find((todo) => todo.id === id);
        setLastDeleted(removedTodo);
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  const undoDelete = () => {
    if (lastDeleted) {
      addTodo(lastDeleted);
      setLastDeleted(null);
    }
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.title || /^\s*$/.test(newValue.title)) return;
    axiosInstance
      .put(`/update-task?id=${todoId}`, newValue)
      .then(() => {
        setTodos((prev) =>
          prev.map((item) => (item.id === todoId ? newValue : item))
        );
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  const completeTodo = (id) => {
    const updatedTodo = todos.find((todo) => todo.id === id);
    const updatedStatus = !updatedTodo.completed; // Updated to use 'completed'

    axiosInstance
      .put(`/update-task?id=${id}`, {
        // Send updated payload
        title: updatedTodo.title,
        completed: updatedStatus, // Updated
        priority: updatedTodo.priority,
      })
      .then(() => {
        setTodos(
          (prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, completed: updatedStatus } : item
            ) // Updated
        );
      })
      .catch((error) => console.error("Error completing task:", error));
  };

  const filterTodos = (todos, filter) => {
    return todos.filter((todo) => {
      if (filter === "all") return true;
      if (filter === "completed") return todo.completed; // Updated
      if (filter === "priority") return todo.priority === "HIGH";
      return true;
    });
  };

  const filteredTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter]
  );

  return (
    <div className="todo-app">
      <h1>Today's Tasks!</h1>
      <Form onSubmit={addTodo} />
      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("priority")}>HIGH Priority</button>
      </div>
      <TodosContext.Provider value={filteredTodos}>
        {filteredTodos.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            completeTodo={completeTodo}
            removeTodo={removeTodo}
            updateTodo={updateTodo}
          />
        ))}
      </TodosContext.Provider>
      {lastDeleted && <button onClick={undoDelete}>Undo Delete</button>}
    </div>
  );
}

function Todo({ todo, completeTodo, removeTodo, updateTodo }) {
  const [edit, setEdit] = useState({ id: null, value: "" });

  const submitUpdate = (value) => {
    updateTodo(edit.id, value);
    setEdit({ id: null, value: "" });
  };

  if (edit.id) return <Form edit={edit} onSubmit={submitUpdate} />;

  return (
    <div
      className={todo.completed ? "todo-row complete" : "todo-row"} // Updated
      style={{ borderColor: todo.priority === "HIGH" ? "#ff0000" : "#ffffff" }}
    >
      <div key={todo.id}>{todo.title}</div>
      <div className="icons">
        <FaCheckCircle
          onClick={() => completeTodo(todo.id)}
          className="complete-icon"
        />
        <RiCloseCircleLine
          onClick={() => removeTodo(todo.id)}
          className="delete-icon"
        />
        <TiEdit
          onClick={() => setEdit({ id: todo.id, value: todo.title })}
          className="edit-icon"
        />
      </div>
    </div>
  );
}

export default TodoList;
