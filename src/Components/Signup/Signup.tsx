 
// Signup component handles user registration form
// It collects user input, validates it, sends registration request to backend, and navigates user on success

// Import necessary libraries and hooks
import React from "react";
import axios from 'axios'                     // For making HTTP requests
import { useFormik } from 'formik'            // For form state management and validation
import toast from 'react-hot-toast'           // For showing notifications
import { useNavigate, Link } from 'react-router-dom'  // For navigation and links
import * as Yup from "yup"                    // For schema-based validation
import { useTranslation } from 'react-i18next' // For internationalization (i18n)

const Signup = () => {
  // useNavigate hook allows redirecting user programmatically
  const navigate = useNavigate();
  // useTranslation hook is used to get translation function 't'
  const { t } = useTranslation();

  // signup function sends a POST request to register user
  // Accepts name, email, and password as parameters
  async function signup(name: string, email: string, password: string) {
    try {
      // Send POST request to backend API to register new user
      await axios.post('https://server-to-do-lake.vercel.app/api/users/register', {
        name,
        email,
        password
      })
      // Show success toast notification if registration successful
      toast.success(t('success'))
      // After 1 second delay, redirect user to signin page
      setTimeout(() => navigate('/signin'), 1000)
    } catch (err: unknown) {
      // Error handling: Check if error response exists and show its message
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const error = err as { response?: { data?: { msg?: string } } };
        toast.error(error.response?.data?.msg || "Error");
      } else {
        // Show generic error if no specific message is found
        toast.error("Error");
      }
    }
  }

  // useFormik hook initializes form values, validation, and submission logic
  const formik = useFormik({
    initialValues: {
      name: "",          // Initial value of the name input
      email: "",         // Initial value of the email input
      password: "",      // Initial value of the password input
      rePassword: "",    // Initial value of the repeated password input
    },
    // Yup validation schema defines rules and error messages for each field
    validationSchema: Yup.object({
      name: Yup.string()
        .min(6, t('nameMin'))     // Name minimum length 6 characters
        .max(15, t('nameMax'))    // Name maximum length 15 characters
        .required(t('nameRequired')),  // Name is required
      email: Yup.string()
        .email(t('emailValid'))   // Must be a valid email format
        .required(t('emailRequired')), // Email is required
      password: Yup.string()
        .min(6, t('passwordMin'))  
    .matches(/[a-z]/, t('passwordLowercase'))  
    .matches(/[A-Z]/, t('passwordUppercase')) 
    .matches(/[0-9]/, t('passwordNumber'))  
    .matches(/[@$!%*?&]/, t('passwordSpecialChar')), 
      rePassword: Yup.string()
        .oneOf([Yup.ref('password')], t('passwordMatch')) // Must match password field
        .required(t('rePasswordRequired')),  // Repeat password is required
    }),
    // onSubmit calls signup function with the form values
    onSubmit: (values) => signup(values.name, values.email, values.password),
  });

  return (
    <div className="container relative mt-4" >
      <div className='w-full md:w-2/3 mx-auto'>
        {/* Form title */}
        <h2 className='text-2xl'>{t('register')}</h2>

        {/* Signup form */}
        <form className="w-full mx-auto mt-2 shadow bg-white p-6 rounded-2xl" onSubmit={formik.handleSubmit}>
          
          {/* Input field for Name */}
          <div className="relative z-0 w-full mb-3 group">
            <input
              onBlur={formik.handleBlur}           // Trigger validation on input blur
              onChange={formik.handleChange}       // Update formik state on input change
              value={formik.values.name}            // Controlled input value from formik
              type="text"
              name="name"
              id="floating_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:border-sky-600 peer"
              placeholder=" "
            />
            {/* Label for Name input */}
            <label
              htmlFor="floating_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-sky-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              {t('name')}:
            </label>
          </div>
          {/* Validation error message for Name */}
          {formik.touched.name && formik.errors.name && <div className="mb-5 text-sm text-red-800">{formik.errors.name}</div>}

          {/* Input field for Email */}
          <div className="relative z-0 w-full mb-3 group">
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
              type="email"
              name="email"
              id="floating_email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:border-sky-600 peer"
              placeholder=" "
            />
            {/* Label for Email input */}
            <label
              htmlFor="floating_email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-sky-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              {t('email')}:
            </label>
          </div>
          {/* Validation error message for Email */}
          {formik.touched.email && formik.errors.email && <div className="mb-5 text-sm text-red-800">{formik.errors.email}</div>}

          {/* Input field for Password */}
          <div className="relative z-0 w-full mb-3 group">
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
              type="password"
              name="password"
              id="floating_password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:border-sky-600 peer"
              placeholder=" "
            />
            {/* Label for Password input */}
            <label
              htmlFor="floating_password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-sky-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              {t('password')}:
            </label>
          </div>
          {/* Validation error message for Password */}
          {formik.touched.password && formik.errors.password && <div className="mb-5 text-sm text-red-800">{formik.errors.password}</div>}

          {/* Input field for Re-Password (confirm password) */}
          <div className="relative z-0 w-full mb-3 group">
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.rePassword}
              type="password"
              name="rePassword"
              id="floating_rePassword"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:border-sky-600 peer"
              placeholder=" "
            />
            {/* Label for Re-Password input */}
            <label
              htmlFor="floating_rePassword"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-sky-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              {t('rePassword')}:
            </label>
          </div>
          {/* Validation error message for Re-Password */}
          {formik.touched.rePassword && formik.errors.rePassword && <div className="mb-5 text-sm text-red-800">{formik.errors.rePassword}</div>}

          {/* Submit button and link to signin page */}
          <div className="flex-col md:flex-row flex items-start justify-between gap-y-3">
            <button
              type="submit"
              className="!underline text-white bg-sky-400 hover:bg-sky-500 px-8 cursor-pointer font-medium rounded-lg w-full md:w-auto block py-2.5 text-center md:me-auto"
            >
              {t('register')}
            </button>
            <Link
              to={'/signin'}
              className="!text-sky-400 cursor-pointer font-medium rounded-lg text-sm w-full md:w-auto block px-8 py-2.5 text-center md:ms-auto"
            >
              {t('signin')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup;
