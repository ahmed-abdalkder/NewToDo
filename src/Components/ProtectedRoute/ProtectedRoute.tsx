// This component acts as a guard for routes that require user authentication.
// It checks if the user has a valid token (i.e., is logged in).
// If the user is authenticated, it renders the child components passed to it.
// Otherwise, it renders a NotFound component to block access to protected content.

import React from "react";

// Importing useContext to access the authentication context,
// and NotFound component to display when the user is not authorized.
import { useContext } from 'react';
import NotFound from '../NotFound/NotFound';

// Importing the AuthContext to read authentication state (token).
import { AuthContext } from '../../Context/Auth/AuthContext';

// Defining the type for the component's props, which includes
// 'children' representing the nested components that should be protected.
type Props = {
    children: React.ReactNode  
}

// The ProtectedRoute functional component that uses destructuring
// to get the 'children' prop (the components to render if authorized).
const ProtectedRoute = ({children}: Props) => {
  // Extract the 'token' from AuthContext to check if the user is logged in.
  const { token } = useContext(AuthContext);
  
  return (
    <>
      {/* If token exists (user is authenticated), render the children components.
          Otherwise, show the NotFound component to block unauthorized access. */}
      {token ? children : <NotFound />}
    </>
  )
}

// Export the component so it can wrap protected routes elsewhere in the app.
export default ProtectedRoute;
