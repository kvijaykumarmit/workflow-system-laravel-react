import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import API_URL from '../../config'; 
import { useAuth } from '../../context-providers/AuthContext';
import WindowComponent from '../../components/window/WindowComponent';
import WorkFlow from './WorkFlow';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Home(){
    
    const { user } = useAuth();    
    const [showWindow, setShowWindow] = useState(false);      
    const [workflows, setWorkflows] = useState([]);  
    const [workflowToEdit, setWorkflowToEdit] = useState(null);  

    const handleShow = () => setShowWindow(true);
    const handleClose = () => {
      setShowWindow(false);
      setWorkflowToEdit(null);
    };   
    
    const handleEdit = async(workflowId)=>{
      try {
          const token = user ? user.token : ''; 
          const response = await axios.get(`${API_URL.BASE_URL}/workflows/getData/${workflowId}`, {
              headers: {
                  'Authorization': `Bearer ${token}`, 
              },
          });    
          if(response.status === 200){
            setWorkflowToEdit(response.data.workflow);
            setShowWindow(true);
          }      
      } catch (error) {
          console.error('Error fetching workflow data:', error);
      }
    }

    const handleDelete = async(workflowId)=>{
      try {
        const token = user ? user.token : ''; 
        const response = await axios.delete(`${API_URL.BASE_URL}/workflows/delete/${workflowId}`, {
            headers: {
                'Authorization': `Bearer ${token}`, 
            },
        });
        if(response.status === 200){
          toast("Workflow removed");
          fetchData();
        }
      } catch (error) {
          console.error('Error fetching workflow data:', error);
      }
    }
    
    const navigate = useNavigate();    
    
    const fetchData = async () => {
      try {
          const token = user ? user.token : ''; 
          const response = await axios.get(`${API_URL.BASE_URL}/workflows`, {
              headers: {
                  'Authorization': `Bearer ${token}`, 
              },
          });
          setWorkflows(response.data.data);
      } catch (error) {
          console.error('Error fetching workflow data:', error);
      }
  };

    useEffect(() => {         
        const executeFunctions = async () => {
            if (user) {
                await fetchData(); // Assuming fetchData is an async function
                // You can call any other function here if needed
            } else {
                navigate('/');
            }
        };  
        executeFunctions();
    },[user, navigate]);
   

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-4">Workflows</h3>
        <Button variant="primary"  className="h-50" onClick={handleShow}> Add Workflow </Button>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Workflow</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {workflows.length > 0 ? (
            workflows.map((workflow, index) => (
              <tr key={workflow.id}>
                <td>{index + 1}</td>
                <td>{workflow.name}</td>
                <td>{workflow.status}</td>
                <td>
                  <button 
                    className="btn btn-warning me-2"
                    onClick={() => handleEdit(workflow.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(workflow.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No workflows available</td>
            </tr>
          )}
        </tbody>
      </Table>
      <WindowComponent show={showWindow} handleClose={handleClose} title="Create Workflow">
          <WorkFlow handleClose={handleClose} toastAlert={toast} fetchData={fetchData} workflowToEdit={workflowToEdit} />
      </WindowComponent>
      <ToastContainer />
    </div>);
}

export default Home;