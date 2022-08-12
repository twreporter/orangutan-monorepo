import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const Placeholder = styled.div`
  width: 100vw;
  height: ${props => (props.pixel100vh ? props.pixel100vh + 'px' : '100vh')};
`

const Container = styled.div`
  display: inline-block;
  img {
    width: auto;
    height: ${props => (props.pixel100vh ? props.pixel100vh + 'px' : '100vh')};
  }
`

class Image extends React.PureComponent {
  static propTypes = {
    src: PropTypes.string.isRequired,
    onLoad: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    pixel100vh: PropTypes.number,
  }

  static defaultProps = {
    pixel100vh: 0,
  }

  constructor(props) {
    super(props)
    this.state = {
      readyToLoad: false,
    }
    this.handleLoad = this._handleLoad.bind(this)
    this.setReady = this._setReady.bind(this)
  }

  componentDidMount() {
    this.isWindowLoad(this.setReady)
  }

  componentWillUnMount() {
    window.removeEventListener('load', this.setReady)
  }

  isWindowLoad(callback) {
    if (document.readyState === 'complete') {
      callback()
    } else {
      window.addEventListener('load', callback)
    }
  }

  _setReady() {
    this.setState({
      readyToLoad: true,
    })
  }

  _handleLoad(e) {
    this.props.onLoad(e)
  }

  render() {
    const { readyToLoad } = this.state
    const { src, onError, pixel100vh } = this.props
    return (
      <Container pixel100vh={pixel100vh}>
        {readyToLoad ? (
          <img src={src} onLoad={this.handleLoad} onError={onError} />
        ) : (
          <Placeholder pixel100vh={pixel100vh} />
        )}
      </Container>
    )
  }
}

export default Image
