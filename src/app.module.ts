import { Module } from '@nestjs/common'
import { LivenessReadinessChecksController } from './liveness-readiness-checks.controller'
import { PrometheusModule } from './prometheus/prometheus.module'
import { QueryAttestationsService } from './query-attestations.service'

@Module({
  imports: [PrometheusModule],
  providers: [QueryAttestationsService],
  controllers: [LivenessReadinessChecksController],
})
export class AppModule {}
