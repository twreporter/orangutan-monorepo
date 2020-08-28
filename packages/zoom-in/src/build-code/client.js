import React from 'react'
import ReactDOM from 'react-dom'
import ZoomableImage from '../components/zoomable-image'
import get from 'lodash/get'
import { packageName, namespace } from '../constants'

const _ = {
  get,
}

const dataArray = _.get(window, [namespace, packageName])

if (Array.isArray(dataArray) && dataArray.length > 0) {
  // get first data from array and pop it out
  const config = dataArray.shift()
  const { uuid, data } = config
  const { src, alt, caption, theme } = data

  ReactDOM.render(
    <ZoomableImage src={src} alt={alt} caption={caption} theme={theme} />,
    document.getElementById(uuid)
  )
}
