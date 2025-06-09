// This component provides authentication context to the app,
// managing the user's token and username state and syncing it with localStorage/sessionStorage.

import React from "react";
// Importing React to create context, use state, effect hooks, and ReactNode type
import { createContext, useState, useEffect, type ReactNode } from "react";

// Props type for the provider component - it expects children components to render inside
type Props = {
  children: ReactNode;
};

// Type definition for the shape of the authentication context
type AuthContext = {
  token: string | null; // the auth token, can be null if not logged in
  setToken: React.Dispatch<React.SetStateAction<string | null>>; // function to update token state
  userName: string | null; // the user's name, can be null if not set
  setUserName: React.Dispatch<React.SetStateAction<string | null>>; // function to update username state
};

// Create the actual context with default empty values and no-op functions
export const AuthContext = createContext<AuthContext>({
  token: null,
  setToken: () => {}, // placeholder function (does nothing)
  userName: "", // default username is empty string
  setUserName: () => {}, // placeholder function (does nothing)
});

// The provider component that will wrap parts of the app that need auth state
const AuthContextProvider = ({ children }: Props) => {

  // Helper functions to get initial token and username from localStorage or sessionStorage
  // If token or username exist in localStorage, use that; else fallback to sessionStorage
  const getInitialToken = () =>
    localStorage.getItem("tkn") || sessionStorage.getItem("tkn");
  const getInitialUserName = () =>
    localStorage.getItem("name") || sessionStorage.getItem("name");

  // Initialize React state with the token and username retrieved from storage
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [userName, setUserName] = useState<string | null>(getInitialUserName);

  // Side effect to clean up storage when token or username become null (logged out)
  useEffect(() => {
    if (!token) {
      localStorage.removeItem("tkn");
      sessionStorage.removeItem("tkn");
    }
    if (!userName) {
      localStorage.removeItem("name");
      sessionStorage.removeItem("name");
    }
  }, [token, userName]);

  // Provide the token, username, and their setter functions to children via context
  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        userName,
        setUserName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
