// src/features/userData.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}
interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

const userData = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Action to add a task
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    // Action to toggle the completed state of a task
    toggleTask: (state, action: PayloadAction<number>) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    // Action to remove a task
    removeTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
  },
});

export const { addTask, toggleTask, removeTask } = userData.actions;

export default userData.reducer; 
