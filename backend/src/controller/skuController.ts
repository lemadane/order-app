import { Api, Controller, ErrCallback, Orm } from "../types"
import { errCallback, filterObject } from "../utils"
import { Sku } from "@prisma/client"

const skuController: Controller = (
  path: string,
  api: Api,
  orm: Orm,
  errorCallback: ErrCallback = errCallback,
) => {

  api.get(`${path}`, async (request, reply) => {
    try {
      const sku = await orm.sku.findMany({
        where: {
          active: true,
        }
      })
      reply.send(sku)
    } catch (err: any) {
      errorCallback(err, api, reply)
    }
  })

  api.post(`${path}`, async (request, reply) => {
    try {
      const data = request.body as Sku
      console.log(data);
      const sku = await orm.sku.create({
        data,
      })
      reply.send(sku)
    } catch (err: any) {
      console.debug({errmessage: err.message})
      errorCallback(err, api, reply)
    }
  })

  api.get(`${path}/:id`, async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string }
      const sku = await orm.sku.findUnique({
        where: {
          id: parseInt(id),
          active: true,
        }
      })
      reply.send(sku)
    } catch (err: any) {
      errorCallback(err, api, reply)
    }
  })

  api.patch(`${path}/:id`, async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string }
      const data = { ...filterObject(request.body as Object), timestamp: new Date() }
      const sku = await orm.sku.update({
        where: {
          id: parseInt(id),
          active: true,
        },
        data,
      })
      reply.send(sku)
    } catch (err: any) {
      errorCallback(err, api, reply)
    }
  })

  api.delete(`${path}/:id`, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const sku = await orm.sku.update({
        where: {
          id: parseInt(id),
          active: true,
        },
        data: { active: false, lastUpdate: new Date() }
      })
      if (sku.active) {
        throw new Error('Sku not deleted')
      }
      reply.send({ message: 'Sku deleted' })
    } catch (err: any) {
      errorCallback(err, api, reply)
    }
  })
}

export default skuController