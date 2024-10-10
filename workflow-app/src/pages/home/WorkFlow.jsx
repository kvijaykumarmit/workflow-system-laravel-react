import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../context-providers/AuthContext';
import axios from 'axios';
import API_URL from '../../config'; 

function WorkFlow({handleClose, toastAlert, fetchData, workflowToEdit }){
   
    const [workflowTitle, setWorkflowTitle] = useState(workflowToEdit ? workflowToEdit.name : '');
    const [workflowStatus, setWorkflowStatus] = useState(workflowToEdit ? workflowToEdit.status : 'new');
    const [tasks, setTasks] = useState(workflowToEdit ? workflowToEdit.tasks : []); 
    const [draggedIndex, setDraggedIndex] = useState(null);
    const { user } = useAuth();    

    useEffect(() => {       
        if (workflowToEdit) {
            setWorkflowTitle(workflowToEdit.name);
            setWorkflowStatus(workflowToEdit.status);
            setTasks(workflowToEdit.tasks);
        }
    }, [workflowToEdit]);

    
    const saveWorkFlow = async() =>{
        try {
            let workflowTasks = [];
            for(let ti=0; ti<tasks.length; ti++){
                workflowTasks.push({
                    "id": tasks[ti]['id']?tasks[ti]['id']:null,
                    "task": tasks[ti]['task'],
                    "status": tasks[ti]['status'],
                    "order_no": ti
                });
            }
            let workflowData = {
                "name": workflowTitle,
                "status": workflowStatus,
                "tasks": workflowTasks
            };
            const token = user ? user.token : ''; 
            let response;
            if(workflowToEdit){
                response = await axios.put(`${API_URL.BASE_URL}/workflows/update/${workflowToEdit.id}`,workflowData,{
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json', 
                    },
                });
            }else{
                response = await axios.post(`${API_URL.BASE_URL}/workflows/create`,workflowData,{
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json', 
                    },
                });
            }            
            if(response.data.success==true){
                if(workflowToEdit){
                    toastAlert("Workflow updated!");
                }else{
                    toastAlert("Workflow created!");
                }
                fetchData();
                handleClose();                
            }

        } catch (error) {
            console.error('Error fetching workflow data:', error);
        }        
    }

    const addTask = () => {
        const newTask = {            
            task: ``,
            status: "new" 
        }; 
        setTasks([...tasks, newTask]); 
    };

    const handleDragStart = (e, index) => {     
        setDraggedIndex(index); 
    };

    const handleDrop = (event) => {
        event.preventDefault();     
        const target = event.target; 
        const dropIndex = Array.from(target.parentNode.children).indexOf(target);           
        if (draggedIndex === null || dropIndex === -1) return;     
        const updatedTasks = [...tasks]; 
        const [movedTask] = updatedTasks.splice(draggedIndex, 1);
        updatedTasks.splice(dropIndex, 0, movedTask); 
        setTasks(updatedTasks);
        setDraggedIndex(null);
    };

    const handleTaskChange = (index, newValue) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].task = newValue;
        setTasks(updatedTasks);
    };

    const handleStatusChange = (index, newValue) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].status = newValue;
        setTasks(updatedTasks);
    }
   
      
    return ( <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
            <input
                type="text"
                value={workflowTitle}
                onChange={(e) => setWorkflowTitle(e.target.value)} // Update the workflow title
                className="form-control me-3"
                placeholder="Enter workflow title"
            />            
            {workflowStatus === 'new' && (
                <span className="badge bg-primary">New</span>
            )}
            {workflowStatus === 'active' && (
                <span className="badge bg-warning text-dark">In Progress</span>
            )}
            {workflowStatus === 'completed' && (
                <span className="badge bg-success">Completed</span>
            )}
        </div>
        <div className="d-flex justify-content-end mb-4"> 
          <Button variant="primary" onClick={addTask}>Add Task</Button>
        </div>
        <ul onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} style={{ padding: 0, listStyleType: 'none' }}>
        {tasks.map((task, index) => (
            <li
            key={task.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            style={{ 
                cursor: 'move', 
                padding: '8px', 
                margin: '10px 0', 
                border: '1px solid #ccc', 
                display: 'flex', 
                alignItems: 'center' 
            }}
            >
            <div className="d-flex w-100 justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                <span style={{ marginRight: '10px' }}>{index + 1}. </span>
                <input
                    type="text"
                    value={task.task}
                    placeholder="Enter task" 
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    style={{ flex: 1, border: 'none', outline: 'none' }}
                />
                </div>

                <select
                value={task.status}
                onChange={(e) => handleStatusChange(index, e.target.value)} // Update function to handle status change
                className="form-select" // Bootstrap class for styling
                style={{ marginLeft: '10px', width: 'auto' }} // Optional: adjust width as needed
                >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                </select>
            </div>              
            </li>
        ))}
        </ul>
        <div className="d-flex justify-content-end mt-4"> 
          <Button variant="primary" onClick={saveWorkFlow}>Save</Button>
        </div>        
      </div>);
}

export default WorkFlow;