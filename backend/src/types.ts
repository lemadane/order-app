import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { FastifyBaseLogger, FastifyInstance, FastifyReply, FastifyTypeProviderDefault, RawServerDefault } from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";

export type Api = FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProviderDefault>

export type Orm = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>

export type Reply = FastifyReply<Server<typeof IncomingMessage, typeof ServerResponse>, IncomingMessage, ServerResponse<IncomingMessage>>

export class ApiError extends Error {
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
  status: number;
}

export type ErrCallback = (error: ApiError, api: Api, reply: Reply) => void

export type Controller  = (path: string, api: Api, orm: Orm, ecb?: ErrCallback) => void




