import type { OnModuleDestroy } from '@nestjs/common'
import { collectDefaultMetrics, Gauge, Registry } from 'prom-client'

export class PrometheusService implements OnModuleDestroy {
  public readonly registry = new Registry()

  constructor() {
    collectDefaultMetrics({ register: this.registry })
  }

  async onModuleDestroy() {
    // to stop any async operations when prometheus call us to get new metrics
    this.registry.clear()
  }

  public async getMetrics() {
    return this.registry.metrics()
  }

  public readonly totalSucceedAttestations = new Gauge({
    name: `total_succeed_attestations`,
    help: 'how many validators attested',
    registers: [this.registry],
  })

  public readonly totalMissedAttestations = new Gauge({
    name: `total_missed_attestations`,
    help: 'how many validators missed',
    registers: [this.registry],
  })

  public readonly averageInclusionDistance = new Gauge({
    name: `average_inclusion_distance`,
    help: 'Inclusion distance is how many slots passed until the attestation was included in the chain',
    registers: [this.registry],
  })
}
