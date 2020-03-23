import React from 'react'
import ReactDOM from 'react-dom'
import RootReactComponent from '../app'
import get from 'lodash/get'
import buildConst from './constants'

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
  const { uuid, chapters, embeddedItems } = data

  ReactDOM.render(
    <RootReactComponent chapters={chapters} embeddedItems={embeddedItems} />,
    document.getElementById(uuid)
  )
}
