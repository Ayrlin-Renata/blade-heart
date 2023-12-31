
//hooks
import { useState } from 'preact/hooks'

//css
import './css/app.scss'

//components
import PageHeader from './components/PageHeader'
import ContentList from './components/ContentList'
import PageFooter from './components/PageFooter'

//
// APP RENDER
//
export function App() {

  return (
    <>
      <PageHeader/>
      <ContentList/>
      <PageFooter/>
    </>
  )
}
