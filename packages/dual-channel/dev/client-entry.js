// TODO upgrade to latest API
// https://github.com/gaearon/react-hot-loader#old-api
import { hot } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import Root from '../src/app'
import FullWidthWrapper from '../src/build-code/full-width-wrapper'

const reactRootId = 'root'

const chapters = window.__chapters
const embeddedItems = window.__embeddedItems

const HotLoaderRoot = hot(module)(Root)

ReactDOM.render(
  <FullWidthWrapper isFullWidth>
    <HotLoaderRoot chapters={chapters} embeddedItems={embeddedItems} />
  </FullWidthWrapper>,
  document.getElementById(reactRootId)
)
