"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [prevTasks, setPrevTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    doAt: "",
    createdAt: new Date().toLocaleString(),
    status: "pending",
  });
  const [updateTask, setUpdateTask] = useState({
    id: "",
    title: "",
    description: "",
    doAt: "",
  });

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
      setPrevTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskSelected = (id) => {
    const newTask = tasks.map((i) =>
      i.id === id ? { ...i, status: "completed" } : i
    );
    setTasks(newTask);
    setPrevTasks(newTask);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((i) => i.id !== id));
  };

  const handleUpdateTask = () => {
    const updatedTask = tasks.map((i) =>
      i.id === updateTask.id
        ? {
          ...i,
          title: updateTask.title,
          description: updateTask.description,
          doAt: updateTask.doAt,
        }
        : i
    );
    setTasks(updatedTask);
    setPrevTasks(updatedTask);
    setIsEdit(false);
    setUpdateTask({ id: "", title: "", description: "", doAt: "" });
  };

  const handleAddTask = () => {
    const newId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    setTasks([...tasks, { ...newTask, id: newId }]);
    setPrevTasks([...tasks, { ...newTask, id: newId }]);
    // setIsOpen(false);
    // setNewTask({
    //   title: "",
    //   description: "",
    //   doAt: "",
    //   createdAt: new Date().toLocaleString(),
    //   status: "pending",
    // });
  };
  
  const handleFilter = (f) => {
    if (f === "all") {
      setTasks(prevTasks); // reset to original list
    } else {
      const filteredTasks = prevTasks.filter((t) => t.status === f); // always filter from full list
      setTasks(filteredTasks);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto my-10 px-5">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-extrabold text-4xl text-gray-800 tracking-tight">
            Todo List
          </h1>
          <button
            onClick={() => setIsOpen(true)}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow hover:scale-105 transition"
          >
            + Add Task
          </button>
        </div>
        <div className="my-3">
          <button onClick={() => { handleFilter('pending') }} className="bg-white outline outline-gray-400 rounded-sm px-3 py-1 mr-2 cursor-pointer   hover:bg-yellow-100 hover:text-yellow-700">Pending</button>
          <button onClick={() => { handleFilter('completed') }} className="bg-white outline outline-gray-400 rounded-sm px-3 py-1 mr-2 cursor-pointer   hover:bg-green-100 hover:text-green-700">Completed</button><button onClick={() => { handleFilter('all') }} className="bg-white outline outline-gray-400 rounded-sm px-3 py-1 mr-2 cursor-pointer   hover:bg-black hover:text-white">All</button>
        </div>
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`flex justify-between items-center p-5 rounded-xl shadow-md border transition hover:shadow-lg ${task.status === "completed"
                  ? "bg-gray-100 text-gray-500"
                  : "bg-white"
                  }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    disabled={task.status === "completed"}
                    onChange={() => handleTaskSelected(task.id)}
                    className="h-5 w-5 accent-indigo-600 mt-1"
                  />
                  <div>
                    <h3
                      className={`text-lg font-semibold ${task.status === "completed" ? "line-through" : ""
                        }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-sm">{task.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Do on: {task.doAt}
                    </p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setIsEdit(true);
                      setUpdateTask({
                        id: task.id,
                        title: task.title,
                        description: task.description,
                        doAt: task.doAt,
                      });
                    }}
                    className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg shadow"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-lg">No tasks yet</p>
          )}
        </div>
      </div>



      {/* Update Task Modal */}
      {isEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-1/3 animate-fadeIn">
            <h2 className="text-xl font-bold mb-4">Update Task</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Title"
                value={updateTask.title}
                onChange={(e) =>
                  setUpdateTask({ ...updateTask, title: e.target.value })
                }
                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                placeholder="Description"
                value={updateTask.description}
                onChange={(e) =>
                  setUpdateTask({
                    ...updateTask,
                    description: e.target.value,
                  })
                }
                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="datetime-local"
                value={updateTask.doAt}
                onChange={(e) =>
                  setUpdateTask({ ...updateTask, doAt: e.target.value })
                }
                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setIsEdit(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTask}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-1/3 animate-fadeIn">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="datetime-local"
                value={newTask.doAt}
                onChange={(e) =>
                  setNewTask({ ...newTask, doAt: e.target.value })
                }
                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <select
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
