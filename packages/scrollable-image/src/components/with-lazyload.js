import LazyLoad from 'react-lazyload'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const Placeholder = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background: transparent;
`

const withLazyload = WrappedComponent => {
  class WithLazyload extends React.PureComponent {
    static propTypes = {
      lazyload: PropTypes.bool,
    }

    static defaultProps = {
      lazyload: false,
    }

    constructor(props) {
      super(props)
      this.offset = 3000
    }

    componentDidMount() {
      this.offset = window.innerHeight * 3
      this.forceUpdate()
    }

    componentWillUnmount() {
      this.offset = null
    }

    render() {
      const { lazyload } = this.props
      return lazyload ? (
        <LazyLoad
          offset={this.offset}
          placeholder={<Placeholder />}
          once
          resize
        >
          <WrappedComponent {...this.props} />
        </LazyLoad>
      ) : (
        <WrappedComponent {...this.props} />
      )
    }
  }

  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  WithLazyload.displayName = `withLazyload(${wrappedComponentName})`

  return WithLazyload
}

export default withLazyload
