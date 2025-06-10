 // This is the Signin component responsible for rendering the login form,
// handling user input validation, submitting login requests to the server,
// managing authentication state, and navigating the user after successful login.

import React from "react"; 
// Import React (optional in newer React versions but still common)

import axios from "axios"; 
// Import axios for making HTTP requests to the backend API

import { useFormik } from "formik"; 
// Import useFormik hook to handle form state and validation easily

import { useContext, useState } from "react"; 
// Import React hooks: useContext for accessing global state, useState for local state

import { Link, useNavigate } from "react-router-dom"; 
// Import Link for navigation links and useNavigate for programmatic navigation

import * as Yup from "yup"; 
// Import Yup library for schema-based form validation

import { AuthContext } from "../../Context/Auth/AuthContext"; 
// Import AuthContext to access and update authentication-related data globally

import toast from "react-hot-toast"; 
// Import toast for showing user notifications (success, error messages)

import { useTranslation } from "react-i18next"; 
import { subscribeUserToPush } from "../PushSubscriptionManager/PushSubscriptionManager";
 
// Import useTranslation hook for internationalization (i18n), to support multiple languages


const Signin = () => {
  // Initialize translation function to get localized text strings
  const { t } = useTranslation();

  // Local state to manage whether the user wants to be remembered (persist login)
  const [rememberMe, setRememberMe] = useState(false);

  // Destructure setUserName and setToken from AuthContext to update global auth state
  const { setUserName, setToken } = useContext(AuthContext);

  // useNavigate hook to redirect user programmatically after successful login
  const navigate = useNavigate();

  // Define TypeScript type for the form values
  type values = {
    email: string;
    password: string;
  };

  // Async function to handle signin request to backend
  async function signin(values: values) {
    try {
      // Send POST request with email and password to login endpoint
      const { data } = await axios.post(
        "https://server-to-do-lake.vercel.app/api/users/login",
        values
      );

      // Store token and username either in localStorage or sessionStorage
      // depending on whether "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("tkn", data.token);
        localStorage.setItem("name", data.user.name);
      } 

      // Update global auth state with new token and user name
      setToken(data.token);
      setUserName(data.user.name);

      // Show success notification with translated message
      toast.success(t("login_success"));
    
      // Redirect to the /home page after 1 second delay
      setTimeout(() => {
        navigate("/home");
      }, 1000);
   const permission = await Notification.requestPermission();
   if (permission === 'granted') {
    await subscribeUserToPush();
}

    } catch (err: unknown) {
      // Handle errors from server or network
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const error = err as { response?: { data?: { msg?: string } } };
        // Show error message from server or default "Error"
        toast.error(error.response?.data?.msg || "Error");
      } else {
        toast.error("Error");
      }
    }
  }

  // Initialize Formik to manage form state, validation, and submission
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      // Validate email format and required field with translations
      email: Yup.string()
        .email(t("email_invalid"))
        .required(t("email_required")),
      // Validate password minimum length and required field with translations
      password: Yup.string()
         .min(6, t('passwordMin'))  
    .matches(/[a-z]/, t('passwordLowercase'))  
    .matches(/[A-Z]/, t('passwordUppercase')) 
    .matches(/[0-9]/, t('passwordNumber'))  
    .matches(/[@$!%*?&]/, t('passwordSpecialChar')), 
    }),
    // On form submit, call signin function with form values
    onSubmit: (values) => signin(values),
  });

  // Render the sign-in form UI
  return (
    <div className="container relative mt-4">
      <div className="w-full md:w-2/3 mx-auto">
        <h2 className="text-2xl">{t("signin")}</h2>
        <form
          onSubmit={formik.handleSubmit} // Connect form submission to Formik handler
          className="w-full mx-auto mt-2 shadow bg-white p-6 rounded-2xl"
        >
          {/* Email Input Field */}
          <div className="relative z-0 w-full mb-3 group">
            <input
              onBlur={formik.handleBlur} // Mark field as touched on blur
              onChange={formik.handleChange} // Update formik values on change
              value={formik.values.email} // Controlled input value
              type="email"
              name="email"
              id="floating_email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none  focus:border-sky-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="floating_email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-sky-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              {t("email")}
            </label>
          </div>
          {/* Show validation error for email if field touched and error exists */}
          {formik.touched.email && formik.errors.email && (
            <div className="mb-5 text-sm text-red-800" role="alert">
              {formik.errors.email}
            </div>
          )}

          {/* Password Input Field */}
          <div className="relative z-0 w-full mb-3 group">
            <input
              onBlur={formik.handleBlur} // Mark as touched on blur
              onChange={formik.handleChange} // Update Formik state on change
              value={formik.values.password} // Controlled input value
              type="password"
              name="password"
              id="floating_password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none  focus:border-sky-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="floating_password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-sky-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              {t("password")}
            </label>
          </div>
          {/* Show validation error for password */}
          {formik.touched.password && formik.errors.password && (
            <div className="mb-5 text-sm text-red-800" role="alert">
              {formik.errors.password}
            </div>
          )}

          {/* Remember Me Checkbox */}
          <div className="flex items-start mb-5">
            <input
              checked={rememberMe} // Controlled checkbox state
              onChange={() => setRememberMe(!rememberMe)} // Toggle rememberMe state on click
              id="remember"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50"
            />
            <label
              htmlFor="remember"
              className="ms-2 text-sm font-medium text-gray-900"
            >
              {t("remember_me")}
            </label>
          </div>

          {/* Submit button and Register link */}
          <div className="flex-col md:flex-row flex items-start justify-between gap-y-3">
            <button
              type="submit"
              className="!underline text-white bg-sky-400 hover:bg-sky-500 px-8 cursor-pointer font-medium rounded-lg w-full md:w-auto block py-2.5 text-center md:me-auto"
            >
              {t("signin")}
            </button>
            <Link
              to="/"
              className="!text-sky-400  cursor-pointer font-medium rounded-lg text-sm w-full md:w-auto block px-8 py-2.5 text-center md:ms-auto"
            >
              {t("register")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
