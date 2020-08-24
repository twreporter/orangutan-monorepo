import { useEffect } from 'react'

/**
 * This custom React hook takes care of setting up the event listener
 * on a component mount and removing the listener on component unmount.
 *
 * @param {HTMLElement | Object} target
 * @param {string} type - event type
 * @param {Function} listener
 * @param {Object} option
 */
const useEventListener = (target, type, listener, ...options) => {
  useEffect(() => {
    const targetIsRef = target.hasOwnProperty('current')
    const currentTarget = targetIsRef ? target.current : target
    if (currentTarget) {
      currentTarget.addEventListener(type, listener, ...options)
    }
    return () => {
      if (currentTarget) {
        currentTarget.removeEventListener(type, listener, ...options)
      }
    }
  }, [target, type, listener, options])
}

export default useEventListener
