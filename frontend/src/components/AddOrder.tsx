import { useEffect, useState } from 'react';
import {
  Customer,
  Sku,
  OrderItem,
  OrderItemInput,
  OrderInput,
  Order,
} from '../common/types';
import {
  createOrderService,
  fetchCustomersService,
  fetchSkusService,
} from '../common/services';
import SearchCustomer from './SearchCustomer';
import SearchSku from './SearchSku';
import DatePicker from './DatePicker';
import { yyyymmdd } from '../common/utils';

export default function AddOrder() {
  const [customers, setCustomers] = useState([] as Customer[]);
  const [skus, setSkus] = useState([] as Sku[]);
  const [customer, setCustomer] = useState({} as Customer);
  const [sku, setSku] = useState({} as Sku);
  const [orderItems, setOrderItems] = useState([] as OrderItem[]);
  const [dateOfDelivery, setDeliveryDate] = useState(yyyymmdd(new Date()));
  const [quantity, setQuantity] = useState('0');
  const [customerSearchText, setCustomerSearchText] = useState('');
  const [skuSearchText, setSkuSearchText] = useState('');
  const [orders, setOrders] = useState([] as Order[]);

  useEffect(() => {
    (async () => {
      const customers = await fetchCustomersService();
      setCustomers(customers);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const skus = await fetchSkusService();
      setSkus(skus);
    })();
  }, []);

  const handleAddOrderItem = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const qtty = parseInt(quantity);
    if (!sku.id) {
      console.error('sku not found');
      return;
    }

    if (qtty <= 0) {
      console.error('quantity must be greater than 0');
      return;
    }

    const orderItem = {
      skuId: sku.id,
      sku: sku,
      quantity: qtty,
      amount: sku.price * qtty,
    } as OrderItem;
    setOrderItems([...orderItems, orderItem]);
    setSku({} as Sku);
    setSkuSearchText('');
    setQuantity('0');
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setQuantity(value);
  };

  const handleAddOrder = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!customer.id || orderItems.length === 0 || !dateOfDelivery) {
      return;
    }

    const orderInput = {
      customerId: customer.id,
      dateOfDelivery: dateOfDelivery,
      orderItems: orderItems.map((orderItem) => {
        return {
          skuId: orderItem.skuId,
          quantity: orderItem.quantity,
        };
      }) as OrderItemInput[],
    } as OrderInput;

    console.log({ orderInput });

    const createOrder = async () => {
      const order = await createOrderService(orderInput);
      console.log({ order });
      setOrders([...orders, order]);
    };
    createOrder();
    setOrderItems([]);
    setCustomerSearchText('');
    setSkuSearchText('');
    setQuantity('0');
  };

  return (
    <div className='add-order'>
      <form>
        <h2>Order</h2>

        <SearchCustomer
          customers={customers}
          setSelectedCustomer={setCustomer}
          customerSearchText={customerSearchText}
          setCustomerSearchText={setCustomerSearchText}
        />

        <DatePicker
          label='Delivery Date'
          setDate={setDeliveryDate}
          date={dateOfDelivery}
          min={yyyymmdd(new Date())}
        />

        <h3>Order Item</h3>

        <SearchSku
          skus={skus}
          setSelectedSku={setSku}
          skuSearchText={skuSearchText}
          setSkuSearchText={setSkuSearchText}
        />

        <label htmlFor='quantity'>Quantity</label>
        <input
          type='number'
          id='quantity'
          name='quantity'
          onChange={handleQuantityChange}
          // onBlur={formik.handleBlur}
          value={quantity}
        />

        <button onClick={handleAddOrderItem}>Add Order Item</button>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Unit</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {orderItems.map((orderItem, index) => {
              return (
                <tr
                  className='output'
                  key={index}
                >
                  <td>{orderItem.sku?.name} </td>
                  <td>{orderItem.sku?.unit} </td>
                  <td>{orderItem.sku?.price} </td>
                  <td>{orderItem.quantity} </td>
                  <td>{orderItem.amount} </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button onClick={handleAddOrder}>Add Order</button>
      </form>

      <div>
        <h2>Purchase Order</h2>
        <div>
          {
            orders.map((order) => {
              return (
                <div key={order.id}>
                  <h3>Order</h3>
                  <div>
                    <div>
                      Customer: {order.customer?.firstname}{' '}
                      {order.customer?.lastname}
                    </div>
                    <div>Delivery Date: {yyyymmdd(new Date(order.dateOfDelivery))}</div>
                    <div>Tota Amount: {order.total}</div>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Unit</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems?.map((orderItem, index) => {
                        return (
                          <tr key={index}>
                            <td>{orderItem.sku?.name} </td>
                            <td>{orderItem.sku?.unit} </td>
                            <td>{orderItem.sku?.price} </td>
                            <td>{orderItem.quantity} </td>
                            <td>{orderItem.amount} </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            }) //map
          }
        </div>
      </div>
    </div>
  );
}
