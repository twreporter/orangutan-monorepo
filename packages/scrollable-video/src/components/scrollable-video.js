import {
  getViewportWidth,
  getElementHeight,
  getXRelativeToDocument,
} from '../utils/measurement'
import Captions from './captions'
import Dimmer from './dimmer-with-message'
import PropTypes from 'prop-types'
import React, {
  useReducer,
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react'
import styled, { ThemeProvider } from 'styled-components'
import useScrollTrigger from '../hooks/use-scroll-trigger'
import Video from './video'
// lodash
import merge from 'lodash/merge'
import debounce from 'lodash/debounce'

const defaultViewportHeight = '100vh'

const defaultTheme = {
  mq: {
    mobileMaxWidth: '767px',
  },
  captions: {
    color: '#404040',
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontFamily:
      '"source-han-sans-traditional", "Noto Sans TC", "PingFang TC", "Apple LiGothic Medium", Roboto, "Microsoft JhengHei", sans-serif',
    fontSize: '24px',
    mobileFontSize: '22px',
    link: {
      color: '#a67a44',
      underlineColor: '#a67a44',
    },
    box: {
      width: '450px',
      mobileWidth: '77%',
      spanPadding: '6px 15px',
      mobilePadding: '12px 12px 14px 18px',
      background: '#fff',
    },
    lineHeight: '1.7',
    mobileLineHeight: '1.7',
  },
}

const defaultSectionWidth = 'calc(100vw - 17px)' // minus scrollbar width (12~17px in major OSs)

const Section = styled.section`
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  position: relative;
  height: ${props =>
    props.isVideoError || props.isVideoLoading
      ? '100vh'
      : Math.round((props.videoDuration / props.secondsPer100vh) * 100) + 100 ||
        100}vh;
  width: ${props =>
    props.viewportWidth ? `${props.viewportWidth}px` : defaultSectionWidth};
  max-width: 100vw;
  left: ${props => (props.translateX ? `${-1 * props.translateX}px` : 0)};
`

const CaptionsSizer = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`

const VideoSizer = styled.div`
  width: 100%;
  height: ${defaultViewportHeight};
  position: sticky;
  top: 0;
  left: 0;
`

const Box100vh = styled.div`
  width: 0;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  opacity: 0;
`

const PositionStarter = styled.div`
  width: 0;
  height: 0;
  opacity: 0;
`

const PlaceHolder = styled.div`
  width: 100%;
  height: 80vh;
  position: relative;
`

const Padding = styled.div`
  height: 100vh;
`

// Note:
// Returning the previous state directly can be used to prevent infinite re-rendering.
// Using reducer is better than conditional setState because we won't need to check each hook's dependencies.
// Ref: https://en.reactjs.org/docs/hooks-reference.html#bailing-out-of-a-dispatch
// > If you return the same value from a Reducer Hook as the current state,
// > React will bail out without rendering the children or firing effects.
// > (React uses the Object.is comparison algorithm.)
function syncDOMValueReducer(state, action) {
  if (!action) return state
  if (action.length) {
    const actions = action
    const nextState = { ...state }
    let shouldUpdateState = false
    actions.forEach(({ key, value }) => {
      if (state[key] !== value) {
        nextState[key] = value
        shouldUpdateState = true
      }
    })
    return shouldUpdateState ? nextState : state
  }
  const { key, value } = action
  if (key && state[key] !== value) {
    return {
      ...state,
      [key]: value,
    }
  }
  return state
}

export default function ScrollableVideo({
  captions,
  captionsSetting,
  forcedPreloadVideo,
  gsapVersion,
  pollingTimeout,
  scrollTriggerVersion,
  secondsPer100vh,
  theme,
  video,
  skipLoadLocationRegExp,
  preloadCacheType,
}) {
  const { sources } = video
  const [skipLoad, setSkipLoad] = useState(false)
  const [videoDuration, setVideoDuration] = useState(0)
  const [isVideoLoading, setVideoLoading] = useState(true)
  const [isVideoError, setVideoError] = useState(false)
  const [isScrollTriggerError, setScrollTriggerError] = useState(false)
  const isScrollableVideoReady =
    !isVideoLoading && !isVideoError && !isScrollTriggerError
  const [domValues, dispatchSyncDOMValue] = useReducer(syncDOMValueReducer, {
    sectionHeight: 0,
    viewportWidth: 0,
    xRelativeToDocument: 0,
    pixel100vh: 0,
    viewportHeight: 0,
  })
  const {
    sectionHeight,
    viewportWidth,
    xRelativeToDocument,
    pixel100vh,
    // viewportHeight
  } = domValues

  // WARNING:
  // Mutating the ref.current will not trigger any re-rendering
  const [videoEle, setVideoEle] = useState(null)
  const [videoSizerEle, setVideoSizerEle] = useState(null)
  const [sectionEle, setSectionEle] = useState(null)
  const box100vhRef = useRef(null)
  const positionStarterRef = useRef(null)
  const latestScrollTriggerRef = useScrollTrigger({
    videoEle,
    videoSizerEle,
    sectionEle,
    duration: videoDuration,
    gsapVersion,
    scrollTriggerVersion,
    pollingTimeout,
    onCreatingScrollTriggerError: () => {
      setScrollTriggerError(true)
    },
  })

  const syncDOMValues = useCallback(() => {
    dispatchSyncDOMValue([
      {
        key: 'viewportWidth',
        value: getViewportWidth(),
      },
      {
        key: 'sectionHeight',
        value: getElementHeight(sectionEle),
      },
      {
        key: 'pixel100vh',
        value: getElementHeight(box100vhRef.current),
      },
      {
        // If there's any distance between the left edge of page and the left edge of section, remove the distance.
        key: 'xRelativeToDocument',
        value: getXRelativeToDocument(positionStarterRef.current),
      },
    ])
  }, [sectionEle])

  // Do NOT load the video if `window.location.href` matches `skipLoadLocationRegExp`
  useEffect(() => {
    if (skipLoadLocationRegExp && typeof window !== 'undefined') {
      const reg = new RegExp(skipLoadLocationRegExp)
      setSkipLoad(reg.test(window.location.href))
    }
  }, [skipLoadLocationRegExp])

  // Run syncDOMValues and attach it to resize event listener
  useEffect(() => {
    if (typeof window !== 'undefined' && !skipLoad) {
      syncDOMValues()
      const handleResize = debounce(syncDOMValues, 300)
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [skipLoad, syncDOMValues])

  useLayoutEffect(() => {
    if (latestScrollTriggerRef.current) {
      latestScrollTriggerRef.current.refresh()
    }
  })

  if (skipLoad) {
    return (
      <PlaceHolder>
        <Dimmer
          show
          message={
            '捲動式影片元件（編輯模式，不載入影片）：「' +
            (captions[0] && captions[0].text.slice(0, 49)) +
            '……」'
          }
        />
      </PlaceHolder>
    )
  }

  return (
    <>
      <PositionStarter ref={positionStarterRef} />
      <Box100vh ref={box100vhRef} />
      <Section
        ref={setSectionEle}
        secondsPer100vh={secondsPer100vh}
        videoDuration={videoDuration}
        viewportWidth={viewportWidth}
        translateX={xRelativeToDocument}
        isVideoLoading={isVideoLoading}
        isVideoError={isVideoError}
      >
        <ThemeProvider theme={merge({}, defaultTheme, theme)}>
          <VideoSizer ref={setVideoSizerEle}>
            <Video
              ref={setVideoEle}
              sources={sources}
              viewportWidth={viewportWidth}
              setVideoDuration={setVideoDuration}
              setVideoLoading={setVideoLoading}
              setVideoError={setVideoError}
              forcedPreloadVideo={forcedPreloadVideo}
              preloadCacheType={preloadCacheType}
            />
          </VideoSizer>
          <CaptionsSizer>
            <Captions
              show={!isVideoLoading}
              captions={captions}
              captionsSetting={captionsSetting}
              duration={videoDuration}
              sectionHeight={videoDuration ? sectionHeight : pixel100vh}
              pixel100vh={pixel100vh}
              secondsPer100vh={secondsPer100vh}
            />
          </CaptionsSizer>
          <Dimmer show={isVideoLoading} message="捲動式影片載入中" shining />
          <Dimmer
            show={isVideoError}
            message={
              '捲動式影片影片載入失敗。請檢查您的網路連線，並重新整理瀏覽器。若您的瀏覽器不支援捲動式影片，請使用較新版 Firefox、Chrome、Safari、或 Edge 瀏覽器觀看。'
            }
          />
          <Dimmer
            show={isScrollTriggerError}
            message={
              '您的瀏覽器不支援捲動式影片，請使用較新版 Firefox、Chrome、Safari、或 Edge 瀏覽器觀看。'
            }
          />
        </ThemeProvider>
      </Section>
      {isScrollableVideoReady ? <Padding /> : null}
    </>
  )
}

ScrollableVideo.propTypes = {
  captions: Captions.propTypes.captions,
  captionsSetting: Captions.propTypes.captionsSetting,
  forcedPreloadVideo: PropTypes.bool,
  pollingTimeout: PropTypes.number,
  gsapVersion: PropTypes.string,
  scrollTriggerVersion: PropTypes.string,
  theme: PropTypes.object,
  secondsPer100vh: PropTypes.number,
  video: PropTypes.shape({
    sources: Video.propTypes.sources,
  }),
  skipLoadLocationRegExp: PropTypes.string,
  preloadCacheType: Video.propTypes.preloadCacheType,
}

ScrollableVideo.defaultProps = {
  captions: Captions.defaultProps.captions,
  captionsSetting: Captions.defaultProps.captionsSetting,
  forcedPreloadVideo: true,
  pollingTimeout: 700,
  gsapVersion: '3.5.1',
  scrollTriggerVersion: '3.5.1',
  theme: {},
  secondsPer100vh: 1,
  video: {
    sources: Video.defaultProps.sources,
  },
  skipLoadLocationRegExp: '',
  preloadCacheType: Video.defaultProps.preloadCacheType,
}
