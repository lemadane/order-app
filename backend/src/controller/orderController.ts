import { errCallback, filterObject } from '../utils';
import { Api, Controller, Orm, ErrCallback } from '../types';
import { Order, OrderItem } from '@prisma/client';

const orderController: Controller = (
  path: string,
  api: Api,
  orm: Orm,
  errorCallback: ErrCallback = errCallback
) => {
  api.get(`${path}`, async (request, reply) => {
    try {
      const orders = await orm.order.findMany({
        where: {
          active: true,
        },
      });
      reply.send(orders);
    } catch (err: any) {
      errorCallback(err, api, reply);
    }
  });

  api.post(`${path}`, async (request, reply) => {
    try {
      const { dateOfDelivery, customerId } = request.body as Order;
      const { orderItems } = request.body as { orderItems: OrderItem[] };
      const customer = await orm.customer.findUnique({
        where: { id: customerId, active: true },
      });
      if (!customer) {
        throw {
          message: `Customer with id=${customerId} not found`,
          status: 400,
        };
      }

      if (!orderItems || orderItems.length === 0) {
        throw { message: 'Order must have at least one item', status: 400 };
      }
      
      const partialOrder = await orm.order.create({
        data: {
          customer: { connect: { id: customerId } },
          dateOfDelivery: new Date(dateOfDelivery),
          total: 0,
        },
      });

      for (let item of orderItems) {
        const { skuId, quantity } = item;
        const sku = await orm.sku.findUnique({
          where: { id: skuId, active: true },
        });
        
        if (!sku) {
          throw { message: `Sku with id=${skuId} not found`, status: 400 };
        }
        
        const amount = sku.price * quantity;

        console.log({ amount, quantity, skuId });
        
        const orderItem = await orm.orderItem.create({
          data: {
            quantity,
            amount,
            order: { connect: { id: partialOrder.id } },
            sku: { connect: { id: skuId } },
          },
        });
        
        partialOrder.total += orderItem.amount;
      }

      const order = await orm.order.update({
        where: { id: partialOrder.id },
        data: { total: partialOrder.total },
        include: {
          orderItems: true,
          customer: true,
        },
      });
      const anyOrder = order as any
      for(const item of order.orderItems) {
        const anyItem =  item as any 
        anyItem.sku = await orm.sku.findUnique({
          where: { id: item.skuId, active: true }
        })
      }
      reply.send(anyOrder);
    } catch (err: any) {
      errorCallback(err, api, reply);
    }
  });

  api.get(`${path}/:id`, async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string };
      const order = await orm.order.findUnique({
        where: {
          id: parseInt(id),
          active: true,
        },
        include: {
          orderItems: true,
          customer: true,
        },
      });
      reply.send(order);
    } catch (err: any) {
      errorCallback(err, api, reply);
    }
  });

  api.patch(`${path}/:id`, async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string };
      const data = filterObject({
        ...(request.body as Object),
        timestamp: new Date(),
      });
      const order = await orm.order.update({
        where: {
          id: parseInt(id),
          active: true,
        },
        data,
      });
      reply.send(order);
    } catch (err: any) {
      errorCallback(err, api, reply);
    }
  });

  api.delete(`${path}/:id`, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const order = await orm.order.update({
        where: {
          id: parseInt(id),
          active: true,
        },
        data: { active: false, lastUpdate: new Date() },
      });
      if (order.active) {
        throw new Error('Order not deleted');
      }
      reply.send({ message: 'Order deleted' });
    } catch (err: any) {
      errorCallback(err, api, reply);
    }
  });
};

export default orderController;
