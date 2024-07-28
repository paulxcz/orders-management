import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, deleteOrder } from '../api/ordersApi';

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      loadOrders(); // Reload orders after deletion
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Order #</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2"># Products</th>
            <th className="px-4 py-2">Final Price</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Options</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td className="border px-4 py-2">{order.id}</td>
              <td className="border px-4 py-2">{order.orderNumber}</td>
              <td className="border px-4 py-2">{order.date}</td>
              <td className="border px-4 py-2">{order.numProducts}</td>
              <td className="border px-4 py-2">{order.finalPrice}</td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2">
                <Link to={`/add-edit-order/${order.id}`} className={`text-blue-500 hover:underline mr-2 ${order.status === 'Completed' ? 'pointer-events-none text-gray-500' : ''}`}>Edit</Link>
                <button onClick={() => handleDelete(order.id)} className={`text-red-500 hover:underline ${order.status === 'Completed' ? 'pointer-events-none text-gray-500' : ''}`}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/add-edit-order" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded">Add New Order</Link>
    </div>
  );
}

export default MyOrders;
