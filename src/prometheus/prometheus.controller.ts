import { Controller, Get, Header, Inject } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { register } from 'prom-client'
import type { PrometheusService } from './prometheus.service'

@ApiTags(`prometheus`)
@Controller('/')
export class PrometheusController {
  constructor(@Inject('PrometheusServiceToken') private prometheusService: PrometheusService) {}

  @Get('/metrics')
  @Header('Content-Type', register.contentType)
  root(): Promise<string> {
    return this.prometheusService.getMetrics()
  }
}
