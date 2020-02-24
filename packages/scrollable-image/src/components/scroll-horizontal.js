import PropTypes from 'prop-types'
import React from 'react'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import styled from 'styled-components'
import withWaypoints from './with-waypoints'
import LazyImage from './lazy-image'

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
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
`

// Generate a 5 charactor random string for key as prefix
// in case of having multiple components in single page
const randStr = Math.random()
  .toString(36)
  .substr(2, 5)

class ScrollHorizontal extends React.PureComponent {
  static propTypes = {
    isActive: PropTypes.bool,
    verticalDirection: PropTypes.string,
    imgSrc: PropTypes.arrayOf(PropTypes.string).isRequired,
    debug: PropTypes.bool,
  }

  static defaultProps = {
    isActive: true,
    verticalDirection: null,
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
    this.handleResize = this._handleResize.bind(this)
    this.handleImgLoad = this._handleImgLoad.bind(this)
    this.handleImgError = this._handleImgError.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', _.debounce(this.handleResize, 100))
    this.lastWindowHeight = window.innerHeight
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', _.debounce(this.handleResize, 100))
    this.distanceFromTop = null
    this.contentWidth = null
    this.isDistanceFromTopSet = null
    this.lastWindowHeight = null
  }

  _handleScroll(event) {
    const { isActive } = this.props
    // Reset the distance of content from top since the wrapper's height has been
    // set in image onLoad handler
    if (!this.isDistanceFromTopSet) {
      this.distanceFromTop =
        window.pageYOffset + this.wrapper.current.getBoundingClientRect().top
      this.isDistanceFromTopSet = true
    }

    if (isActive) {
      const percentage = Math.min(
        (window.pageYOffset - this.distanceFromTop) /
          (this.contentWidth - window.innerHeight),
        1
      )
      // shift by scrolling progress in percentage
      this.content.current.style.transform = `translate(-${percentage *
        (this.contentWidth - window.innerWidth)}px, 0)`
    }
  }

  _handleResize() {
    // Since the resizing behavior of the URL bar on iOS makes `window.innerHeight` change and
    // the wrapper’s height changes as well when the resize event is triggered.
    // The frequently changed height causes page jarring everytime when user changes scroll direction.
    // Therefore, only call `setLayout` function when the changed height is larger than url bar’s height.
    const ignoredRange = 90
    if (Math.abs(window.innerHeight - this.lastWindowHeight) > ignoredRange) {
      if (this.isDistanceFromTopSet) {
        this.isDistanceFromTopSet = false
      }
      this.contentWidth =
        this.contentWidth * (window.innerHeight / this.lastWindowHeight)
      this.wrapper.current.style.width = `${this.contentWidth}px`
      this.wrapper.current.style.height = `${this.contentWidth}px`
      this.content.current.style.width = `${this.contentWidth}px`
      this.lastWindowHeight = window.innerHeight
    }
  }

  _handleImgLoad({ target: img }) {
    this.contentWidth =
      this.contentWidth +
      img.clientHeight * (img.naturalWidth / img.naturalHeight)
    this.wrapper.current.style.height = `${this.contentWidth}px`
    this.content.current.style.width = `${this.contentWidth}px`
    this.isDistanceFromTopSet = false
  }

  _handleImgError({ target: img }) {
    // eslint-disable-next-line no-console
    console.error('Error in loading image:', img.src)
  }

  renderContent() {
    const { imgSrc } = this.props
    return (
      <Content>
        {imgSrc.map((src, index) => {
          return (
            <LazyImage
              key={`${randStr}-${index}`}
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
    return (
      <Container>
        <Wrapper ref={this.wrapper}>
          <ScrollableComponent
            ref={this.content}
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

export default withWaypoints(ScrollHorizontal)
