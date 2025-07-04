// App Component: The main entry point of the application.
// It sets up the routing, context providers, service worker registration, and language direction.

import React from 'react'; // React core library
import './App.css'; // Main CSS for global styles

// React Router for managing app navigation
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

// Layout and Pages
import Layout from './Components/Layout/Layout';
import Signin from './Components/Signin/Signin';
import Home from './Components/Home/Home';
import TodoDetails from './Components/TodoDetails/TodoDetails';
import Signup from './Components/Signup/Signup';
import NotFound from './Components/NotFound/NotFound';

// Context Providers
import AuthContextProvider from './Context/Auth/AuthContext';
import TodoContextProvider from './Context/Todo/TodoContext';

// Route Guard
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';

// React Query for data fetching and caching
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Toast notifications
import { Toaster } from 'react-hot-toast';

// Hook to handle side effects
import { useEffect } from 'react';

 

// Internationalization
import { useTranslation } from 'react-i18next';


function App() {
  const { i18n } = useTranslation();

  // Set up application routes
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { path: "signin", element: <Signin /> },
        { path: "", element: <Signup /> },
        { path: "home", element: <ProtectedRoute><Home /></ProtectedRoute> },
        { path: "tododetails/:id", element: <ProtectedRoute><TodoDetails /></ProtectedRoute> },
        { path: "*", element: <NotFound /> },
      ]
    }
  ]);

  // React Query Client instance for caching and managing server state
  const queryClient = new QueryClient();

  // Handle direction (RTL/LTR) and language attribute based on selected language
  useEffect(() => {
    const html = document.documentElement;
    if (i18n.language === 'ar') {
      html.dir = 'rtl';
      html.lang = 'ar';
    } else {
      html.dir = 'ltr';
      html.lang = 'en';
    }
  }, [i18n.language]);

  return (
    <>
      {/* Provide Authentication context globally */}
      <AuthContextProvider>
        {/* Provide React Query client globally */}
        <QueryClientProvider client={queryClient}>
          {/* Provide Todo context globally */}
          <TodoContextProvider>
            {/* Set up routing */}
            <RouterProvider router={router} />

            {/* Display toast notifications */}
            <div><Toaster /></div>
          </TodoContextProvider>
        </QueryClientProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;

