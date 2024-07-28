import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Navigation</h2>
      <ul>
        <li className="mb-2">
          <Link to="/my-orders" className="text-gray-300 hover:text-white">My Orders</Link>
        </li>
        <li>
          <Link to="/add-edit-order" className="text-gray-300 hover:text-white">Add Order</Link>
        </li>
        <li>
          <Link to="/product-catalog" className="text-gray-300 hover:text-white">Product Catalog</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
