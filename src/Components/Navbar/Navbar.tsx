// This component renders the top navigation bar (Navbar) of the app.
// It includes language switching, navigation links (like Home), user info, and a logout dropdown.
// It only displays user-related elements if the user is authenticated (based on the token).

import React from "react";

// NavLink is used for navigation with active link styling. useNavigate allows programmatic navigation.
import { NavLink, useNavigate } from "react-router-dom";

// A sample user profile image imported for the avatar
import userImage from "../../assets/user.jpeg";

// Importing React hooks and the AuthContext to access and manage auth state
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/Auth/AuthContext";
<<<<<<< HEAD
 
 
=======
import todooz from "../../assets/2.png"
>>>>>>> 53b6de5 (first commit)
// useTranslation is used for internationalization (i18n) support
import { useTranslation } from 'react-i18next';

// Start of the Navbar component
const Navbar = () => {
  // Hook from i18n for translation functionality
  const { t } = useTranslation();

  // React Router hook to navigate programmatically (e.g., after logout)
  const navigate = useNavigate();

  // Getting authentication state and setters from AuthContext
  const { userName, token, setToken, setUserName } = useContext(AuthContext);

  // Local state to manage the visibility of the dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Accessing i18n instance for changing the language
  const { i18n } = useTranslation();

  // Function to change language and persist the selection in localStorage
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  // Function to sign the user out
  const signout = () => {
    // Remove tokens and username from both local and session storage
    localStorage.removeItem("tkn");
    sessionStorage.removeItem("tkn");
    localStorage.removeItem("name");
    sessionStorage.removeItem("name");

    // Clear auth state
    setToken(null);
    setUserName(null);

    // Navigate to the sign-in page
    navigate("/signin");
  };

  // Whenever the route changes or the username changes, close the dropdown
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname, userName]);

  return (
    // Outer navbar container with border and shadow
<<<<<<< HEAD
   <div className="shadow border-b border-b-slate-200 bg-main-color">
            <div className='container py-3 flex items-center justify-between '>
                <div className="text-center text-2xl font-medium">
                    <h1>TO
                        <span className="text-sky-600">DO<i className="text-3xl fa-regular fa-circle-check"></i>Z</span>
                    </h1>
                </div>
         
=======
    <div className="shadow border-b border-b-slate-200 bg-main-color">
      <div className='container py-3 flex items-center justify-between'>
        
        {/* App title/logo */}
        <div className="text-center text-2xl font-medium">
          <img src={todooz} className="w-36 h-20" alt="" />
          {/* <h1>
            TO
            <span className="text-sky-600">
              D<i className="text-3xl fa-regular fa-circle-check"></i>
            </span>
          </h1> */}
        </div>
>>>>>>> 53b6de5 (first commit)

        {/* Right section of navbar */}
        <div className="relative flex items-center gap-x-4">
          
          {/* Language switch buttons */}
          <div className="space-x-2">
            <button
              onClick={() => changeLanguage('en')}
              className="px-1 py-1 border border-blue-600 rounded cursor-pointer hover:bg-green-200"
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('ar')}
              className="px-1 py-1 border border-blue-600 rounded cursor-pointer hover:bg-green-200"
            >
              AR
            </button>
          </div>

          {/* Authenticated user view */}
          {token && (
            <>
              {/* Home page link */}
              <NavLink
                to={"/home"}
                className="px-2.5 text-lg font-medium cursor-pointer hover:bg-sky-200 rounded-2xl transition-colors duration-200"
              >
                {t('home')}
              </NavLink>

              {/* Button to toggle the dropdown with user avatar */}
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="cursor-pointer font-medium rounded-4xl text-sm text-center flex items-center sm:bg-sky-400 sm:px-3 py-1"
              >
                {/* Username (hidden on small screens) */}
                <span className="hidden sm:inline mr-2 text-white">{userName}</span>

                {/* Profile image with dropdown icon */}
                <div className="w-8 h-8 rounded-full relative">
                  <img src={userImage} alt="user" className="rounded-full" />
                  <i className="absolute right-0.5 bottom-0 rounded-full bg-slate-300 text-[10px] p-0.5 fa-solid fa-angle-down"></i>
                </div>
              </button>

              {/* Dropdown menu appears if isDropdownOpen is true */}
              {isDropdownOpen && (
                <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 absolute !right-0 !top-full">
                  <ul className="py-2 text-sm text-gray-700">
                      <li>
                      <span
                        onClick={signout}
                        className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {t('signOut')}
                      </span>
                    </li>
                  
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Exporting the Navbar component so it can be used in Layout or other parts of the app
export default Navbar;

