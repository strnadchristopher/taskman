import { useState, useEffect } from 'react';
function TaskItem(props) {
    const [taskDescription, setTaskDescription] = useState("");
    useEffect(() => {
        setTaskDescription(props.description)
    }, [])
    useEffect(() => {
        props.UpdateTask(props.id, taskDescription)
    }, [taskDescription])
    const HandleTextInput = (NewValue) => {
        console.log("Text input received, updating value")
        setTaskDescription(NewValue)
    }
    return (
        // <div className={props.pinned && !props.complete ? "TaskItem Pinned" : "TaskItem"}>
        <div className={`TaskItem ${props.pinned && !props.complete ? 'Pinned' : ''} ${props.priority == 1 && !props.complete ? 'MediumPriority' : ''} ${props.priority == 2 && !props.complete ? 'HighPriority' : ''}`}>
            <span className="TaskItemDateCreated">{new Date(props.dateCreated).toDateString()}</span>
            <button tabIndex="-1" type="checkbox" onClick={() => { props.MarkTaskAsComplete(props.id) }} className="TaskItemCheckbox">{(!props.complete) ? "Done" : "Undo"}</button>
            {!props.complete && <button tabIndex="-1" type="button" onClick={() => { props.MarkTaskAsPinned(props.id) }} className="TaskItemPin">{(!props.pinned) ? "Pin" : "Pinned"}</button>}
            <button tabIndex="-1" type="button" onClick={() => { props.DeleteTask(props.id) }} className="TaskItemDelete">Delete</button>
            {props.complete === false && <select tabIndex="-1" className="TaskItemPriority" onChange={(e) => { props.SetTaskPriority(props.id, e.target.value) }} value={props.priority}>
                <option value="0">Low Priority</option>
                <option value="1">Medium Priority</option>
                <option value="2">High Priority</option>
            </select>}
            <input autoFocus className="TaskItemInput" disabled={props.complete} onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    e.target.blur();
                    props.CreateNewTask();
                }
                if (e.key === "Backspace" && e.target.value === "") {
                    e.preventDefault();
                    props.DeleteTask(props.id);
                }
            }} value={taskDescription} onChange={event => HandleTextInput(event.target.value)}></input>
        </div>
    )
}

export default TaskItem;