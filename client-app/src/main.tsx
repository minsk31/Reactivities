import React from 'react'
import ReactDOM from 'react-dom/client'
import 'semantic-ui-css/semantic.min.css'
import 'react-calendar/dist/Calendar.css'
import './app/layout/styles.css'
import { Store, StoreContext } from './app/stores/store.ts'
import {RouterProvider} from 'react-router-dom'
import { router } from './app/router/Router.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreContext.Provider value={Store}>
    <RouterProvider router={router}/>
    </StoreContext.Provider>
  </React.StrictMode>,
)
