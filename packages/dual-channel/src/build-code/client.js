import buildConst from './constants'
import FullWidthWrapper from './full-width-wrapper'
import React from 'react'
import ReactDOM from 'react-dom'
import RootReactComponent from '../app'
// lodash
import debounce from 'lodash/debounce'
import get from 'lodash/get'

const _ = {
  debounce,
  get,
}

const namespace = buildConst.namespace
const pkg = buildConst.pkgName
const dataArr = _.get(window, [namespace, pkg], [])

if (Array.isArray(dataArr) && dataArr.length > 0) {
  // select first data to render and
  // removes it from data array
  const data = dataArr.shift()
  const { uuid, chapters, embeddedItems, fullWidth } = data

  ReactDOM.render(
    <FullWidthWrapper full={fullWidth}>
      <RootReactComponent chapters={chapters} embeddedItems={embeddedItems} />
    </FullWidthWrapper>,
    document.getElementById(uuid)
  )
}
