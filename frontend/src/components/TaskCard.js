import React from 'react';
import { useTask } from '../contexts/TaskContext';

const TaskCard = ({ task, onEditTask }) => {
  const { updateTask, deleteTask, users } = useTask();

  const handleStatusChange = async (newStatus) => {
    await updateTask(task.id, { status: newStatus });
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      await deleteTask(task.id);
    }
  };

  const assignedUser = users.find(user => user.id === task.assignedTo);
  const priorityClass = `priority-${task.priority}`;

  return (
    <div className={`task-card ${priorityClass}`}>
      <div className="task-header">
        <h4 className="task-title">{task.title}</h4>
        <div className="task-actions">
          <button onClick={() => onEditTask(task)} className="btn-icon" title="Modifier">
            ✏️
          </button>
          <button onClick={handleDelete} className="btn-icon" title="Supprimer">
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <div className="task-priority">
          <span className={`priority-badge priority-${task.priority}`}>
            {task.priority === 'high' ? 'Haute' : 
             task.priority === 'medium' ? 'Moyenne' : 'Basse'}
          </span>
        </div>

        {assignedUser && (
          <div className="task-assignee">
            <span>👤 {assignedUser.name}</span>
          </div>
        )}
      </div>

      <div className="task-status-controls">
        <select 
          value={task.status} 
          onChange={(e) => handleStatusChange(e.target.value)}
          className="status-select"
        >
          <option value="todo">À faire</option>
          <option value="progress">En cours</option>
          <option value="done">Terminé</option>
        </select>
      </div>

      <div className="task-dates">
        <small>
          Créé: {new Date(task.createdAt).toLocaleDateString()}
        </small>
      </div>
    </div>
  );
};

export default TaskCard;