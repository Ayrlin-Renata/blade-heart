import 'preact/debug'
import { render } from 'preact'
import Router from './Router.tsx'
import Store from  '@/utils/store.tsx'
import { Provider } from 'react-redux'

render((
    <Provider store={Store}>
        <Router />
    </Provider>
), document.getElementById('app')!)
