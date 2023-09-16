import { useState, useEffect } from 'react';
function TaskItem(props) {
    const [taskDescription, setTaskDescription] = useState("");
    useEffect(()=>{
        setTaskDescription(props.description)
    }, [])
    useEffect(() => {
        props.UpdateTask(props.id, taskDescription)
    }, [taskDescription])
    const HandleTextInput = (NewValue) =>{
        console.log("Text inptu received, updating value")
        setTaskDescription(NewValue)
    }
    return (
        <div className="TaskItem">
            <button type="checkbox" onClick={()=>{props.MarkTaskAsComplete(props.id)}} className="TaskItemCheckbox">Done</button>
            <input className="TaskItemInput" disabled={props.TaskComplete} value={taskDescription} onChange={event => HandleTextInput(event.target.value)}></input>
        </div>
    )
}

export default TaskItem;