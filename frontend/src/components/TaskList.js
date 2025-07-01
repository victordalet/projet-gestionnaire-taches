import React from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, onEditTask }) => {
  const tasksByStatus = {
    todo: tasks.filter(task => task.status === 'todo'),
    progress: tasks.filter(task => task.status === 'progress'),
    done: tasks.filter(task => task.status === 'done')
  };

  const statusLabels = {
    todo: 'À faire',
    progress: 'En cours',
    done: 'Terminé'
  };

  return (
    <div className="task-board">
      {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
        <div key={status} className={`task-column ${status}`}>
          <div className="column-header">
            <h3>{statusLabels[status]}</h3>
            <span className="task-count">{statusTasks.length}</span>
          </div>
          
          <div className="task-list">
            {statusTasks.length === 0 ? (
              <div className="empty-state">
                Aucune tâche {statusLabels[status].toLowerCase()}
              </div>
            ) : (
              statusTasks.map(task => (
                <TaskCard
                  key={task.id}
				  task={task}
                  onEditTask={onEditTask}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;