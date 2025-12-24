
import { BrowserRouter, Route, Routes } from "react-router"
import Dashboard from './pages/dashboard'
import Overview from './pages/overview'
import Products from './pages/products'
import Analytics from "./pages/analytics"
import Reports from "./pages/reports"
import AddNewProduct from "./pages/add_new_product"
import LowStack from "./pages/low_stack"
import Purchases from "./pages/purchases"
import Sales from "./pages/sales"
import Returns from "./pages/returns"

const App = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
         <Route path="/" element={ <Dashboard />}>
          <Route path="" element={<Overview/>} />
          <Route path="analytics" element={<Analytics/>} />
          <Route path="reports" element={<Reports/>} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<AddNewProduct/>} />
          <Route path="products/categories" element={<div>Categories</div>} />
          <Route path="products/low-stock" element={<LowStack/>} />
          <Route path="transactions/purchases" element={<Purchases/>} />
          <Route path="transactions/sales" element={<Sales/>} />
          <Route path="transactions/returns" element={<Returns/>} />
        </Route>

      </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App