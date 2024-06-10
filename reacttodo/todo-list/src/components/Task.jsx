import React, { useState } from 'react';

const Task = ({ task, deleteTask, editTask }) => {
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedUserId, setEditedUserId] = useState(task.userId);

  const handleEdit = () => {
    editTask(task.id, editedTitle, parseInt(editedUserId))
      .then(() => setEditing(false)); // Ensure editing state is updated after promise resolves
  };

  return (
    <li>
      {editing ? (
        <div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <input
            type="number"
            value={editedUserId}
            onChange={(e) => setEditedUserId(e.target.value)}
          />
          <button className="buttonsave" onClick={handleEdit}>Save</button>
        </div>
      ) : (
        <div>
          <span>{task.title}</span>
          <span className='user'>User ID: {task.userId}</span>
          <button className="buttondelete" onClick={() => deleteTask(task.id)}>Delete</button>
          <button className="button" onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}
    </li>
  );
};

export default Task;
