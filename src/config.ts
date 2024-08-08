import { createConfig, http } from 'wagmi'
import { spicy } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'


const httpUrl = import.meta.env.VITE_RPC_URL

export const config = createConfig({
  multiInjectedProviderDiscovery: false, 
  chains: [spicy],
  connectors: [
    injected(),
  ],
  transports: {
    [spicy.id]: http(
            httpUrl, 
        {
          retryCount: 5, 
          retryDelay: 100, 
          timeout: 60_000, 
        }),
  },
})

