import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const Placeholder = styled.div`
  width: 100vw;
  height: 100vh;
`

const Container = styled.div`
  display: inline-block;
  img {
    width: auto;
    height: 100vh;
  }
`

class LazyImage extends React.PureComponent {
  static propTypes = {
    src: PropTypes.string.isRequired,
    onLoad: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
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
    const { src, onError } = this.props
    return (
      <Container>
        {readyToLoad ? (
          <img src={src} onLoad={this.handleLoad} onError={onError} />
        ) : (
          <Placeholder />
        )}
      </Container>
    )
  }
}

export default LazyImage
