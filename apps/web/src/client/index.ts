import type { RouterClient } from '@orpc/server'
import { createORPCClient, onError } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { router } from '@zahlungen/api/router'

const link = new RPCLink({
  origin: '',
  url: '/rpc',
  headers: { authorization: 'bearer token' },
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
  fetch: (request, init) => {
    // <- override fetch if needed
    return globalThis.fetch(request, {
      ...init,
      credentials: 'include', // Include cookies on cross-origin requests
    })
  },
})
export const orpc: RouterClient<typeof router> = createORPCClient(link)
