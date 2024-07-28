import axios from "axios";

const API_URL = "http://localhost:8080/api/product-catalog";

export const getProducts = async () => {
  return axios.get(API_URL);
};

export const getProductById = async (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createProduct = async (product) => {
  return axios.post(API_URL, product);
};

export const updateProduct = async (id, product) => {
  return axios.put(`${API_URL}/${id}`, product);
};

export const deleteProduct = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
