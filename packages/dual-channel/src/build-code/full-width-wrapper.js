import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
// lodash
import debounce from 'lodash/debounce'

const _ = {
  debounce,
}

function getViewportWidth() {
  if (document && document.documentElement) {
    return document.documentElement.clientWidth || 0
  }
  return 0
}

function useViewportWidth() {
  const [viewportWidth, setViewportWidth] = useState(getViewportWidth)
  const handleResize = _.debounce(() => {
    setViewportWidth(getViewportWidth())
  }, 400)
  useEffect(() => {
    if (window && typeof window.addEventListener === 'function') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])
  return viewportWidth
}

/**
 * get the offset of the element
 *
 * @param {HTMLElement} element
 * @returns {number}
 */
function getXRelatedToViewport(element) {
  if (element) {
    return element.getBoundingClientRect().left || 0
  }
  return 0
}

/**
 *
 *
 * @param {import('react').MutableRefObject} elementRef
 * @returns
 */
function useXRelatedToViewport(elementRef) {
  const elem = elementRef.current || null
  const [xRelatedToViewport, setXPosition] = useState(
    getXRelatedToViewport(elem)
  )
  const handleResize = _.debounce(() => {
    setXPosition(getXRelatedToViewport(elem && elem.parentNode))
  }, 400)
  useEffect(() => {
    if (window && typeof window.addEventListener === 'function') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])
  return xRelatedToViewport
}

export default function FullWidthWrapper(props) {
  const { full, children } = props
  if (!full) {
    return children
  }
  const defaultWidth = '95vw'
  const defaultXOffset = 0
  const viewportWidth = useViewportWidth()
  const wrapper = useRef()
  const xRelatedToViewport = useXRelatedToViewport(wrapper)
  return (
    <div
      ref={wrapper}
      style={{
        width: viewportWidth ? `${viewportWidth}px` : defaultWidth,
        position: 'relative',
        left: xRelatedToViewport
          ? `${xRelatedToViewport * -1}px`
          : defaultXOffset,
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
