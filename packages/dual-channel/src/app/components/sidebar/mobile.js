import mq from '../../utils/media-query'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '../../constants/theme'
import Hamburger from './burger'

const mockup = {
  listWidth: 214,
  padding: {
    left: 58,
    top: 50,
    right: 24,
    bottom: 50,
  },
}

const Container = styled.div`
  display: flex;
  width: ${mockup.listWidth + 40}px;
  transform: translateX(
    ${props =>
      props.isOpened
        ? '0'
        : `${props.show ? mockup.listWidth : mockup.listWidth + 40}px`}
  );
  transition: transform 500ms ease;
  overflow-x: visible;
  overflow-y: auto;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
  z-index: ${styles.zIndex.toc};
  ${mq.desktopAbove`
    display: none;
  `}
`

const List = styled.div`
  font-size: 14px;
  user-select: none;
  width: ${mockup.listWidth}px;
  flex: 0 0 ${mockup.listWidth}px;
  z-index: ${styles.zIndex.toc};
  background: ${styles.colors.white};
  padding: ${mockup.padding.top}px ${mockup.padding.right}px
    ${mockup.padding.bottom}px ${mockup.padding.left}px;
`

class Sidebar extends Component {
  static propTypes = {
    show: PropTypes.bool,
    children: PropTypes.node,
  }
  constructor(props) {
    super(props)
    this.state = {
      isOpened: false,
    }
    this.close = this._handleToggle.bind(this, false)
    this.open = this._handleToggle.bind(this, true)
  }

  shouldComponentUpdate() {
    return typeof window === 'undefined' || window.innerWidth <= 1024
  }

  _handleToggle(value) {
    this.setState({
      isOpened: value,
    })
  }

  render() {
    const { isOpened } = this.state
    const { show } = this.props
    return (
      <Container show={show} isOpened={isOpened}>
        <Hamburger
          show={show}
          isOpened={isOpened}
          onClick={isOpened ? this.close : this.open}
        />
        <List>{this.props.children}</List>
      </Container>
    )
  }
}

export default Sidebar
