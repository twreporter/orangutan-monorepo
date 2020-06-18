/* global ScrollTrigger, gsap */
import { useEffect, useRef } from 'react'
import useCDN from './use-cdn'

/*
 * @returns {string} current `window.location.href` without hash
 */
function getHrefWithoutHash() {
  return window.location.href.replace(window.location.hash, '')
}

/**
 *
 *
 * @param {number} [timeout=700] polling timeout (ms)
 */
function startPollingDocumentHeight(timeout = 700) {
  // Start polling only on client side
  if (typeof window === 'undefined') return
  // Run only single polling at one page
  if (window._isScrollableVideoPollingActive) return
  // Only start polling when timeout is set
  if (!timeout) return
  // Use closures to save data
  let lastHeight
  let timer
  const startPollingLocation = getHrefWithoutHash()
  const check = () => {
    // Stop polling if:
    // 1. No ScrollTrigger in this page
    // 2. No ScrollTrigger instances in this page
    if (
      typeof ScrollTrigger === 'undefined' ||
      !ScrollTrigger.getAll().length
    ) {
      window._isScrollableVideoPollingActive = false
      return
    }
    // 3. The location has been changed from where it start polling
    if (startPollingLocation !== getHrefWithoutHash()) {
      // kill all ScrollTrigger instances
      try {
        ScrollTrigger.getAll().forEach(instance => instance.kill())
      } catch (error) {
        console.error('failed to kill ScrollTrigger instances:', error)
      }
      window._isScrollableVideoPollingActive = false
      return
    }

    // Refresh all ScrollTrigger instances if body height changed
    const currentHeight = document.body.clientHeight
    if (currentHeight !== lastHeight) {
      lastHeight = currentHeight
      ScrollTrigger.refresh()
    }

    // Set next polling action
    window._isScrollableVideoPollingActive = true
    if (timer) {
      window.clearTimeout(timer)
    }
    timer = window.setTimeout(check, timeout)
  }
  check()
}

export default function useScrollTrigger({
  duration,
  gsapVersion,
  pollingTimeout,
  scrollTriggerVersion,
  sectionEle,
  videoEle,
  videoSizerEle,
  onCreatingScrollTriggerError,
}) {
  const gsapCDNSrc = `https://cdnjs.cloudflare.com/ajax/libs/gsap/${gsapVersion}/gsap.min.js`
  const scrollTriggerCDNSrc = `https://cdnjs.cloudflare.com/ajax/libs/gsap/${scrollTriggerVersion}/ScrollTrigger.min.js`
  const isGsapLoaded = useCDN(gsapCDNSrc, () => typeof gsap !== 'undefined')
  const isScrollTriggerLoaded = useCDN(
    scrollTriggerCDNSrc,
    () => typeof ScrollTrigger !== 'undefined'
  )
  const latestScrollTriggerRef = useRef(null)
  useEffect(() => {
    if (
      isGsapLoaded &&
      isScrollTriggerLoaded &&
      videoEle &&
      videoSizerEle &&
      sectionEle &&
      duration
    ) {
      let scrollProgress
      let playing = false
      const start = 0
      const end = duration - 0.05 // -0.05 to prevent playing last frame, which may cause video stop and be blank
      const syncVideoWithScroll = () => {
        if (playing && !videoEle.seeking) {
          const time = (scrollProgress * duration).toFixed(2)
          const targetTime = time > end ? end : time
          if (targetTime !== videoEle.currentTime) {
            videoEle.currentTime = targetTime
          }
        }
        window.requestAnimationFrame(syncVideoWithScroll)
      }
      const scrollTriggerOptions = {
        trigger: sectionEle,
        start: 'top top',
        end: 'bottom top',
        pin: videoSizerEle,
        onEnter: () => {
          playing = true
          window.requestAnimationFrame(syncVideoWithScroll)
        },
        onEnterBack: () => {
          playing = true
          window.requestAnimationFrame(syncVideoWithScroll)
        },
        onLeave: () => {
          playing = false
          if (videoEle.currentTime !== end) {
            videoEle.currentTime = end
          }
        },
        onLeaveBack: () => {
          playing = false
          if (videoEle.currentTime !== start) {
            videoEle.currentTime = start
          }
        },
        onUpdate: ({ progress }) => {
          scrollProgress = progress
        },
      }
      let scrollTriggerInstance
      try {
        gsap.registerPlugin(ScrollTrigger)
        scrollTriggerInstance = ScrollTrigger.create(scrollTriggerOptions)
        latestScrollTriggerRef.current = scrollTriggerInstance
      } catch (error) {
        console.error('creating ScrollTrigger error:', error)
        onCreatingScrollTriggerError(error)
      }
      startPollingDocumentHeight(pollingTimeout)
      return () => {
        if (scrollTriggerInstance) {
          scrollTriggerInstance.kill()
        }
      }
    }
  }, [
    duration,
    isGsapLoaded,
    isScrollTriggerLoaded,
    pollingTimeout,
    sectionEle,
    videoEle,
    videoSizerEle,
    onCreatingScrollTriggerError,
  ])
  return latestScrollTriggerRef
}
