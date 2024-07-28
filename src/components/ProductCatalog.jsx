import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/productCatalogApi';

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', unitPrice: 0 });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const validateProduct = (product) => {
    if (!product.name.trim()) {
      setErrorMessage('Product name cannot be empty or just spaces.');
      return false;
    }
    if (product.unitPrice <= 0) {
      setErrorMessage('Unit price must be greater than 0.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleCreateOrUpdate = async () => {
    if (validateProduct(newProduct)) {
      try {
        if (newProduct.id) {
          await updateProduct(newProduct.id, newProduct);
        } else {
          await createProduct(newProduct);
        }
        setNewProduct({ name: '', unitPrice: 0 });
        loadProducts();
      } catch (error) {
        console.error('Error saving product:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product) => {
    setNewProduct(product);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Product Catalog</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit Price</label>
          <input
            type="number"
            min={0.1}
            value={newProduct.unitPrice}
            onChange={(e) => setNewProduct({ ...newProduct, unitPrice: parseFloat(e.target.value) })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <button type="button" onClick={handleCreateOrUpdate} className="mt-4 bg-green-500 text-white py-2 px-4 rounded">
          {newProduct.id ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <table className="min-w-full bg-white border border-gray-200 mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Unit Price</th>
            <th className="px-4 py-2">Options</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.id}</td>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.unitPrice}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit(product)} className="text-blue-500 hover:underline mr-2">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductCatalog;
