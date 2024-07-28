import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MyOrders from './components/MyOrders';
import AddEditOrder from './components/AddEditOrder';
import ProductCatalog from './components/ProductCatalog';
import './index.css'; // Asegúrate de importar el archivo de CSS

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/add-edit-order/:id" element={<AddEditOrder />} />
            <Route path="/add-edit-order" element={<AddEditOrder />} />
            <Route path="/product-catalog" element={<ProductCatalog />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
