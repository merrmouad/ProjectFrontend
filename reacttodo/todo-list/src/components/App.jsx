import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Task from './Task';
import TaskForm from './TaskForm';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:4000/api/tasks')
      .then(response => setTasks(response.data))
      .catch(error => setError('Failed to fetch tasks'))
      .finally(() => setLoading(false));
  }, []);

  const addTask = (title, userId) => {
    axios.post('http://localhost:4000/api/tasks', { title, userId })
      .then(response => setTasks(prevTasks => [...prevTasks, response.data]))
      .catch(error => setError('Failed to add task'));
  };
  const editTask = (id, title, userId) => {
    console.log(`Editing task ${id} with title: ${title} and userId: ${userId}`);
    return axios.patch(`http://localhost:4000/api/tasks/${id}`, { title, userId })
      .then(response => {
        console.log('Edit response:', response.data);
        setTasks(prevTasks => prevTasks.map(task =>
          task.id === id ? response.data : task
        ));
      })
      .catch(error => {
        console.error('Failed to edit task:', error);
        setError('Failed to edit task');
      });
  };
  
  const deleteTask = (id) => {
    axios.delete(`http://localhost:4000/api/tasks/${id}`)
      .then(() => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      })
      .catch(error => setError('Failed to delete task'));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="App">
      <h1>To Do List</h1>
      <TaskForm addTask={addTask} />
      <ul>
        {tasks.map(task => (
          <Task
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
