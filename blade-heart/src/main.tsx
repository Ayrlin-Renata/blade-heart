import 'preact/debug'
import { render } from 'preact'
import Router from './Router.tsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const queryClient = new QueryClient()

render((
    <QueryClientProvider client={queryClient}>
        <Router />
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
), document.getElementById('app')!)
