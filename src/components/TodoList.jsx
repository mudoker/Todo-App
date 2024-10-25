import React, { useState, useEffect, useContext, useMemo } from "react";
import Form from "./Form";
import { RiCloseCircleLine } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";
import "../App.css";
import { CSSTransition, TransitionGroup } from "react-transition-group"; // For animations

const TodosContext = React.createContext([]);

function TodoList() {
  const [todos, setTodo] = useState(() => {
    // Load from localStorage on initial render
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  });
  const [filter, setFilter] = useState("all");
  const [lastDeletedTodo, setLastDeletedTodo] = useState(null); // For undo functionality

  useEffect(() => {
    // Save todos to localStorage whenever it changes
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) return;
    const newTodos = [todo, ...todos];
    setTodo(newTodos);
  };

  const removeTodo = (id) => {
    const removedTodo = todos.find((todo) => todo.id === id);
    setLastDeletedTodo(removedTodo); // Store the last deleted todo
    const removeArr = todos.filter((todo) => todo.id !== id);
    setTodo(removeArr);
  };

  const undoRemoveTodo = () => {
    if (lastDeletedTodo) {
      setTodo([lastDeletedTodo, ...todos]);
      setLastDeletedTodo(null);
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

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.isComplete;
    if (filter === "active") return !todo.isComplete;
    return true; // 'all' filter
  });

  return (
    <div className="todo-app">
      <h1>Today’s Tasks</h1>
      <Form onSubmit={addTodo} />
      <div className="filter-buttons">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className={filter === "active" ? "active" : ""}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "active" : ""}
        >
          Completed
        </button>
      </div>
      <TodosContext.Provider value={filteredTodos}>
        <TransitionGroup className="todo-list">
          {filteredTodos.map((todo, index) => (
            <CSSTransition key={todo.id} timeout={500} classNames="todo">
              <Todo
                key={index}
                todo={todo}
                completeTodo={completeTodo}
                removeTodo={removeTodo}
                updateTodo={updateTodo}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </TodosContext.Provider>
      {lastDeletedTodo && (
        <button onClick={undoRemoveTodo} className="undo-button">
          Undo Last Delete
        </button>
      )}
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
    <div className={todo.isComplete ? "todo-row complete" : "todo-row"}>
      <div key={todo.id} onClick={() => completeTodo(todo.id)}>
        {todo.text}
      </div>
      <div className="icons">
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
