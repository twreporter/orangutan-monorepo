import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback } from 'react'
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

/**
 * get the distance from the element to viewport
 *
 * @param {HTMLElement} element
 * @returns {number}
 */
function getXRelatedToViewport(element) {
  if (element) {
    const parent = element.parentElement
    if (!parent) {
      return element.getBoundingClientRect().left || 0
    }
    const parentComputedStyle = window.getComputedStyle(parent)
    const parentPaddingLeft =
      parseFloat(parentComputedStyle.getPropertyValue('padding-left')) || 0
    const parentBorderLeft =
      parseFloat(parentComputedStyle.getPropertyValue('border-left')) || 0
    return (
      parent.getBoundingClientRect().left +
        parentPaddingLeft +
        parentBorderLeft || 0
    )
  }
  return 0
}

const defaultWidth = '95vw'
const defaultXRelatedToViewport = 0

export default function FullWidthWrapper(props) {
  const { isFullWidth, children } = props

  if (!isFullWidth) {
    return children
  }

  const [xRelatedToViewport, setXRelatedToViewport] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(getViewportWidth)

  const wrapperRef = useCallback(node => {
    const viewportWidth = getViewportWidth()
    const xRelatedToViewport = getXRelatedToViewport(node)
    setViewportWidth(viewportWidth)
    setXRelatedToViewport(xRelatedToViewport)
    wrapperRef.current = node
  }, [])

  const handleResize = _.debounce(() => {
    const viewportWidth = getViewportWidth()
    const xRelatedToViewport = getXRelatedToViewport(wrapperRef.current)
    setViewportWidth(viewportWidth)
    setXRelatedToViewport(xRelatedToViewport)
  }, 350)

  useEffect(() => {
    if (window && typeof window.addEventListener === 'function') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      style={{
        width: viewportWidth ? `${viewportWidth}px` : defaultWidth,
        position: 'relative',
        left: xRelatedToViewport
          ? `${xRelatedToViewport * -1}px`
          : defaultXRelatedToViewport,
      }}
    >
      {children}
    </div>
  )
}

FullWidthWrapper.propTypes = {
  isFullWidth: PropTypes.bool,
  children: PropTypes.node,
}

FullWidthWrapper.defaultProps = {
  isFullWidth: true,
  children: null,
}
