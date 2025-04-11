import React, { useState, useEffect } from 'react';

function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  // Cargar tareas desde localStorage al iniciar
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Guardar tareas en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    
    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeTasksCount = tasks.filter(task => !task.completed).length;

  return (
    <div className="todo-app">
      <h1>Lista de Tareas</h1>
      
      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Añadir nueva tarea..."
          className="task-input"
        />
        <button type="submit" className="add-button">Añadir</button>
      </form>
      
      <div className="filters">
        <button 
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          Todas
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'active' : ''}
        >
          Pendientes
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'active' : ''}
        >
          Completadas
        </button>
      </div>
      
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="empty-message">
            {filter === 'all' 
              ? 'No hay tareas. ¡Añade una!' 
              : filter === 'active' 
                ? '¡No hay tareas pendientes!' 
                : 'No hay tareas completadas'}
          </p>
        ) : (
          <ul>
            {filteredTasks.map(task => (
              <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="task-checkbox"
                />
                <span className="task-text">{task.text}</span>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="delete-button"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {tasks.length > 0 && (
        <div className="task-stats">
          <p>{activeTasksCount} {activeTasksCount === 1 ? 'tarea pendiente' : 'tareas pendientes'}</p>
        </div>
      )}
    </div>
  );
}

export default Home;