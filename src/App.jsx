import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';

const App = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskTitle.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), title: taskTitle, completed: false, priority: "Low" }]);
    setTaskTitle("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleCompletion = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updatePriority = (id, priority) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, priority } : task
    ));
  };

  const sortTasks = (criteria) => {
    const sortedTasks = [...tasks].sort((a, b) => {
      if (criteria === "priority") {
        return a.priority.localeCompare(b.priority);
      } else if (criteria === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
    setTasks(sortedTasks);
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-100 rounded-lg shadow-lg  mt-32" >
      <h1 className="text-2xl font-bold text-center text-indigo-600 mb-4">FLARELINK Task</h1>
      
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Add a task"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={addTask}
          className="p-2 bg-indigo-500 text-white rounded-r-md hover:bg-indigo-600 transition"
        >
          Add Task
        </button>
      </div>

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="mb-4 flex justify-between">
        <button
          onClick={() => sortTasks("title")}
          className="p-2 bg-gray-200 text-gray-700 rounded-md border shadow-md hover:bg-gray-300 transition"
        >
          Sort by Title
        </button>
        <button
          onClick={() => sortTasks("priority")}
          className="p-2 bg-gray-200 text-gray-700 border shadow-md rounded-md hover:bg-gray-300 transition"
        >
          Sort by Priority
        </button>
      </div>

      <motion.ul className="space-y-2">
        {filteredTasks.map(task => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-between items-center p-2 border border-gray-300 rounded-md bg-white shadow-sm"
          >
            <span
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              onClick={() => toggleCompletion(task.id)}
              className="flex-1 cursor-pointer"
            >
              {task.title}
            </span>

            <select
              onChange={(e) => updatePriority(task.id, e.target.value)}
              value={task.priority}
              className="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <button
              onClick={() => deleteTask(task.id)}
              className="ml-2 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Delete
            </button>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default App;
