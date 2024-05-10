import { timeStamp } from "console"
import { Api, Controller, Orm, ErrCallback, ApiError } from "../types"
import { errCallback, filterObject } from "../utils"
import { Customer } from "@prisma/client"


const customerController: Controller = (
  path: string,
  api: Api,
  orm: Orm,
  errorCallback: ErrCallback = errCallback,
) => {

  api.get(`${path}`, async (request, reply) => {
    try {
      const customers = await orm.customer.findMany({
        where: {
          active: true,
        }
      })
      reply.send(customers)
    } catch (err: any) {
      errorCallback(err as ApiError, api, reply)
    }
  })

  api.post(`${path}`, async (request, reply) => {
    try {
      
      const data = request.body as Customer
      const customer = await orm.customer.create({
        data,
      })
      reply.send(customer)
    } catch (err: any) {
      errorCallback(err, api, reply)
    }
  })

  api.get(`${path}/:id`, async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string }
      const customer = await orm.customer.findUnique({
        where: {
          id: parseInt(id),
          active: true,
        },
        include: {
          orders: true,
        }
      })
      reply.send(customer)
    } catch (err: any) {
      errorCallback(err, api, reply)
    }
  })

  api.patch(`${path}/:id`, async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string }
      const data = filterObject({ ...(request.body as Object), timestamp: new Date() })
      const customer = await orm.customer.update({
        where: {
          id: parseInt(id),
          active: true,
        },
        data,
      })
      reply.send(customer)
    } catch (err: any) {
      errorCallback(err, api, reply)
    }
  })

  api.delete(`${path}/:id`, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const customer = await orm.customer.update({
        where: {
          id: parseInt(id),
          active: true,
        },
        data: { active: false, lastUpdate: new Date() }
      })
      if (customer.active) {
        throw new Error('Sku not deleted')
      }
      reply.send({ message: 'Customer deleted' })
    } catch (err: any) {
      errorCallback(err, api, reply)
    }
  })
}

export default customerController