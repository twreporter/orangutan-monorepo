import React from 'react'
import ReactDOM from 'react-dom'
import ScrollHorizontal from '../components/scroll-horizontal'
import get from 'lodash/get'
import { packageName, namespace } from '../constants'

const _ = {
  get,
}

const dataArray = _.get(window, [namespace, packageName])

if (Array.isArray(dataArray) && dataArray.length > 0) {
  // get first data from array and pop it out
  const config = dataArray.shift()
  const { uuid, data, lazyload } = config

  ReactDOM.render(
    <ScrollHorizontal imgSrc={data} lazyload={lazyload} />,
    document.getElementById(uuid)
  )
}
