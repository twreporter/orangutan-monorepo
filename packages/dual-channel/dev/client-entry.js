// TODO upgrade to latest API
// https://github.com/gaearon/react-hot-loader#old-api
import { hot } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import Root from '../src/app'

const reactRootId = 'root'

const chapters = window.__chapters
const embeddedItems = window.__embeddedItems

const HotLoaderRoot = hot(module)(Root)

ReactDOM.render(
  <div>
    <div style={{ height: '50vh', width: '100%', backgroundColor: 'pink' }} />
    <HotLoaderRoot
      chapters={chapters}
      embeddedItems={embeddedItems}
      isFullWidth
    />
    <div style={{ height: '50vh', width: '100%', backgroundColor: 'pink' }} />
  </div>,
  document.getElementById(reactRootId)
)
