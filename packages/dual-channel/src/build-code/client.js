import buildConst from './constants'
import React from 'react'
import ReactDOM from 'react-dom'
import RootReactComponent from '../app'
// lodash
import get from 'lodash/get'

const _ = {
  get,
}

const namespace = buildConst.namespace
const pkg = buildConst.pkgName
const dataArr = _.get(window, [namespace, pkg], [])

if (Array.isArray(dataArr) && dataArr.length > 0) {
  // select first data to render and
  // removes it from data array
  const data = dataArr.shift()
  const { uuid, chapters, embeddedItems, isFullWidth } = data

  ReactDOM.render(
    <RootReactComponent
      isFullWidth={isFullWidth}
      chapters={chapters}
      embeddedItems={embeddedItems}
    />,
    document.getElementById(uuid)
  )
}
