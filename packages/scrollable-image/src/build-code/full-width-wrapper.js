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

const defaultWidth = 'calc(100vw-17px)' // minus scrollbar width (12~17px in major OSs)
const defaultXRelatedToViewport = 0

export default function FullWidthWrapper(props) {
  const { children } = props

  const [xRelatedToViewport, setXRelatedToViewport] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(getViewportWidth)

  const wrapperRef = useCallback(node => {
    if (node) {
      const viewportWidth = getViewportWidth()
      const xRelatedToViewport = getXRelatedToViewport(node)
      setViewportWidth(viewportWidth)
      setXRelatedToViewport(xRelatedToViewport)
      wrapperRef.current = node
    }
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResize = useCallback(
    _.debounce(() => {
      const viewportWidth = getViewportWidth()
      const xRelatedToViewport = getXRelatedToViewport(wrapperRef.current)
      setViewportWidth(viewportWidth)
      setXRelatedToViewport(xRelatedToViewport)
    }, 300),
    [wrapperRef]
  )

  useEffect(() => {
    if (window && typeof window.addEventListener === 'function') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

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
  children: PropTypes.node,
}

FullWidthWrapper.defaultProps = {
  children: null,
}
