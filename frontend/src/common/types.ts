export type CustomerFormErrors = {
  firstname: string;
  lastname: string;
  mobile: string;
  city: string;
};

export type SkuFormErrors = {
  name: string;
  unit: string;
  code: string;
  price: string;
  image: string;
};

export type OrderFormErrors = {
  dateOfDelivery: string;
};

export type CustomerInput = {
  firstname: string;
  lastname: string;
  mobile: string;
  city: string;
};

export type SkuInput = {
  name: string;
  unit: string;
  code: string;
  price: number;
  image?: string;
};

export type OrderItemInput = {
  skuId: number;
  quantity: number;
};

export type OrderInput = {
  customerId: number
  dateOfDelivery: string
  orderItems: OrderItemInput[]
};

export type Customer = {
  id: number;
  firstname: string;
  lastname: string;
  mobile: string;
  city: string;
  orders?: Order[];
};

export type Sku = {
  id: number;
  name: string;
  unit: string;
  code: string;
  price: number;
  image?: string;
};

export type OrderItem = {
  id: number;
  skuId: number;
  orderId: number;
  sku?: Sku;
  quantity: number;
  amount: number;
};


export type Order = {
  id: number;
  customerId: number;
  customer?: Customer;
  dateOfDelivery: string;
  total: number;
  orderItems?: OrderItem[];
};
