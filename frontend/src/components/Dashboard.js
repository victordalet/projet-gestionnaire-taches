import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { user, logout } = useAuth();
  const { tasks, loading } = useTask();

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Gestionnaire de Tâches</h1>
        <div className="user-info">
          <span>Bienvenue, {user?.name || user?.email}</span>
          <button onClick={logout} className="logout-btn">
            Déconnexion
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-actions">
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Nouvelle Tâche
          </button>
        </div>

        {showForm && (
          <TaskForm 
            task={editingTask}
            onClose={handleCloseForm}
          />
        )}

        {loading ? (
          <div className="loading">Chargement des tâches...</div>
        ) : (
          <TaskList 
            tasks={tasks}
            onEditTask={handleEditTask}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;