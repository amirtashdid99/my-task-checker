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
  const [isDragging, setIsDragging] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(task.completed);

  useEffect(() => {
    setCategories(task.categories || []);
    setProgress(task.progress || 0);
    setLocalCompleted(task.completed);
  }, [task.categories, task.progress, task.completed]);

  const handleProgressChange = (e) => {
    const newProgress = parseInt(e.target.value, 10);
    setProgress(newProgress);
    setLocalCompleted(newProgress === 100);
  };

  const handleProgressChangeEnd = () => {
    onUpdateProgress(task.id, progress, localCompleted);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      onUpdateTask(task.id, { ...task, categories: updatedCategories });
      onAddCategory(newCategory);
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

  const getProgressBarColor = (progress) => {
    if (progress <= 25) return "#FF4136"; // Beautiful red
    if (progress <= 50) return "#FF851B"; // Harmonic orange
    if (progress <= 75) return "#FFDC00"; // Yellow
    if (progress < 100) return "#32CD32"; // Lime green
    return "#209e30"; // Dark green for 100%
  };

  return (
    <div className={`task ${isDragging ? "dragging" : ""}`}>
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
            backgroundColor: getProgressBarColor(progress),
          }}
        ></div>
        <span
          className="progress-text"
          style={{
            color: progress > 50 ? "white" : "black", // Adjust text color for better visibility
          }}
        >
          {progress}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleProgressChange}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => {
          setIsDragging(false);
          handleProgressChangeEnd();
        }}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => {
          setIsDragging(false);
          handleProgressChangeEnd();
        }}
      />
      <p>{localCompleted ? "Completed" : "Incomplete"}</p>
    </div>
  );
};

export default Task;
