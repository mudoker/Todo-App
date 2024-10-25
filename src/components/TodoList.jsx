import React, { useState, useContext, useMemo, useEffect } from "react";
import Form from "./Form";
import { RiCloseCircleLine } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";
import { FaCheckCircle } from "react-icons/fa";
import "../App.css";

const TodosContext = React.createContext([]);

function TodoList() {
  const [todos, setTodo] = useState([]);
  const [filter, setFilter] = useState("all");
  const [lastDeleted, setLastDeleted] = useState(null);

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos"));
    if (savedTodos) setTodo(savedTodos);
  }, []);

  // Save todos to localStorage on change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) return;
    const newTodos = [todo, ...todos];
    setTodo(newTodos);
  };

  const removeTodo = (id) => {
    const removedTodo = todos.find((todo) => todo.id === id);
    setLastDeleted(removedTodo);
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodo(newTodos);
  };

  const undoDelete = () => {
    if (lastDeleted) {
      setTodo([lastDeleted, ...todos]);
      setLastDeleted(null);
    }
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) return;
    setTodo((prev) =>
      prev.map((item) => (item.id === todoId ? newValue : item))
    );
  };

  const completeTodo = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) todo.isComplete = !todo.isComplete;
      return todo;
    });
    setTodo(updatedTodos);
  };

  const filterTodos = (todos, filter) => {
    return todos.filter((todo) => {
      if (filter === "all") return true;
      if (filter === "completed") return todo.isComplete;
      if (filter === "priority") return todo.priority === "high";
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
        <button onClick={() => setFilter("priority")}>High Priority</button>
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
      className={todo.isComplete ? "todo-row complete" : "todo-row"}
      style={{ borderColor: todo.priority === "high" ? "#ff0000" : "#ffffff" }}
    >
      <div key={todo.id}>{todo.text}</div>
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
          onClick={() => setEdit({ id: todo.id, value: todo.text })}
          className="edit-icon"
        />
      </div>
    </div>
  );
}

export default TodoList;
