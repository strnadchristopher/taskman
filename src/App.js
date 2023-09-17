import './App.css';
import Sidebar from './components/Sidebar';
import TaskItem from './components/TaskItem';
import { useEffect, useState } from 'react';

function App() {
  const [taskList, setTaskList] = useState([]);
  useEffect(() => {
    LoadTaskDB();
  }, []);
  const LoadTaskDB = () => {
    let taskDB = localStorage.getItem("taskDB");
    setTaskList((JSON.parse(taskDB) || []).filter((taskItem) => {
      return taskItem.description !== "";
    }) || []);
    if (!taskDB) {
      localStorage.setItem("taskDB", JSON.stringify([]))
    }
  }
  useEffect(() => {
    SaveTaskDB();
  }, [taskList])
  const SaveTaskDB = () => {
    localStorage.setItem("taskDB", JSON.stringify(taskList))
  }
  const CreateNewTask = () => {
    let NewUUID = (() => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, a => (a ^ Math.random() * 16 >> a / 4).toString(16)))();
    let NewTask = {
      id: NewUUID,
      description: "",
      complete: false,
      pinned: false,
      dateCreated: new Date().getTime(),
      dateCompleted: null,
      priority: 0,
    }
    let NewTaskList = [...taskList, NewTask];
    setTaskList(NewTaskList);
  }

  const DeleteTask = (taskId) => {
    let NewTaskList = [...taskList];
    let TaskIndex = NewTaskList.findIndex((taskItem) => taskItem.id === taskId);
    NewTaskList.splice(TaskIndex, 1);
    setTaskList(NewTaskList);
  }

  const ClearTasks = () => {
    setTaskList([]);
  }

  const UpdateTask = (taskId, taskDescription) => {
    let NewTaskList = [...taskList];
    let TaskIndex = NewTaskList.findIndex((taskItem) => taskItem.id === taskId);
    NewTaskList[TaskIndex].description = taskDescription;
    setTaskList(NewTaskList);
  }

  const MarkTaskAsComplete = (taskId) => {
    let NewTaskList = [...taskList];
    let TaskIndex = NewTaskList.findIndex((taskItem) => taskItem.id === taskId);
    NewTaskList[TaskIndex].complete = !NewTaskList[TaskIndex].complete;
    setTaskList(NewTaskList);
  }

  const MarkTaskAsPinned = (taskId) => {
    let NewTaskList = [...taskList];
    let TaskIndex = NewTaskList.findIndex((taskItem) => taskItem.id === taskId);
    NewTaskList[TaskIndex].pinned = !NewTaskList[TaskIndex].pinned;
    setTaskList(NewTaskList);
  }

  const SetTaskPriority = (taskId, priority) => {
    let NewTaskList = [...taskList];
    let TaskIndex = NewTaskList.findIndex((taskItem) => taskItem.id === taskId);
    NewTaskList[TaskIndex].priority = priority;
    setTaskList(NewTaskList);
  }

  return (
    <div className="App">
      <h1>Task Man by Christopher</h1>
      <h2>Today's Tasks</h2>
      {taskList.filter((taskItem) => { return !taskItem.complete })
        .sort((a, b) => {
          // Sort by pinned, with pinned tasks first
          if (a.pinned && !b.pinned) {
            return -1;
          } else if (!a.pinned && b.pinned) {
            return 1;
          }
          // Sort by priority, with higher priority tasks first
          if (a.priority > b.priority) {
            return -1;
          } else if (a.priority < b.priority) {
            return 1;
          }
          // Sort by dateCreated, with earlier tasks first
          if (a.dateCreated < b.dateCreated) {
            return -1;
          } else if (a.dateCreated > b.dateCreated) {
            return 1;
          }
          return 0;
        })
        .map((taskItem) => (
          <TaskItem
            DeleteTask={DeleteTask}
            CreateNewTask={CreateNewTask}
            MarkTaskAsComplete={MarkTaskAsComplete}
            UpdateTask={UpdateTask}
            SetTaskPriority={SetTaskPriority}
            MarkTaskAsPinned={MarkTaskAsPinned}
            key={taskItem.id}
            id={taskItem.id}
            description={taskItem.description}
            complete={taskItem.complete}
            pinned={taskItem.pinned}
            priority={taskItem.priority}
            dateCreated={taskItem.dateCreated}
          />
        ))}
      <AddTaskItemButton ClearTasks={ClearTasks} CreateNewTask={CreateNewTask} />
      <h2>Completed Tasks</h2>
      {taskList.filter((taskItem) => { return taskItem.complete })
        .sort((a, b) => {
          // Sort by date completed, with earlier tasks first
          if (a.dateCompleted < b.dateCompleted) {
            return -1;
          } else if (a.dateCompleted > b.dateCompleted) {
            return 1;
          }
          return 0;
        })
        .map((taskItem) => (
          <TaskItem
            DeleteTask={DeleteTask}
            CreateNewTask={CreateNewTask}
            MarkTaskAsComplete={MarkTaskAsComplete}
            UpdateTask={UpdateTask}
            SetTaskPriority={SetTaskPriority}
            MarkTaskAsPinned={MarkTaskAsPinned}
            key={taskItem.id}
            id={taskItem.id}
            description={taskItem.description}
            complete={taskItem.complete}
            pinned={taskItem.pinned}
            priority={taskItem.priority}
            dateCreated={taskItem.dateCreated}
          />
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
