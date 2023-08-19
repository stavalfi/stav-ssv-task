import _Logger from '@ptkdev/logger'

export class CustomLogger {
  private readonly _logger = new _Logger({ type: 'json' })

  constructor(private readonly tag: string) {}

  error(message: string | Error | unknown): void {
    // @ts-ignore
    this._logger.error(message)
  }

  info(message: string): void {
    this._logger.info(message)
  }

  warning(message: string): void {
    this._logger.warning(message)
  }

  debug(message: string): void {
    this._logger.debug(message)
  }
}
