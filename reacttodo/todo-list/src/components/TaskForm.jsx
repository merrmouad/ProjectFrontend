import React, { useState } from 'react';

const TaskForm = ({ addTask }) => {
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !userId) return;
    addTask(title, parseInt(userId));
    setTitle('');
    setUserId('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input className='enter'
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add new task"
      />
      <input
      className='enter'
        type="number"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="User ID"
      />
      <button className="button" type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
