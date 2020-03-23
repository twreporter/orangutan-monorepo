import { connect } from 'react-redux'
import { Waypoint } from 'react-waypoint'
import * as predefinedPropTypes from '../constants/prop-types'
import map from 'lodash/map'
import mq from '../utils/media-query'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import styles from '../constants/theme'

const _ = {
  map,
}

const mockup = {
  signWidth: {
    on: 12,
    off: 5,
  },
}

const Container = styled.div`
  position: fixed;
  right: 60px;
  ${mq.desktopOnly`
    right: 32px;
  `}
  width: ${mockup.signWidth.on}px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  ${props => (props.hide ? 'visibility: hidden;' : '')}
  ${mq.tabletBelow`
    display: none;
  `}
`

const Sign = styled.div`
  width: ${props =>
    props.highlight ? `${mockup.signWidth.on}px` : `${mockup.signWidth.off}px`};
  background-color: ${props =>
    props.highlight ? styles.colors.tocItemFocused : styles.colors.tocItem};
  transition: width 300ms ease, background-color 300ms ease;
  height: 2px;
  &:not(:last-of-type) {
    margin-bottom: 12px;
  }
`

class Indicator extends PureComponent {
  static propTypes = {
    anchors: PropTypes.arrayOf(predefinedPropTypes.anchor).isRequired,
    // redux props
    currentAnchor: PropTypes.number.isRequired,
    sectionsPositionRelativeToViewport: PropTypes.string.isRequired,
  }
  // shouldComponentUpdate() {
  //   return (typeof window === 'undefined' || window.innerWidth > 1024)
  // }
  _buildSign = (anchor, i) => (
    <Sign key={`sign-${i}`} highlight={this.props.currentAnchor === i} />
  )
  render() {
    const { anchors, sectionsPositionRelativeToViewport } = this.props
    const hide = sectionsPositionRelativeToViewport !== Waypoint.inside
    return <Container hide={hide}>{_.map(anchors, this._buildSign)}</Container>
  }
}

const mapStateToProps = ({ position, sectionsPositionRelativeToViewport }) => ({
  currentAnchor: position.currentChapter,
  sectionsPositionRelativeToViewport,
})

export default connect(mapStateToProps)(Indicator)
