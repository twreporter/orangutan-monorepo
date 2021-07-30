import Dimmer from './dimmer-with-message'
import Image from './image'
import PropTypes from 'prop-types'
import React from 'react'
import childrenPositionConst from '../constants/children-position'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import styled from 'styled-components'
import withLazyload from './with-lazyload'
import withWaypoints from './with-waypoints'

const _ = {
  debounce,
  get,
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 100vh;
`

const Wrapper = styled.div`
  position: relative;
`

const ScrollableComponent = styled.div`
  position: ${props => (props.isActive ? 'fixed' : 'absolute')};
  ${props => (props.alignBottom ? 'bottom: 0' : 'top: 0')};
  width: 100%;
  height: 100vh;
  left: 0;
`

const Content = styled.div`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
`

const PlaceHolder = styled.div`
  width: 100%;
  height: 80vh;
  position: relative;
`

class ScrollHorizontal extends React.PureComponent {
  static propTypes = {
    childrenPosition: PropTypes.oneOf([
      childrenPositionConst.fixed,
      childrenPositionConst.bottom,
      childrenPositionConst.top,
    ]),
    imgSrc: PropTypes.arrayOf(PropTypes.string).isRequired,
    lazyload: PropTypes.bool,
    debug: PropTypes.bool,
    skipLoadLocationRegExp: PropTypes.string,
  }

  static defaultProps = {
    lazyload: false,
    isScrollingFromTopToBottom: false,
    skipLoadLocationRegExp: '',
  }

  constructor(props) {
    super(props)
    this.distanceFromTop = 0
    this.contentWidth = 0
    this.isDistanceFromTopSet = false
    this.scrollLock = false
    this.imgLoadedCounter = 0
    this.wrapper = React.createRef()
    this.content = React.createRef()
    this.handleScroll = this._handleScroll.bind(this)
    this.onScroll = this._onScroll.bind(this)
    this.handleResize = _.debounce(this._handleResize.bind(this), 100)
    this.handleImgLoad = this._handleImgLoad.bind(this)
    this.handleImgError = this._handleImgError.bind(this)
    this.state = {
      readyToScroll: false,
      skipLoad: false,
    }
  }

  componentDidMount() {
    this.checkToSkipLoad()
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.handleResize)
    this.distanceFromTop = undefined
    this.contentWidth = undefined
    this.isDistanceFromTopSet = undefined
    this.scrollLock = undefined
    this.imgLoadedCounter = undefined
  }

  _handleScroll(event) {
    // Reset the distance of content from top since the wrapper's height has been
    // set in image onLoad handler
    if (!this.isDistanceFromTopSet) {
      this.distanceFromTop =
        window.pageYOffset + this.wrapper.current.getBoundingClientRect().top
      this.isDistanceFromTopSet = true
    }

    const percentage = Math.max(
      0,
      Math.min(
        (window.pageYOffset - this.distanceFromTop) /
          (this.content.current.clientWidth - window.innerHeight),
        1
      )
    )
    // shift by scrolling progress in percentage
    this.content.current.style.transform = `translate(-${percentage *
      (this.content.current.clientWidth - window.innerWidth)}px, 0)`

    this.scrollLock = false
  }

  _onScroll() {
    if (window && !this.scrollLock) {
      window.requestAnimationFrame(this.handleScroll)
      this.scrollLock = true
    }
  }

  _handleResize() {
    const contentWidth = this.content.current.clientWidth
    if (this.isDistanceFromTopSet) {
      this.isDistanceFromTopSet = false
    }
    this.wrapper.current.style.width = `${contentWidth}px`
    this.wrapper.current.style.height = `${contentWidth}px`
  }

  _handleImgLoad({ target: img }) {
    const { imgSrc } = this.props

    this.isDistanceFromTopSet = false

    if (++this.imgLoadedCounter === imgSrc.length) {
      this.setState({
        readyToScroll: true,
      })

      this.wrapper.current.style.height = `${this.content.current.clientWidth}px`
    }
  }

  _handleImgError({ target: img }) {
    // eslint-disable-next-line no-console
    console.error('Error in loading image:', img.src)
  }

  renderContent() {
    const { imgSrc } = this.props
    return (
      <Content ref={this.content}>
        {imgSrc.map((src, index) => {
          return (
            <Image
              key={index}
              src={src}
              onLoad={this.handleImgLoad}
              onError={this.handleImgError}
            />
          )
        })}
      </Content>
    )
  }

  checkToSkipLoad() {
    const { skipLoadLocationRegExp } = this.props
    if (skipLoadLocationRegExp && typeof window !== 'undefined') {
      const reg = new RegExp(skipLoadLocationRegExp)
      this.setState({
        skipLoad: reg.test(window.location.href),
      })
    }
  }

  render() {
    const { childrenPosition } = this.props
    const { readyToScroll, skipLoad } = this.state

    if (skipLoad) {
      return (
        <PlaceHolder>
          <Dimmer show message={'「橫著滾吧！照片」（編輯模式，不載入元件）'} />
        </PlaceHolder>
      )
    }

    return (
      <Container>
        <Wrapper ref={this.wrapper}>
          <ScrollableComponent
            isActive={childrenPosition === childrenPositionConst.fixed}
            alignBottom={childrenPosition === childrenPositionConst.bottom}
          >
            {this.renderContent()}
          </ScrollableComponent>
        </Wrapper>
        {!readyToScroll ? <Dimmer show message="載入中..." shining /> : null}
      </Container>
    )
  }
}

export default withLazyload(withWaypoints(ScrollHorizontal))
