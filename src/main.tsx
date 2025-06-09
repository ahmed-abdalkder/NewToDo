import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "flowbite"
import 'flowbite-react'
import "@fortawesome/fontawesome-free/css/all.min.css"
import './index.css'
import App from './App.tsx'
  import './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     
    <App />
    
  </StrictMode>
)
