import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { CustomLogger } from './custom-logger'
import { config } from './config'
import { AppModule } from './app.module'

const logger = new CustomLogger('InitializeNestService')

export async function initializeNestService() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  app.enableCors()

  app.enableShutdownHooks()

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setDescription(`API documentation`).setVersion('1.0').build(),
  )

  const swaggerUrl = `api/docs`
  SwaggerModule.setup(swaggerUrl, app, document)

  logger.info(`prometheus metrics: http://localhost:${config.port}/metrics`)
  logger.info(`swagger-api docs: http://localhost:${config.port}/${swaggerUrl}`)

  await app.listen(config.port, '0.0.0.0')

  logger.info(`Listening on port ${config.port} (${process.uptime()}s)`)
}
