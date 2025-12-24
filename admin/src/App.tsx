import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router"
import Dashboard from './pages/dashboard'
import Overview from './pages/overview'
import Products from './pages/products'

const App = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>

         <Route path="/" element={ <Dashboard />}>
          <Route path="" element={<Overview/>} />
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App