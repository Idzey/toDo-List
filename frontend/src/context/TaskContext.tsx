import React, { createContext, useContext } from 'react';
import Tasks from '../types/tasks';

const TaskContext = createContext<{
  tasks: Tasks;
  setTasks: React.Dispatch<React.SetStateAction<Tasks>>;
  tasksNode: Tasks;
  setTasksNode: React.Dispatch<React.SetStateAction<Tasks>>;
}>({ 
  tasks: [], 
  setTasks: () => {},
  tasksNode: [],
  setTasksNode: () => {},
});

export {TaskContext};

const useTaskContext = () => useContext(TaskContext)

export default useTaskContext;