import './App.css';
import Sidebar from './components/Sidebar';
import TaskItem from './components/TaskItem';
import { useEffect, useState } from 'react';

function App() {
  const [taskItemIds, setTaskItemIds] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [completedTaskItemIds, setCompletedTaskItemIds] = useState([]);
  const [completedTaskList, setCompletedTaskList] = useState([]);

  useEffect(() => {
    // Read task item IDs from local storage
    const foundTaskItemIds = localStorage.getItem("taskItemIds");

    if (foundTaskItemIds) {
      const ids = foundTaskItemIds.split(";").filter(Boolean); // Remove empty strings
      setTaskItemIds(ids);

      // Initialize the taskList based on the retrieved IDs
      const foundTaskListItems = ids.map((itemId) => ({
        id: itemId,
        description: localStorage.getItem(itemId) || "", // Handle missing descriptions
      }));
      setTaskList(foundTaskListItems);
    }

    // Read completed task item IDs from local storage
    const foundCompletedTaskItemIds = localStorage.getItem("completedTaskItemIds");

    if (foundCompletedTaskItemIds) {
      const ids = foundCompletedTaskItemIds.split(";").filter(Boolean); // Remove empty strings
      setCompletedTaskItemIds(ids);

      // Initialize the taskList based on the retrieved IDs
      const foundCompletedTaskListItems = ids.map((itemId) => ({
        id: itemId,
        description: localStorage.getItem(itemId) || "", // Handle missing descriptions
      }));
      setCompletedTaskList(foundCompletedTaskListItems);
    }
  }, []);

  const CreateNewTask = () => {
    // Create a 15 char random string of letters and numbers
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let NewTaskId = '';
    for (let i = 0; i < 15; i++) {
      NewTaskId += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    let NewTask = { "id": NewTaskId, "description": "" };

    // Update taskItemIds and taskList
    const newTaskItemIds = [...taskItemIds, NewTaskId];
    setTaskItemIds(newTaskItemIds);

    // Update the local storage with the new task item IDs
    const stringifiedItemIds = newTaskItemIds.join(";");
    localStorage.setItem("taskItemIds", stringifiedItemIds);

    const newTaskList = [...taskList, NewTask];
    setTaskList(newTaskList);
  }

  const ClearTasks = () => {
    // Clear taskItemIds and taskList, and remove the data from local storage
    setTaskItemIds([]);
    setTaskList([]);
    localStorage.removeItem("taskItemIds");

    // Clear completedTaskItemIds and completedTaskList, and remove the data from local storage
    setCompletedTaskItemIds([]);
    setCompletedTaskList([]);
    localStorage.removeItem("completedTaskItemIds");
  }

  const UpdateTask = (taskId, taskDescription) => {
    localStorage.setItem(taskId, taskDescription);
    console.log("Updated task " + taskId + " to read " + taskDescription)
  }

  const MarkTaskAsComplete = (taskId) =>{
    console.log("Marking task " + taskId + " as complete")
    localStorage.removeItem(taskId);

    // Update taskItemIds and taskList
    const newTaskItemIds = taskItemIds.filter((id) => id !== taskId);
    setTaskItemIds(newTaskItemIds);

    // Update the local storage with the new task item IDs
    const stringifiedItemIds = newTaskItemIds.join(";");
    localStorage.setItem("taskItemIds", stringifiedItemIds);

    const newTaskList = taskList.filter((task) => task.id !== taskId);
    setTaskList(newTaskList);

    // Update completedTaskItemIds and completedTaskList
    const newCompletedTaskItemIds = [...completedTaskItemIds, taskId];
    setCompletedTaskItemIds(newCompletedTaskItemIds);

    // Update the local storage with the new task item IDs
    const stringifiedCompletedItemIds = newCompletedTaskItemIds.join(";");
    localStorage.setItem("completedTaskItemIds", stringifiedCompletedItemIds);

    const newCompletedTaskList = [...completedTaskList, taskId];
    setCompletedTaskList(newCompletedTaskList);
  }

  return (
    <div className="App">
      <h1>Task Man</h1>
      {taskList.map((taskItem) => (
        <TaskItem MarkTaskAsComplete={MarkTaskAsComplete} UpdateTask={UpdateTask} key={taskItem.id} id={taskItem.id} description={taskItem.description} />
      ))}
      <AddTaskItemButton ClearTasks={ClearTasks} CreateNewTask={CreateNewTask} />
      <h1>Completed Tasks</h1>
      {completedTaskList.map((taskItem) => (
        <TaskItem TaskComplete={true} MarkTaskAsComplete={MarkTaskAsComplete} UpdateTask={UpdateTask} key={taskItem.id} id={taskItem.id} description={taskItem.description} />
      ))}
    </div>
  );
}

function AddTaskItemButton(props) {
  return (
    <div className="AddTaskItemButton" onContextMenu={props.ClearTasks} onClick={props.CreateNewTask}>
      <span className='AddTaskItemButtonIcon'>+</span>
    </div>
  )
}

export default App;
