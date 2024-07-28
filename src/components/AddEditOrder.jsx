import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createOrder, updateOrder, getOrderById } from '../api/ordersApi';
import { getProducts } from '../api/productCatalogApi';
import Modal from './Modal';

function AddEditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    orderNumber: '',
    date: new Date().toISOString().split('T')[0],
    numProducts: 0,
    finalPrice: 0,
    status: 'Pending',
    products: []
  });

  const [catalogProducts, setCatalogProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ id: '', name: '', unitPrice: 0, qty: 0, totalPrice: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [orderNumberError, setOrderNumberError] = useState('');

  useEffect(() => {
    if (id) {
      loadOrder(id);
    }
    loadCatalogProducts();
  }, [id]);

  const loadOrder = async (id) => {
    try {
      const response = await getOrderById(id);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  const loadCatalogProducts = async () => {
    try {
      const response = await getProducts();
      setCatalogProducts(response.data);
    } catch (error) {
      console.error('Error fetching catalog products:', error);
    }
  };

  const handleAddProductClick = () => {
    setNewProduct({ id: '', name: '', unitPrice: 0, qty: 0, totalPrice: 0 });
    setIsModalOpen(true);
  };

  const validateProduct = (product) => {
    if (!product.id || !product.name || product.unitPrice <= 0 || product.qty <= 0) {
      setErrorMessage('Please provide valid product details.');
      return false;
    }
    return true;
  };

  const handleAddProduct = () => {
    if (validateProduct(newProduct)) {
      setOrder((prevOrder) => ({
        ...prevOrder,
        products: [...prevOrder.products, { ...newProduct, id: null }], // Set id to null for new products
        finalPrice: prevOrder.finalPrice + newProduct.totalPrice,
        numProducts: prevOrder.numProducts + 1
      }));
      setIsModalOpen(false);
    }
  };

  const updateProduct = (index, field, value) => {
    const updatedProducts = [...order.products];
    updatedProducts[index][field] = value;
    if (field === 'id') {
      const selectedProduct = catalogProducts.find(product => product.id === parseInt(value));
      if (selectedProduct) {
        updatedProducts[index].name = selectedProduct.name;
        updatedProducts[index].unitPrice = selectedProduct.unitPrice;
        updatedProducts[index].totalPrice = selectedProduct.unitPrice * updatedProducts[index].qty;
      }
    } else if (field === 'qty') {
      updatedProducts[index].totalPrice = updatedProducts[index].unitPrice * value;
    }
    setOrder((prevOrder) => ({
      ...prevOrder,
      products: updatedProducts,
      finalPrice: updatedProducts.reduce((acc, product) => acc + product.totalPrice, 0),
      numProducts: updatedProducts.length
    }));
  };

  const removeProduct = (index) => {
    const updatedProducts = order.products.filter((_, i) => i !== index);
    setOrder((prevOrder) => ({
      ...prevOrder,
      products: updatedProducts,
      finalPrice: updatedProducts.reduce((acc, product) => acc + product.totalPrice, 0),
      numProducts: updatedProducts.length
    }));
  };

  const validateOrderNumber = (orderNumber) => {
    const orderNumberRegex = /^[a-zA-Z0-9]*$/;
    if (!orderNumberRegex.test(orderNumber)) {
      setOrderNumberError('Order number can only contain letters and numbers.');
      return false;
    }
    setOrderNumberError('');
    return true;
  };

  const validateOrder = () => {
    if (!order.orderNumber) {
      setErrorMessage('Order number cannot be empty.');
      return false;
    }
    if (!validateOrderNumber(order.orderNumber)) {
      return false;
    }
    if (order.products.length === 0) {
      setErrorMessage('Order must contain at least one product.');
      return false;
    }
    return true;
  };

  const saveOrder = async () => {
    if (validateOrder()) {
      try {
        console.log('Saving order:', order); // Debugging line to check the order object
        if (id) {
          await updateOrder(id, order);
          alert('Order updated successfully!');
        } else {
          await createOrder(order);
          alert('Order created successfully!');
        }
        navigate('/my-orders');
      } catch (error) {
        console.error('Error saving order:', error);
        alert('Failed to save order');
      }
    }
  };

  const isCompleted = order.status === 'Completed';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Order' : 'Add Order'}</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Order #</label>
          <input
            type="text"
            value={order.orderNumber}
            onChange={(e) => {
              setOrder({ ...order, orderNumber: e.target.value });
              validateOrderNumber(e.target.value);
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={id || isCompleted} // Deshabilitar si se está editando
          />
          {orderNumberError && <p className="text-red-500 text-sm">{orderNumberError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="text"
            value={order.date}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700"># Products</label>
          <input
            type="text"
            value={order.products.length}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Final Price</label>
          <input
            type="text"
            value={order.finalPrice}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={order.status}
            onChange={(e) => setOrder({ ...order, status: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isCompleted}
          >
            <option value="Pending">Pending</option>
            <option value="InProgress">InProgress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button type="button" onClick={handleAddProductClick} className="bg-blue-500 text-white py-2 px-4 rounded" disabled={isCompleted}>Add Product</button>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              {/* <th className="px-4 py-2">ID</th> */}
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Unit Price</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Total Price</th>
              <th className="px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((product, index) => (
              <tr key={index}>
                {/* <td className="border px-4 py-2">
                  <select
                    value={product.id}
                    onChange={(e) => updateProduct(index, 'id', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    disabled={isCompleted}
                  >
                    <option value="">Select product</option>
                    {catalogProducts.map((catalogProduct) => (
                      <option key={catalogProduct.id} value={catalogProduct.id}>
                        {catalogProduct.name}
                      </option>
                    ))}
                  </select>
                </td> */}
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">{product.unitPrice}</td>
                <td className="border px-4 py-2">{product.qty}</td>
                <td className="border px-4 py-2">{product.unitPrice * product.qty}</td>
                <td className="border px-4 py-2">
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="text-red-500 hover:underline"
                    disabled={isCompleted}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={saveOrder} className="mt-4 bg-green-500 text-white py-2 px-4 rounded" disabled={false}>Save Order</button>
      </form>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add Product</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <select
              value={newProduct.id}
              onChange={(e) => {
                const selectedProduct = catalogProducts.find(product => product.id === parseInt(e.target.value));
                setNewProduct({
                  ...newProduct,
                  id: selectedProduct.id,
                  name: selectedProduct.name,
                  unitPrice: selectedProduct.unitPrice,
                  totalPrice: selectedProduct.unitPrice * newProduct.qty
                });
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select product</option>
              {catalogProducts.map((catalogProduct) => (
                <option key={catalogProduct.id} value={catalogProduct.id}>
                  {catalogProduct.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={newProduct.qty}
              min={1}
              onChange={(e) => setNewProduct({ ...newProduct, qty: parseInt(e.target.value, 10), totalPrice: newProduct.unitPrice * parseInt(e.target.value, 10) })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Price</label>
            <input
              type="text"
              value={newProduct.totalPrice}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={handleAddProduct} className="bg-green-500 text-white py-2 px-4 rounded">Add</button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white py-2 px-4 rounded">Cancel</button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={!!errorMessage} onClose={() => setErrorMessage('')}>
        <h2 className="text-xl font-bold mb-4">Error</h2>
        <p>{errorMessage}</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button type="button" onClick={() => setErrorMessage('')} className="bg-red-500 text-white py-2 px-4 rounded">Close</button>
        </div>
      </Modal>
    </div>
  );
}

export default AddEditOrder;
