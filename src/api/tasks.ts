// This utility function is used to fetch all tasks related to a specific To-Do item (by ID)

// Import the pre-configured Axios instance that includes baseURL and language headers
import axios from './axios'; 

// Define an asynchronous function that fetches tasks by their parent To-Do ID
export const getTasksByTodoId = async (todoId: string) => {
  // Send a GET request to the backend endpoint for fetching tasks under the given To-Do
  const response = await axios.get(`/api/todos/${todoId}/tasks`);
  
  // Return only the response data (the list of tasks) from the API
  return response.data;
};

