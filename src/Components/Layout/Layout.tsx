// This component defines the general layout structure used across the website or application.
// It wraps the page with a consistent Navbar at the top and Footer at the bottom.
// The main content between them is dynamically rendered using <Outlet />, depending on the current route.

// Importing React to use JSX and component features
import React from "react";

// Importing Outlet from React Router DOM, which is used as a placeholder for nested route components
import { Outlet } from "react-router-dom";

// Importing the shared Navbar component that will appear on all pages
import Navbar from "../Navbar/Navbar";

// Importing the shared Footer component that will appear on all pages
import Footer from "../Footer/Footer";

// Declaring the Layout component
const Layout = () => {
  return (
    // The outermost wrapper with a light gray background using TailwindCSS class
    <div className={`bg-gray-50`}>
    
      {/* Rendering the Navbar at the top of the layout */}
      <Navbar />

      {/* Main section of the page with padding and min height to fill the screen */}
      <main className="container min-h-screen">
        {/* Outlet is a placeholder for the content of the current route */}
        <Outlet />
      </main>

      {/* Rendering the Footer at the bottom of the layout */}
      <Footer />
    </div>
  );
};

// Exporting the Layout component so it can be used in route definitions
export default Layout;
