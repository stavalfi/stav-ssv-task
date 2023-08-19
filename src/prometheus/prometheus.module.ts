import { Module } from '@nestjs/common'
import { PrometheusService } from './prometheus.service'
import { PrometheusController } from './prometheus.controller'

@Module({
  imports: [],
  providers: [
    {
      provide: 'PrometheusServiceToken',
      useClass: PrometheusService,
    },
  ],
  exports: ['PrometheusServiceToken'],
  controllers: [PrometheusController],
})
export class PrometheusModule {}
