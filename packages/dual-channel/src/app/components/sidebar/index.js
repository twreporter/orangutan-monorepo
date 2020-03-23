import * as predefinedPropTypes from '../../constants/prop-types'
import DesktopSidebar from './desktop'
import MobileSidebar from './mobile'
import map from 'lodash/map'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import smoothscroll from 'smoothscroll'
import styled from 'styled-components'
import styles from '../../constants/theme'
import { Waypoint } from 'react-waypoint'
import { connect } from 'react-redux'

const _ = {
  map,
}

const Item = styled.div`
  cursor: pointer;
  color: ${props =>
    props.isFocused ? styles.colors.tocItemFocused : styles.colors.tocItem};
  margin-bottom: 10px;
  min-width: 80px;
  &::before {
    content: '';
    display: block;
    width: ${props => (props.isFocused ? '12px' : '5px')};
    height: 2px;
    transition: width 200ms ease, background-color 200ms ease;
    background-color: ${props =>
      props.isFocused ? styles.colors.tocItemFocused : styles.colors.tocItem};
    position: absolute;
    transform: translate(calc(-100% - 5px), 0.7em);
  }
`

class Sidebar extends PureComponent {
  static propTypes = {
    anchors: PropTypes.arrayOf(predefinedPropTypes.anchor).isRequired,
    // redux props
    currentAnchor: PropTypes.number.isRequired,
    sectionsPositionRelativeToViewport: PropTypes.string.isRequired,
  }

  _handleItemClicked(id) {
    if (typeof document !== 'undefined') {
      const targetElement = document.getElementById(id)
      if (targetElement) {
        if (window.innerWidth < 1024) {
          const target =
            targetElement.getBoundingClientRect().top + window.pageYOffset - 260
          smoothscroll(target)
        } else {
          smoothscroll(targetElement)
        }
      }
    }
  }

  _buildListItem = (anchor, i) => {
    const { id, label } = anchor
    // If no `id` is given, the chapter will not appear at the list
    if (!id) return null
    return (
      <Item
        key={id}
        isFocused={i === this.props.currentAnchor}
        onClick={this._handleItemClicked.bind(this, id)}
      >
        {label}
      </Item>
    )
  }

  render() {
    const { anchors, sectionsPositionRelativeToViewport } = this.props
    const listItems = _.map(anchors, this._buildListItem)
    const show = sectionsPositionRelativeToViewport === Waypoint.inside
    return (
      <React.Fragment>
        <DesktopSidebar show={show}>{listItems}</DesktopSidebar>
        <MobileSidebar show={show}>{listItems}</MobileSidebar>
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ position, sectionsPositionRelativeToViewport }) => ({
  currentAnchor: position.currentChapter,
  sectionsPositionRelativeToViewport,
})

export default connect(mapStateToProps)(Sidebar)
