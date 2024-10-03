import React, { useState } from "react";
import "./TaskForm.css";

const TaskForm = ({ onAddTask, categories: initialCategories }) => {
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [dueDate, setDueDate] = useState(""); // New state for due date

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      title,
      progress: completed ? 100 : progress,
      completed: completed || progress === 100,
      categories,
      dueDate: dueDate || null, // Include due date in the new task
    };
    onAddTask(newTask, categories); // Pass categories as second argument
    setTitle("");
    setProgress(0);
    setCompleted(false);
    setCategories([]);
    setNewCategory("");
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category) => {
    setCategories(categories.filter((cat) => cat !== category));
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Add New Task</h2>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div className="category-input">
        <input
          type="text"
          placeholder="Add category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="button" onClick={handleAddCategory}>
          Add
        </button>
      </div>
      <div className="category-labels">
        {categories.map((category) => (
          <span key={category} className="category-label">
            {category}
            <button
              type="button"
              onClick={() => handleRemoveCategory(category)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="number"
        placeholder="Progress"
        value={progress}
        onChange={(e) => setProgress(parseInt(e.target.value))}
        min="0"
        max="100"
        required
      />
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
        Completed
      </label>
      <label htmlFor="dueDate">Due Date:</label>
      <input
        id="dueDate"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
