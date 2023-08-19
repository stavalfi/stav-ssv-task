// NOTE: do NOT change the order of the imports in this file!

import 'reflect-metadata'

import { initializeNestService } from './initialize-nest-service'

// the stack-traces in debugging and in errors are wrong if this we are using this package + ts-node/ts-jest
if (__filename.endsWith('js')) {
  // eslint-disable-next-line global-require
  require('@cspotcode/source-map-support/register')
}

if (require.main === module) {
  initializeNestService()
}
