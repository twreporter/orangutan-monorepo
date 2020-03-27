import { ThemeProvider } from '@material-ui/core/styles'
import * as buildConsts from './constants/build'
import App from './components/app'
import React from 'react'
import ReactDOM from 'react-dom'
import set from 'lodash/set'
import theme from './constants/theme'

function renderAppTo(renderTo, appProps) {
  const targetElement =
    typeof renderTo === 'string' ? document.querySelector(renderTo) : renderTo
  ReactDOM.hydrate(
    <ThemeProvider theme={theme}>
      <App {...appProps} />
    </ThemeProvider>,
    targetElement
  )
}

if (typeof window !== 'undefined') {
  set(
    window,
    [buildConsts.namespace, buildConsts.pkgName, 'renderAppTo'],
    renderAppTo
  )
}
