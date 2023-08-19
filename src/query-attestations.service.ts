import { Inject, type OnModuleDestroy } from '@nestjs/common'
import { config } from './config'
import { CustomLogger } from './custom-logger'
import axios from 'axios'
import type { PrometheusService } from './prometheus/prometheus.service'
import _ from 'lodash'

export class QueryAttestationsService implements OnModuleDestroy {
  private readonly logger = new CustomLogger(QueryAttestationsService.toString())

  private readonly queryInterval: NodeJS.Timeout
  private runningQuery?: Promise<void>

  constructor(@Inject('PrometheusServiceToken') private prometheusService: PrometheusService) {
    const runTask = async () => {
      // run only if finished last run
      if (!this.runningQuery) {
        try {
          this.runningQuery = this.query()
        } catch (error) {
          this.logger.error(error)
        } finally {
          this.runningQuery = undefined
        }
      }
    }
    this.queryInterval = setInterval(runTask, config.queryIntervalSeconds * 1000)
    runTask()
  }

  private async getData() {
    const { data } = await axios.get<{
      status: 'OK' | 'something-else'
      data: {
        attesterslot: number
        committeeindex: number
        epoch: number
        inclusionslot: number
        status: 0 | 1
        validatorindex: number
        week: number
        week_start: string
        week_end: string
      }[]
    }>(
      'https://prater.beaconcha.in/api/v1/validator/216529,216530,216531,216536,216537,216538,216539,216540,216541,216542,216543,216544,216545,216549,235953,254984,268039,268323,269327,269437,273801,273875,275464,275768,278948,285161,286076,286247,301641,301642,301766,302947,314637,321664,332391,335915,337944,339070,346309,351564,353018,353631,356336,372937,373015,377457,379082,385084,386549,386673,387901,392258,393239,393400,394710,394711,399322,415326,415353,431732,438657,452943,453472,457331,460097,464035,465083,470270,471464,472836,473956,474004,474125,474129,478239,478243,478244,478245,479138,484156,484574,484577,485001,486823,487030,488161,495953,495954,502083,503169,503170,503174,503281,510557,512445,512648,512655,513067,513181,513631/attestations',
    )
    if (data.status === 'OK') {
      return data.data
    } else {
      throw new Error(`failed to get data from API. response: ${data}`)
    }
  }

  private async query(): Promise<void> {
    const nowMs = Date.now()
    this.logger.info('queringn beaconcha...')
    const data = await this.getData()
    const durationSeconds = (Date.now() - nowMs) / 1000

    const highestEpoch = Math.max(...data.map(d => d.epoch))
    const onlyFromTargetEpoch = data.filter(d => d.epoch === highestEpoch - 2)

    const succeed = onlyFromTargetEpoch.filter(d => d.status === 1)

    const averageInclusionDistance = _.sum(succeed.map(d => d.inclusionslot - d.attesterslot)) / succeed.length

    this.logger.info(
      `queried beaconcha in ${durationSeconds}s. succeed: ${succeed.length}/${onlyFromTargetEpoch.length}, averageInclusionDistance: ${averageInclusionDistance}`,
    )

    this.prometheusService.totalSucceedAttestations.set(succeed.length)
    this.prometheusService.totalMissedAttestations.set(onlyFromTargetEpoch.length - succeed.length)
    this.prometheusService.averageInclusionDistance.set(averageInclusionDistance)
  }

  async onModuleDestroy() {
    clearInterval(this.queryInterval)
    await this.runningQuery
  }
}
