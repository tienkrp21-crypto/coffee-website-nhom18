<<<<<<< HEAD
=======

import "tailwindcss";

>>>>>>> f3298702f0e56e585dd2c0c106e846685015f51d
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
<<<<<<< HEAD
import { CartProvider } from './context/CartContext'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {}
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
)
=======

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


>>>>>>> f3298702f0e56e585dd2c0c106e846685015f51d
