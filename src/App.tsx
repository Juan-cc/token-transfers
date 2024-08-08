import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './config.ts'
import { PreviousEvents } from './previous-logs.tsx'

const queryClient = new QueryClient()


function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
        Chiliz Token Transfers
        <hr></hr>
        <PreviousEvents />
      </QueryClientProvider> 
    </WagmiProvider>
  )
}

export default App