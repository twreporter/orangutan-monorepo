import buildConst from './constants'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
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

function getBodyWidth() {
  if (document.body) {
    const bodyWidth =
      document.body.getBoundingClientRect().width || document.body.offsetWidth
    return bodyWidth || 0
  }
  return 0
}

function useBodyWidth() {
  const [bodyWidth, setBodyWidth] = useState(getBodyWidth)
  const handleResize = _.debounce(() => {
    setBodyWidth(getBodyWidth())
  }, 400)
  useEffect(() => {
    if (window && typeof window.addEventListener === 'function') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])
  return bodyWidth
}

/**
 *
 *
 * @param {HTMLElement} element
 * @returns {number}
 */
function getXOffset(element) {
  if (element) {
    return element.offsetLeft || 0
  }
  return 0
}

/**
 *
 *
 * @param {import('react').MutableRefObject} elementRef
 * @returns
 */
function useXOffset(elementRef) {
  const [xOffset, setXPosition] = useState(getXOffset(elementRef.current))
  const handleResize = _.debounce(() => {
    setXPosition(getXOffset(elementRef.current))
  }, 400)
  useEffect(() => {
    if (window && typeof window.addEventListener === 'function') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])
  return xOffset
}

function FullWidthWrapper(props) {
  const { full, children } = props
  if (!full) {
    return children
  }
  const defaultWidth = '95vw'
  const defaultXOffset = 0
  const bodyWidth = useBodyWidth()
  const wrapper = useRef()
  const xOffset = useXOffset(wrapper)
  return (
    <div
      ref={wrapper}
      style={{
        width: bodyWidth ? `${bodyWidth}px` : defaultWidth,
        position: 'relative',
        left: xOffset ? `${xOffset * -1}px` : defaultXOffset,
      }}
    >
      {children}
    </div>
  )
}

FullWidthWrapper.propTypes = {
  full: PropTypes.bool,
  children: PropTypes.node,
}

FullWidthWrapper.defaultProps = {
  full: true,
}

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
