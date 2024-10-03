import React, { useState, useEffect } from "react";
import "./Task.css";

const Task = ({
  task,
  onUpdateProgress,
  onUpdateTask,
  onAddCategory,
  dragHandleProps,
}) => {
  const [progress, setProgress] = useState(task.progress || 0);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState(task.categories || []);

  useEffect(() => {
    setCategories(task.categories || []);
  }, [task.categories]);

  const handleProgressChange = (e) => {
    const newProgress = parseInt(e.target.value, 10);
    setProgress(newProgress);
    onUpdateProgress(task.id, newProgress);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      onUpdateTask(task.id, { ...task, categories: updatedCategories });
      onAddCategory(newCategory); // Add this line to update the dropdown
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    const updatedCategories = categories.filter(
      (category) => category !== categoryToRemove
    );
    setCategories(updatedCategories);
    onUpdateTask(task.id, { ...task, categories: updatedCategories });
  };

  return (
    <div className="task">
      <div className="task-header">
        <h3>{task.title}</h3>
        <button
          className="drag-handle"
          title="Drag to reorder"
          {...dragHandleProps}
        >
          ≡
        </button>
      </div>
      <div className="category-section">
        <div className="category-labels">
          {categories.map((category, index) => (
            <span key={index} className="category-label">
              <span className="category-label-text">{category}</span>
              <button
                onClick={() => handleRemoveCategory(category)}
                className="remove-category"
                title="Remove category"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <form onSubmit={handleAddCategory} className="category-input">
          <input
            type="text"
            placeholder="Add category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </div>
      <div className="progress-bar-background">
        <div
          className="progress-bar"
          style={{
            width: `${progress}%`,
            backgroundColor: task.completed ? "green" : "blue",
          }}
        ></div>
        <span className="progress-text">{progress}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleProgressChange}
      />
      <p>{task.completed ? "Completed" : "Incomplete"}</p>
    </div>
  );
};

export default Task;
