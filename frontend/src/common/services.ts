import axios from 'axios';
import { Customer, CustomerInput, Order, OrderInput, Sku, SkuInput } from './types';

axios.defaults.baseURL = 'http://localhost:4000/order-api/01/dev';

export async function createCustomerService(customer: CustomerInput) {
  const response = await axios.post('/customers', customer);
  return response.data as Customer;
}

export async function fetchCustomersService() {
  const response = await axios.get('/customers');
  return response.data as Customer[];
}

export const createSkuService = async (sku: SkuInput) => {
  const response = await axios.post('/skus', sku);
  return response.data as Sku;
};

export async function fetchSkusService() {
  const response = await axios.get('/skus');
  return response.data as Sku[];
}


export const createOrderService = async (order: OrderInput) => {
  const response = await axios.post('/orders', order);
  return response.data as Order;
};
