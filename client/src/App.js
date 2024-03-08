import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/tasks")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  const handleAddTask = () => {
    axios
      .post("http://localhost:5000/tasks", { title, description })
      .then((response) => {
        setTasks([
          ...tasks,
          { id: response.data.id, title, description, completed: false },
        ]);
        setTitle("");
        setDescription("");
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  const handleUpdateTask = (id, completed) => {
    axios
      .put(`http://localhost:5000/tasks/${id}`, { completed: !completed })
      .then(() => {
        const updatedTasks = tasks.map((task) => {
          if (task.id === id) {
            task.completed = !completed;
          }
          return task;
        });
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  const handleDeleteTask = (id) => {
    axios
      .delete(`http://localhost:5000/tasks/${id}`)
      .then(() => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  return (
    <>
      <div className="title">
        <h1>TASK MANAGER</h1>
      </div>
      <div className="main-div">
        <div className="form-div">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleAddTask}>Add Task</button>
        </div>
        {tasks.length > 0 && (
          <div className="show-table">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>S.No. </th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Actions</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, key) => (
                  <tr key={task.id}>
                    <td>{key + 1}</td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td className="actions">
                      <button className="checkedbutton"
                        onClick={() =>
                          handleUpdateTask(task.id, task.completed)
                        }
                      >
                        <FaCheckCircle />
                      </button>
                      <button className="deletebutton" onClick={() => handleDeleteTask(task.id)}>
                        <MdDelete />
                      </button>
                    </td>
                    <td>
                      {task.completed ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
