import React, { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import Profile from "./components/Profile";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sortMethod, setSortMethod] = useState("custom");
  const [customOrder, setCustomOrder] = useState([]);

  useEffect(() => {
    // Use process.env.PUBLIC_URL to get the correct base path
    fetch(`${process.env.PUBLIC_URL}/tasks.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data);
        setCustomOrder(data.map((task) => task.id));
        // Extract unique categories from tasks
        const uniqueCategories = [
          ...new Set(data.flatMap((task) => task.categories || [])),
        ];
        setCategories(uniqueCategories);
      })
      .catch((error) => console.error("Error loading tasks:", error));
  }, []);

  const handleAddCategory = (newCategory) => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  const handleUpdateProgress = (taskId, newProgress, newCompleted) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, progress: newProgress, completed: newCompleted }
          : task
      )
    );
  };

  const handleAddTask = (newTask) => {
    const taskWithId = { ...newTask, id: Date.now() };
    setTasks([...tasks, taskWithId]);
    setCustomOrder([...customOrder, taskWithId.id]);
    newTask.categories.forEach(handleAddCategory);
    setIsFormOpen(false);
  };

  const handleUpdateTask = (taskId, updatedTask) => {
    setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
    updatedTask.categories.forEach(handleAddCategory);
  };

  const handleReorder = (newOrder) => {
    const newTasks = newOrder.map((id) => tasks.find((task) => task.id === id));
    setTasks(newTasks);
    setCustomOrder(newOrder);
    setSortMethod("custom");
  };

  const sortTasks = (tasksToSort) => {
    switch (sortMethod) {
      case "name":
        return [...tasksToSort].sort((a, b) => a.title.localeCompare(b.title));
      case "date":
        return [...tasksToSort].sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );
      case "custom":
        return customOrder
          .map((id) => tasksToSort.find((task) => task.id === id))
          .filter(Boolean);
      default:
        return tasksToSort;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "incomplete" && !task.completed);
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      (task.categories && task.categories.includes(categoryFilter));
    return matchesFilter && matchesSearch && matchesCategory;
  });

  const filteredAndSortedTasks = sortTasks(filteredTasks);

  const handleModalClose = (e) => {
    // Check if the click is on the overlay itself, not its children
    if (e.target.className === "modal-overlay") {
      setIsFormOpen(false);
    }
  };

  return (
    <div className="app">
      <div className="content">
        <h1> Student Tasks </h1> <LoginButton />
        <LogoutButton />
        <Profile />
        <div className="top-controls">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={() => setIsFormOpen(true)} className="add-task-btn">
            Add Task{" "}
          </button>{" "}
        </div>{" "}
        <div className="filters">
          <div className="buttons">
            <button
              onClick={() => setFilter("all")}
              className={`all ${filter === "all" ? "active" : ""}`}
            >
              All{" "}
            </button>{" "}
            <button
              onClick={() => setFilter("completed")}
              className={`completed ${filter === "completed" ? "active" : ""}`}
            >
              Completed{" "}
            </button>{" "}
            <button
              onClick={() => setFilter("incomplete")}
              className={`incomplete ${
                filter === "incomplete" ? "active" : ""
              }`}
            >
              Incomplete{" "}
            </button>{" "}
          </div>{" "}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter"
          >
            <option value="all"> All Categories </option>{" "}
            {categories.map((category) => (
              <option key={category} value={category}>
                {" "}
                {category}{" "}
              </option>
            ))}{" "}
          </select>{" "}
          <select
            value={sortMethod}
            onChange={(e) => setSortMethod(e.target.value)}
            className="filter-select"
          >
            <option value="custom"> Custom Order </option>{" "}
            <option value="name"> Sort by Name </option>{" "}
            <option value="date"> Sort by Date </option>{" "}
          </select>{" "}
        </div>{" "}
        <TaskList
          tasks={filteredAndSortedTasks}
          onUpdateProgress={handleUpdateProgress}
          onUpdateTask={handleUpdateTask}
          onAddCategory={handleAddCategory}
          onReorder={handleReorder}
          filter={filter}
        />{" "}
      </div>{" "}
      {isFormOpen && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal">
            <button className="close-btn" onClick={() => setIsFormOpen(false)}>
              {" "}
              ×{" "}
            </button>{" "}
            <TaskForm onAddTask={handleAddTask} categories={categories} />{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
};

export default App;
