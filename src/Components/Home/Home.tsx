/**
 * Home Component
 * 
 * This component serves as the main dashboard for the Todo application.
 * It handles the following key responsibilities:
 *  - Fetching and displaying all todos from the backend API.
 *  - Providing a search functionality to find a specific todo by its title.
 *  - Allowing users to add new todos through a modal form.
 *  - Enabling deletion of todos with immediate UI update.
 *  - Managing loading and error states with appropriate feedback components.
 * 
 * It integrates React Query for efficient data fetching and caching,
 * Axios for HTTP requests, and uses AuthContext to access the user token.
 * The component also supports internationalization via react-i18next.
 */

 


 import React, { useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import HomeModal from "../HomeModal/HomeModal";
import { AuthContext } from "../../Context/Auth/AuthContext";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import NotFound from "../NotFound/NotFound";
import { useTranslation } from 'react-i18next';
import VantaBackground from '../VantaBackground/VantaBackground';
import HomeTodoCard from '../HomeTodoCard/HomeTodoCard';

// Define the structure of a Todo item
interface Todo {
  _id: string;
  title: string;
  image?: {
    secure_url?: string;
  };
}

const Home = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState("");

  // Debounce function to limit API calls
  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  //Fetch all todos from API
  const { data: todosResponse, isLoading: todosDataLoading, isError: todosError } = useQuery({
  queryKey: ["allTodos"],
  queryFn: async () => {
    const res = await axios.get("http://localhost:3000/api/todos/gettodos", {
      headers: { token },
    });
    return res.data;
  },
   
});
 
  // Mutation to add a new todo
  const addTodoMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axios.post("http://localhost:3000/api/todos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTodos'] });
    },
  });

  const handleAddTodo = async (formData: FormData) => {
    await addTodoMutation.mutateAsync(formData);
  };

  // Search for a todo by title
  const { data: searchResponse, isError: searchTodoError, isLoading: isSearching } = useQuery({
    queryKey: ["findTodo", searchTerm],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/api/todos/gettodo/${searchTerm}`, {
        headers: { token },
      });
      return res.data;
    },
    enabled: !!searchTerm,
  });

  // Mutation to remove a todo by ID
  const removeTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axios.delete(`http://localhost:3000/api/todos/${id}/task`, {
        headers: { token },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTodos'] });
    },
  });

  const removeTodo = async (id: string) => {
    await removeTodoMutation.mutateAsync(id);
  };

  // Loader while fetching todos
  if (todosDataLoading) {
    return (
      <div className='container row h-screen justify-center items-center text-3xl'>
        <ClimbingBoxLoader color="#0aad0a" />
      </div>
    );
  }

  // Display error component if fetching or searching fails
  if (todosError || searchTodoError) {
    return <NotFound />;
  }

  return (
    <div>
      {/* Search input and Add Todo modal button */}
      <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
        {/* Search box with icon */}
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
            <svg
              className="h-4 w-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value.trim());
            }, 500)}
            type="search"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:outline-0"
            placeholder={t('searchTodos')}
          />
        </div>

        {/* Button to open modal for adding new todo */}
        <div className="w-full sm:w-auto">
          <HomeModal handleAddTodo={handleAddTodo} />
        </div>
      </div>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {isSearching ? (
          <div className="col-span-full text-center py-8">
            <ClimbingBoxLoader color="#0aad0a" size={20} />
          </div>
        ) : searchTerm ? (
          searchResponse ? (
            <HomeTodoCard
              key={searchResponse._id}
              title={searchResponse.title}
              imageSrc={searchResponse.image?.secure_url || ''}
              colorIndex={0}
              id={searchResponse._id}
              removeTodo={removeTodo}
            />
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              {t('noResultsFound')}
            </div>
          )
        ) : todosResponse?.length ? (
          todosResponse.map((todo: Todo, index: number) => (
            <HomeTodoCard
              key={todo._id}
              title={todo.title}
              imageSrc={todo.image?.secure_url || ''}
              colorIndex={index}
              id={todo._id}
              removeTodo={removeTodo}
            />
          ))
        ) : (
          <div className="h-[300px] w-full flex justify-center items-center col-span-full">
            <VantaBackground effect="net" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
