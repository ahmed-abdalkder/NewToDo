// This component provides a context for managing todos and tasks in the app.
// It allows fetching, adding, updating, and deleting tasks, and tracks task completion percentages.

import React from "react";
// Import React and necessary hooks/types to build context and manage state
import { createContext, useContext, useState, type ReactNode } from 'react';
// Import axios instance configured for API requests
import axios from '../../api/axios';  
// Import AuthContext to get the user token for authenticated requests
import { AuthContext } from '../Auth/AuthContext';

// Type representing a single task within a todo
export type Task = {
  _id: string;
  text: string;
  completed: boolean;
  date?: Date;
};

// Type representing a todo, which contains multiple tasks and metadata
export type Todo = {
  user: string;
  title: string;
  image: string;
  tasks: Task[];
  _id: string;
};

// Internal type representing the task shape from API response
interface TasK {
  completed: boolean;
  text: string;
  date: string | null;
}

// Type for the shape of the TodoContext that will be provided to consumers
export type TodoContextType = {
  addTask: (id: string, text: string, date?: Date) => Promise<void>; // function to add a task
  updateTask: (id: string, taskId: string, text: string, completed: boolean) => Promise<void>; // update a task
  deleteTask: (id: string, taskId: string) => Promise<void>; // delete a task
  getTasks: (id: string) => Promise<void>; // fetch tasks for a todo by ID
  completedTasksPercentages: CompletedPercentages; // object holding completion percentages keyed by todoId
  setCompletedTasksPercentages: React.Dispatch<React.SetStateAction<CompletedPercentages>>; // setter for percentages
  allTasks: Task[]; // list of all current tasks loaded
};

// Type defining a dictionary with todo IDs as keys and completion percentages as values
type CompletedPercentages = {
  [todoId: string]: number;
};

// Create the context with default no-op implementations and empty data
export const TodoContext = createContext<TodoContextType>({
  addTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  getTasks: async () => {},
  completedTasksPercentages: {},
  setCompletedTasksPercentages: () => {},
  allTasks: [],
});

// Props for the provider component (children nodes)
type Props = {
  children: ReactNode;
};

// The provider component that manages todos and tasks, providing the context values
const TodoContextProvider = ({ children }: Props) => {
  // Extract token from AuthContext for authorization headers
  const { token } = useContext(AuthContext);

  // State for completion percentages for each todo
  const [completedTasksPercentages, setCompletedTasksPercentages] = useState<CompletedPercentages>({});

  // State for the currently loaded tasks
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  // Fetch tasks for a given todo ID, update state and calculate completion percentage
  async function getTasks(id: string) {
    try {
      // Make GET request to API to fetch tasks for a specific todo ID with auth token
      const { data } = await axios.get(`https://server-to-do-lake.vercel.app/api/todos/${id}/tasks`, {
        headers: { token },  
      });
      const tasks = data;

      // Update the allTasks state with fetched tasks
      setAllTasks(tasks);

      // Calculate the percentage of completed tasks
      const tasksQty = tasks.length || 1; // avoid division by zero
      const completedTasks = tasks.filter((task:TasK) => task.completed).length;
      const percentage = Math.round((completedTasks / tasksQty) * 100);

      // Update the completion percentages state, preserving previous values
      setCompletedTasksPercentages((prev) => ({ ...prev, [id]: percentage }));
    } catch (err) {
      console.error(err);
    }
  }

  // Add a new task to a todo by ID, then refresh the task list
  async function addTask(id: string, text: string, date?: Date) {
    try {
      await axios.post(
        `https://server-to-do-lake.vercel.app/api/todos/${id}/task`,
        { text, date: date ? date.toISOString() : null },
        { headers: { token } }
      );
      await getTasks(id); // refresh tasks after adding
    } catch (err) {
      console.error(err);
    }
  }

  // Update an existing task's text and completion status, then refresh tasks
  async function updateTask(id: string, taskId: string, text: string, completed: boolean) {
    try {
      await axios.put(
        `https://server-to-do-lake.vercel.app/api/todos/${id}/task/${taskId}`,
        { text, completed },
        { headers: { token } }
      );
      await getTasks(id); // refresh tasks after updating
    } catch (err) {
      console.error(err);
    }
  }

  // Delete a task by its ID from a todo, then refresh the task list
  async function deleteTask(id: string, taskId: string) {
    try {
      await axios.delete(`https://server-to-do-lake.vercel.app/api/todos/${id}/task/${taskId}`, {
        headers: { token },
      });
      await getTasks(id); // refresh tasks after deletion
    } catch (err) {
      console.error(err);
    }
  }

  // Provide all state and functions through context to children
  return (
    <TodoContext.Provider
      value={{
        addTask,
        updateTask,
        deleteTask,
        getTasks,
        completedTasksPercentages,
        setCompletedTasksPercentages,
        allTasks,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export default TodoContextProvider;

