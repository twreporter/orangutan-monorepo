import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const Video = styled.video`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
  /* hide controls on iOS */
  &::-webkit-media-controls-panel,
  &::-webkit-media-controls-play-button,
  &::-webkit-media-controls-start-playback-button {
    display: none !important;
    -webkit-appearance: none !important;
  }
  transform: translate3d(0);
`

function pickSource(
  sources = [],
  viewportWidth,
  devicePixelRatio,
  isScreenPortrait
) {
  if (
    !sources ||
    !sources.length ||
    !viewportWidth ||
    devicePixelRatio === null ||
    isScreenPortrait === null
  )
    return []
  const viewportWidthInPixel = viewportWidth * devicePixelRatio
  // 優先選擇 orientation 符合的
  const filteredByOrientation = sources.filter(({ width, height }) =>
    isScreenPortrait ? width <= height : width >= height
  )
  if (filteredByOrientation.length === 1) return { ...filteredByOrientation[0] }
  // 若完全無符合的，就以全部 sources 作選擇
  const largerSources = []
  const smallerSources = []
  const sourcesToBePicked =
    filteredByOrientation.length > 0 ? filteredByOrientation : sources
  sourcesToBePicked.forEach(source => {
    if (source.width >= viewportWidthInPixel) {
      largerSources.push(source)
    } else {
      smallerSources.push(source)
    }
  })
  // 先挑大於等於裡面最小的
  if (largerSources.length === 1) return { ...largerSources[0] }
  if (largerSources.length > 1)
    return { ...largerSources.sort((a, b) => a.width - b.width)[0] } // ascend
  // 再挑小於裡面最大的
  if (smallerSources.length === 1) return { ...smallerSources[0] }
  if (smallerSources.length > 1)
    return { ...smallerSources.sort((a, b) => b.width - a.width)[0] } // descend
  // 例外
  console.error('there is a case not considered by pickSource function')
  return null
}

/**
 *
 *
 * @param {MediaQueryList} mql
 * @param {Function} listener
 */
function applyListenerToMQList(mql, listener) {
  if (typeof mql.addEventListener === 'function') {
    mql.addEventListener('change', listener)
  } else {
    mql.addListener(listener)
  }
}

/**
 *
 *
 * @param {MediaQueryList} mql
 * @param {Function} listener
 */
function removeListenerFromMQList(mql, listener) {
  if (typeof mql.addEventListener === 'function') {
    mql.removeEventListener('change', listener)
  } else {
    mql.removeListener(listener)
  }
}

const ForwardRefVideo = React.forwardRef(
  (
    {
      sources,
      viewportWidth,
      setVideoError,
      setVideoLoading,
      setVideoDuration,
      preloadCacheType,
    },
    ref
  ) => {
    const [devicePixelRatio, setDevicePixelRatio] = useState(null)
    const [isScreenPortrait, setIsScreenPortrait] = useState(null)
    const pickedSource = pickSource(
      sources,
      viewportWidth,
      devicePixelRatio,
      isScreenPortrait
    )
    const { src: pickedSourceSrc } = pickedSource
    useEffect(() => {
      if (typeof window !== 'undefined') {
        // Check device pixel ratio
        const currentDevicePixelRatio = window.devicePixelRatio
        setDevicePixelRatio(currentDevicePixelRatio)
        // Add a listener to detect device pixel ratio changes
        const DPRChecker = window.matchMedia(
          `(resolution: ${currentDevicePixelRatio || 1}dppx)`
        )
        const handleDPRChange = () => {
          setDevicePixelRatio(window.devicePixelRatio || 1)
        }
        applyListenerToMQList(DPRChecker, handleDPRChange)
        // Check screen orientation
        const orientationChecker = window.matchMedia('(orientation: portrait)')
        setIsScreenPortrait(orientationChecker.matches)
        // Add a listener to detect screen orientation changes
        const handleOrientationChange = e => {
          setIsScreenPortrait(e.matches)
          console.log(e.matches ? 'portrait' : 'landscape')
        }
        applyListenerToMQList(orientationChecker, handleOrientationChange)
        return () => {
          removeListenerFromMQList(DPRChecker, handleDPRChange)
          removeListenerFromMQList(orientationChecker, handleOrientationChange)
        }
      }
    }, [])

    // In order to play video by `play()` method, we need to follow browser video autoplay policy.
    // For autoplay policy information, see https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide.
    //
    // The video is allowed to autoplay or `play()` by JavaScript only if at least one of the following
    // is true.
    // 1. The video is muted or its volume is set to 0
    // 2. The user has interacted with the webpage (by clicking, tapping, etc.)
    //
    // Since the scrollable video is designed to be muted,
    // we set video element to `muted=true` manually to make `play()` method work well.
    //
    // The reason we don't add `muted={true}` in `<Video>` component is because
    // React does not support `muted` props yet. For related issue, see https://github.com/facebook/react/issues/10389.
    useEffect(() => {
      if (ref && ref.current && !ref.current.muted) {
        ref.current.muted = true

        const fixCornerCaseOnIOS = () => {
          // video has not been played yet
          if (!ref.current.playing) {
            // `play()` here is to clear play button when iOS is under the low battery mode.
            const playPromise = ref.current.play()
            playPromise
              .then(() => {
                // `pause()` video after `play()` successfully
                ref.current.pause()
              })
              .catch(err => {
                console.warn('Can not play video by JavaScript due to ', err)
              })
          }
          window.removeEventListener('touchstart', fixCornerCaseOnIOS)
        }
        window.addEventListener('touchstart', fixCornerCaseOnIOS)
      }
    }, [])

    return (
      <Video
        key={pickedSourceSrc}
        preload="auto"
        playsInline={true}
        onCanPlay={e => {
          setVideoLoading(false)
          setVideoError(false)
        }}
        onWaiting={e => {
          setVideoLoading(true)
        }}
        onDurationChange={e => {
          setVideoDuration(e.target.duration)
        }}
        onPlay={e => {
          e.target.pause()
        }}
        onEnded={e => {
          console.log(
            'the video should be paused before last frame and not to be ended'
          )
          e.target.pause()
        }}
        onError={e => {
          setVideoError(true)
          setVideoLoading(false)
        }}
        ref={ref}
        src={pickedSourceSrc}
      />
    )
  }
)

ForwardRefVideo.displayName = 'ForwardRef(Video)'

ForwardRefVideo.propTypes = {
  viewportWidth: PropTypes.number,
  setVideoDuration: PropTypes.func.isRequired,
  setVideoLoading: PropTypes.func.isRequired,
  setVideoError: PropTypes.func.isRequired,
  sources: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string,
      type: PropTypes.string,
      maxWidth: PropTypes.number,
    })
  ),
  forcedPreloadVideo: PropTypes.bool,
  preloadCacheType: PropTypes.oneOf([
    'default',
    'no-store',
    'reload',
    'no-cache',
    'force-cache',
  ]),
}

ForwardRefVideo.defaultProps = {
  viewportWidth: 0,
  sources: [],
  forcedPreloadVideo: true,
  preloadCacheType: 'default',
}
export default ForwardRefVideo
