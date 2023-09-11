import { Service } from '@vtex/api'
import type {
  IOClients,
  ParamsContext,
  ServiceContext,
  RecorderState,
} from '@vtex/api'

import { queries as getUserData } from './resolvers/userData'
// import type { Clients } from './clients'

const TREE_SECONDS_MS = 3 * 1000
const CONCURRENCY = 10

declare global {
  type Context = ServiceContext<IOClients, State>

  interface State extends RecorderState {
    code: number
  }
}

export default new Service<IOClients, State, ParamsContext>({
  clients: {
    options: {
      events: {
        exponentialTimeoutCoefficient: 2,
        exponentialBackoffCoefficient: 2,
        initialBackoffDelay: 50,
        retries: 1,
        timeout: TREE_SECONDS_MS,
        concurrency: CONCURRENCY,
      },
    },
  },
  graphql: {
    resolvers: {
      Query: {
        ...getUserData,
      },
    },
  },
})
