import mq from '../../utils/media-query'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '../../constants/theme'

const mockup = {
  containerWidth: 288,
  padding: {
    left: 58,
    top: 60,
    right: 17,
    bottom: 60,
  },
}

const Edge = styled.div`
  position: fixed;
  height: 100vh;
  z-index: ${styles.zIndex.hoverDetector};
  top: 0;
  right: 0;
  display: block;
  ${mq.mobileBelow`
    display: none;
  `}
  ${mq.tabletOnly`
    width: 40px;
  `}
  ${mq.desktopOnly`
    width: 70px;
  `}
  ${mq.hdAbove`
    width: 120px;
  `}
`

const List = styled.div`
  font-size: 14px;
  max-width: ${mockup.containerWidth}px;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: ${styles.zIndex.toc};
  background-image: linear-gradient(
    to right,
    rgba(253, 253, 253, 0),
    ${styles.colors.background}
      ${((mockup.padding.left - 20) / mockup.containerWidth) * 100}%
  );
  padding: ${mockup.padding.top}px ${mockup.padding.right}px
    ${mockup.padding.bottom}px ${mockup.padding.left}px;
  transform: translateX(${props => (props.isOpened ? '0' : '100%')});
  opacity: ${props => (props.isOpened ? '1' : '0')};
  transition: transform 500ms ease, opacity 500ms ease;
  overflow-x: hidden;
  overflow-y: auto;
`

class Sidebar extends Component {
  static propTypes = {
    show: PropTypes.bool,
    children: PropTypes.node,
  }
  static defaultProps = {
    show: false,
    children: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      mouseOnEdge: false,
      mouseOnList: false,
    }
    this.handleMouseEnterEdge = this.handleMouseWithEdge.bind(this, true)
    this.handleMouseLeaveEdge = this.handleMouseWithEdge.bind(this, false)
    this.handleMouseEnterList = this.handleMouseWithList.bind(this, true)
    this.handleMouseLeaveList = this.handleMouseWithList.bind(this, false)
  }

  shouldComponentUpdate() {
    return typeof window === 'undefined' || window.innerWidth > 1024
  }

  handleMouseWithEdge(value) {
    this.setState({
      mouseOnEdge: value,
    })
  }

  handleMouseWithList(value) {
    this.setState({
      mouseOnList: value,
    })
  }

  render() {
    const { mouseOnEdge, mouseOnList } = this.state
    const { show } = this.props
    const isOpened = show && (mouseOnEdge || mouseOnList)
    return (
      <React.Fragment>
        <List
          isOpened={isOpened}
          onMouseEnter={this.handleMouseEnterList}
          onMouseLeave={this.handleMouseLeaveList}
        >
          {this.props.children}
        </List>
        <Edge
          onMouseEnter={this.handleMouseEnterEdge}
          onMouseLeave={this.handleMouseLeaveEdge}
        />
      </React.Fragment>
    )
  }
}

export default Sidebar
