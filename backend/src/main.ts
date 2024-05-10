import { PrismaClient } from '@prisma/client'
import Fastify from 'fastify'
import skuController from './controller/skuController'
import customerController from './controller/customerController'
import orderItemController from './controller/orderItemController'
import orderController from './controller/orderController'
import { env } from 'process'
import cors from '@fastify/cors'

const api = Fastify({ logger: true })
const orm = new PrismaClient()

api.get('/ping', async () => {
  return 'pong'
})

async function cleanup() {
  api.log.info('Disconnecting from database')
  await orm?.$disconnect()
  api.log.info('Server closing...')
  await api?.close()
}

function suffix() {
  const appName = process.env.API_NAME
  const version = process.env.API_VERSION
  const env = process.env.NODE_ENV || 'dev'
  return `/${appName}/${version}/${env}`
}

async function main() {
    const port = parseInt(process.env.PORT as string)
    api.register(cors, {
      origin: `http://localhost:5173`,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type'],
      exposedHeaders: ['Content-Type'],
    });
    customerController(`${suffix()}/customers`, api, orm)
    skuController(`${suffix()}/skus`, api, orm)
    orderController(`${suffix()}/orders`, api, orm)
    orderItemController(`${suffix()}/order-items`, api, orm)
    
    await api.listen({ port })
    
    process.on('SIGINT', async (signal) => {
      api.log.info(`Caught interrupt signal: ${signal.toString()}`)
      await cleanup()
      process.exit(0)
    })

    process.on('uncaughtException', async (err: Error) => {
      api.log.error(`Uncaught Exception: ${err.toString()}`)
      await cleanup()
      process.exit(1)
    })

    process.on('unhandledRejection', async (reason, promise) => {
      const error = { reason, promise }
      api.log.error(`Unhandled Rejection: ', ${error}`)
      await cleanup()
      process.exit(1)
    })
}

main()