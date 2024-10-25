import { useState } from "react";
import "../App.css";

function Form(props) {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("medium"); // State for task priority

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handleTodoSubmit = (e) => {
    e.preventDefault();

    props.onSubmit({
      id: Math.floor(Math.random() * 10000),
      text: input,
      priority,
    });
    setInput("");
  };

  return (
    <form className="todo-form" onSubmit={handleTodoSubmit}>
      <input
        type="text"
        placeholder="Type something..."
        value={input}
        name="task"
        onChange={handleChange}
        className="todo-input"
      />
      <select
        value={priority}
        onChange={handlePriorityChange}
        className="priority-select"
      >
        <option style={{ background: "rgba(255, 0, 0, 0.8)" }} value="high">
          High
        </option>
        <option style={{ background: "rgba(255, 255, 0, 0.8)" }} value="medium">
          Medium
        </option>
        <option style={{ background: "rgba(0, 255, 0, 0.8)" }} value="low">
          Low
        </option>
      </select>
      <button className="todo-button">Add Task</button>
    </form>
  );
}

export default Form;
