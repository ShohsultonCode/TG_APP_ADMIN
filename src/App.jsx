import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Error from './pages/error'
import Home from './pages/home'
import AddProduct from './pages/addProduct'
import ProductDetail from './pages/product'



const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/products/:productId' element={<ProductDetail />}></Route>
        <Route path='/add/product' element={<AddProduct />}></Route>
        <Route path='/orders' element={<AddProduct />}></Route>
        <Route path='*' element={<Error />}></Route>
      </Routes>
    </>
  )
}
export default App
