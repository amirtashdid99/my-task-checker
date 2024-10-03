import React, { useState, useEffect } from "react";
import Task from "./Task";
import "./TaskList.css";

const TaskList = ({
  tasks,
  onUpdateProgress,
  onUpdateTask,
  onAddCategory,
  onReorder,
}) => {
  const [localTasks, setLocalTasks] = useState(tasks);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e, overIndex) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    if (draggedIndex !== overIndex) {
      const newTasks = Array.from(localTasks);
      const [draggedTask] = newTasks.splice(draggedIndex, 1);
      newTasks.splice(overIndex, 0, draggedTask);
      setLocalTasks(newTasks);
      setDraggedIndex(overIndex);
    }
  };

  const handleDragEnd = () => {
    onReorder(localTasks.map((task) => task.id));
    setDraggedIndex(null);
  };

  return (
    <div className="task-list">
      <p className="reorder-hint">
        Tip: Use the ≡ handle to drag and reorder tasks.
      </p>
      {localTasks.map((task, index) => (
        <div
          key={task.id}
          onDragOver={(e) => handleDragOver(e, index)}
          className={`task-item ${draggedIndex === index ? "dragging" : ""}`}
        >
          <Task
            task={task}
            onUpdateProgress={onUpdateProgress}
            onUpdateTask={onUpdateTask}
            onAddCategory={onAddCategory}
            dragHandleProps={{
              draggable: true,
              onDragStart: (e) => handleDragStart(e, index),
              onDragEnd: handleDragEnd,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
