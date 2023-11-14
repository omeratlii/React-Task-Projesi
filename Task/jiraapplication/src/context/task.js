import { createContext } from "react";
import axios from "axios";
import { useState } from "react";

const TaskContext = createContext();

// hepsini burada bir function'a atadık, provider.
// index.js'e koyarak kullandık çünkü tum uygulamada geçerli olmasını istiyoruz. 

function Provider({ children }) {
  const [tasks, setTasks] = useState([]);
  const createTask = async (title, taskDesc) => {
    const response = await axios.post("http://localhost:3001/tasks", {
      title,
      taskDesc,
    });

    console.log(response);
    const createdTasks = [...tasks, response.data];
    setTasks(createdTasks);
  };

  const fetchTasks = async () => {
    const response = await axios.get("http://localhost:3001/tasks");
    setTasks(response.data);
  };

  const deleteTaskById = async (id) => {
    await axios.delete(`http://localhost:3001/tasks/${id}`);
    const afterDeletingTasks = tasks.filter((task) => {
      return task.id !== id;
    });
    setTasks(afterDeletingTasks);
  };

  const editTaskById = async (id, updatedTitle, updatedTaskDesc) => {
    await axios.put(`http://localhost:3001/tasks/${id}`, {
      title: updatedTitle,
      taskDesc: updatedTaskDesc,
    });
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { id: id, title: updatedTitle, taskDesc: updatedTaskDesc };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const sharedValuesAndMethods = {
    tasks,
    createTask,
    fetchTasks,
    editTaskById,
    deleteTaskById,
  };
  // return ederken value kısmına objeyi yazdık. obje içerisinde tüm değerler var hepsine erişebiliyoruz.
  // örneğin app componentinde context'ten fetchtasks metodunu çektik.
  // taskshow componentinde edittaskbyid ve deletetaskbyid metodlarını çektik.
  // tasklist componentinde var olan taskları yani tasks'ı çektik.
  // taskcreate componentinde createtask metodunu çektik.
  return (
    <TaskContext.Provider value={sharedValuesAndMethods}>
      {children}
    </TaskContext.Provider>
  );
}

export { Provider };
export default TaskContext;
