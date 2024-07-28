import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

export const getOrders = async () => {
  return axios.get(API_URL);
};

export const getOrderById = async (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createOrder = async (order) => {
  return axios.post(API_URL, order);
};

export const updateOrder = async (id, order) => {
  return axios.put(`${API_URL}/${id}`, order);
};

export const deleteOrder = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
