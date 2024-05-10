import { Api, Controller, Orm, ErrCallback } from "../types"
import { errCallback, filterObject } from "../utils"
import { OrderItem } from "@prisma/client"


const orderItemController: Controller = (
  path: string,
  api: Api,
  orm: Orm,
  errorCallback: ErrCallback = errCallback,
) => {

  api.get(`${path}`, async (request, reply) => {
    try {
      const orderItems = await orm.orderItem.findMany({
        where: {
          active: true,
        }
      })
      reply.send(orderItems)
    } catch (err: any) {
      errorCallback(err, api, reply)
    }
  })

  api.post(`${path}`, async (request, reply) => {
    try {
      const { orderId, skuId, quantity } = request.body as OrderItem
      const sku = await orm.sku.findUnique({ where: { id: skuId, active: true } })
      if (!sku) {
        throw { message: `Sku with id=${skuId} not found`, status: 400 }
      }
      const order = await orm.order.findUnique({ where: { id: orderId, active: true } })
      if (!order) {
        throw { message: `Order with id=${orderId} not found`, status: 400 }
      }
      const amount = sku.price * quantity
      const orderItem = await orm.orderItem.create({
        data: {
          quantity,
          amount,
          order: { connect: { id: orderId } },
          sku: { connect: { id: skuId } },
        }
      })
      reply.send(orderItem)
    } catch (err: any) {
      errorCallback(err, api, reply)
    }
  })

  api.get(`${path}/:id`, async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string }
      const orderItem = await orm.orderItem.findUnique({
        where: {
          id: parseInt(id),
          active: true,
        }
      })
      reply.send(orderItem)
    } catch (err: any) {
      errorCallback(err, api, reply)
    }
  })

  api.patch(`${path}/:id`, async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string }
      const data = filterObject({ ...(request.body as Object), timestamp: new Date() })
      const orderItem = await orm.orderItem.update({
        where: {
          id: parseInt(id),
          active: true,
        },
        data,
      })
      reply.send(orderItem)
    } catch (err: any) {
      errorCallback(err, api, reply)
    }
  })

  api.delete(`${path}/:id`, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const orderItem = await orm.orderItem.update({
        where: {
          id: parseInt(id),
          active: true,
        },
        data: { active: false, lastUpdate: new Date() }
      })
      if (orderItem.active) {
        throw new Error('Order item not deleted')
      }
      reply.send({ message: 'Order item deleted' })
    } catch (err: any) {
      errorCallback(err, api, reply)
    }
  })
}

export default orderItemController