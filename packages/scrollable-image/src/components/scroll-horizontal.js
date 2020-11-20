import Image from './image'
import PropTypes from 'prop-types'
import React from 'react'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import styled from 'styled-components'
import withLazyload from './with-lazyload'
import withWaypoints from './with-waypoints'

const version = 12

const _ = {
  debounce,
  get,
}

const Container = styled.div`
  overflow: hidden;
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
  // width: 100%;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
`

const Info = styled.p`
  position: fixed;
  left: 10px;
  top: 10px;
  background: black;
  color: white;
  z-index: 100 !important;
`

let isImageLoaded = false

class ScrollHorizontal extends React.PureComponent {
  static propTypes = {
    isActive: PropTypes.bool,
    verticalDirection: PropTypes.string,
    imgSrc: PropTypes.arrayOf(PropTypes.string).isRequired,
    lazyload: PropTypes.bool,
    debug: PropTypes.bool,
  }

  static defaultProps = {
    isActive: true,
    lazyload: false,
    isScrollingFromTopToBottom: false,
  }

  constructor(props) {
    super(props)
    this.distanceFromTop = 0
    this.contentWidth = 0
    this.lastWindowHeight = 0
    this.isDistanceFromTopSet = false
    this.wrapper = React.createRef()
    this.content = React.createRef()
    this.handleScroll = this._handleScroll.bind(this)
    this.handleResize = _.debounce(this._handleResize.bind(this), 1000)
    this.handleImgLoad = this._handleImgLoad.bind(this)
    this.handleImgError = this._handleImgError.bind(this)
    this.state = {
      resized: 'false',
      diff: 0,
      lastHeight: 0,
      innerHeight: 0,
      lastWidth: 0,
      innerWidth: 0,
    }
  }

  componentDidMount() {
    this.lastWindowHeight = window.innerHeight
    this.lastWindowWidth = window.innerWidth
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleResize)
    // this.contentWidth = this.content.current.clientWidth
    // console.log('this.contentWidth:', this.contentWidth)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleResize)
    this.distanceFromTop = undefined
    this.contentWidth = undefined
    this.isDistanceFromTopSet = undefined
    this.lastWindowHeight = undefined
  }

  _handleScroll(event) {
    // Reset the distance of content from top since the wrapper's height has been
    // set in image onLoad handler
    if (!this.isDistanceFromTopSet) {
      this.distanceFromTop =
        window.pageYOffset + this.wrapper.current.getBoundingClientRect().top
      this.isDistanceFromTopSet = true
    }

    if (window.innerHeight !== this.lastWindowHeight) {
      this.handleResize()
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
  }

  _handleResize() {
    this.lastWindowHeight = window.innerHeight
    // Since the resizing behavior of the URL bar on iOS makes `window.innerHeight` change and
    // the wrapper’s height changes as well when the resize event is triggered.
    // The frequently changed height causes page jarring everytime when user changes scroll direction.
    // Therefore, only call `setLayout` function when the changed height is larger than url bar’s height.
    const ignoredRange = 90
    // if (Math.abs(window.innerHeight - this.lastWindowHeight) > ignoredRange) {
    this.setState({
      resized: 'true',
      diff: Math.abs(window.innerHeight - this.lastWindowHeight),
      innerHeight: window.innerHeight,
      lastHeight: this.lastWindowHeight,
      lastWidth: this.lastWindowWidth,
      innerWidth: window.innerWidth,
    })
    if (this.isDistanceFromTopSet) {
      this.isDistanceFromTopSet = false
    }
    /*
     this.contentWidth =
    this.content.current.clientWidth * (window.innerHeight / this.lastWindowHeight)
    */
    this.wrapper.current.style.width = `${this.content.current.clientWidth}px`
    this.wrapper.current.style.height = `${this.content.current.clientWidth}px`
    // this.content.current.style.width = `${this.contentWidth}px`
    // }
  }

  _handleImgLoad({ target: img }) {
    /*
    this.contentWidth =
      this.contentWidth +
      (img.clientHeight || img.getComputedStyle().height || 0) *
        (img.naturalWidth / img.naturalHeight)
        */
    // this.wrapper.current.style.height = `${this.contentWidth}px`
    this.wrapper.current.style.height = `${this.content.current.clientWidth}px`
    //  this.content.current.style.width = `${this.contentWidth}px`
    this.isDistanceFromTopSet = false
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

  render() {
    const { isActive, verticalDirection } = this.props
    const {
      resized,
      diff,
      innerHeight,
      lastHeight,
      innerWidth,
      lastWidth,
    } = this.state
    const clientHeight = window ? window.innerHeight : 0
    let contentWidth = 0
    if (this.content.current) {
      contentWidth = this.content.current.clientWidth
    }
    return (
      <Container>
        <Wrapper ref={this.wrapper}>
          <Info>
            version: {version}
            <br />
            clientHeight: {clientHeight}
            <br />
            contentWidth: {contentWidth}
            <br />
            resized: {resized}
            <br />
            diff: {diff}
            <br />
            innerHeight: {innerHeight}
            <br />
            lastHeight: {lastHeight}
            <br />
            innerWidth: {innerWidth}
            <br />
            lastWidth: {lastWidth}
          </Info>
          <ScrollableComponent
            isActive={isActive}
            alignBottom={verticalDirection === 'down'}
          >
            {this.renderContent()}
          </ScrollableComponent>
        </Wrapper>
      </Container>
    )
  }
}

export default withLazyload(withWaypoints(ScrollHorizontal))
