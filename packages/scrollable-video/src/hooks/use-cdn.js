import { useState, useEffect } from 'react'

/**
 *
 *
 * @export
 * @param {string} src - the src of CDN
 * @param {Function} checkIfScriptLoad - the function to check is script is loaded
 * @returns {boolean} is the CDN loaded or not
 */
export default function useCDN(src, checkIfScriptLoad) {
  const [isLoaded, setLoaded] = useState(checkIfScriptLoad)
  useEffect(() => {
    if (!checkIfScriptLoad()) {
      const existedScriptEle = document.querySelector(`script[src="${src}"]`) // TODO: Need improvement. This may cause false negative result.
      if (existedScriptEle) {
        // Case 1: The script element exists but not has not been loaded yet
        const handleLoad = () => {
          existedScriptEle.removeEventListener('load', handleLoad)
          setLoaded(true)
        }
        existedScriptEle.addEventListener('load', handleLoad)
        return () => {
          existedScriptEle.removeEventListener('load', handleLoad)
        }
      } else {
        // Case 2: The script element does not exist
        const newScriptEle = document.createElement('script')
        newScriptEle.src = src
        const handleLoad = () => {
          newScriptEle.removeEventListener('load', handleLoad)
          setLoaded(true)
        }
        newScriptEle.addEventListener('load', handleLoad)
        try {
          document.head.appendChild(newScriptEle)
        } catch (error) {
          console.error(error)
        }
        return () => {
          newScriptEle.removeEventListener('load', handleLoad)
        }
      }
    }
  }, [checkIfScriptLoad, src])
  return isLoaded
}
