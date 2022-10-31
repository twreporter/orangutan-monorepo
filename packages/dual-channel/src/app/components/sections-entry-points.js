import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { Waypoint } from 'react-waypoint'
import { connect } from 'react-redux'
import { scrollableAncestor } from '../constants/customized-props'

const EntryPoint = styled.div`
  width: 1px;
  height: 1px;
`

class _HeadEntryPoint extends React.PureComponent {
  static propTypes = {
    updateSectionsPosition: PropTypes.func.isRequired,
    bottomOffset: PropTypes.string,
    topOffset: PropTypes.string,
  }

  _handlePositionChange = waypointPositionObj => {
    const { currentPosition, previousPosition } = waypointPositionObj

    if (currentPosition === Waypoint.inside) {
      this.props.updateSectionsPosition(Waypoint.inside)
      return
    }

    // User scrolls from top to bottom
    // The top of Sections enters into Browser viewport
    if (
      currentPosition === Waypoint.above &&
      (previousPosition === Waypoint.inside ||
        previousPosition === Waypoint.below)
    ) {
      // Sections is inside the Browser viewport
      this.props.updateSectionsPosition(Waypoint.inside)
      return
    }

    // User scrolls from bottom to top
    // The top of Sections leaves Browser viewport
    if (
      (previousPosition === Waypoint.inside ||
        previousPosition === Waypoint.above) &&
      currentPosition === Waypoint.below
    ) {
      // Sections position is below the Browser viewport
      this.props.updateSectionsPosition(Waypoint.below)
    }
  }

  render() {
    return (
      <Waypoint
        scrollableAncestor={scrollableAncestor}
        topOffset={this.props.topOffset}
        bottomOffset={this.props.bottomOffset}
        onPositionChange={this._handlePositionChange}
      >
        <EntryPoint />
      </Waypoint>
    )
  }
}

class _BottomEntryPoint extends _HeadEntryPoint {
  _handlePositionChange = waypointPositionObj => {
    const { currentPosition, previousPosition } = waypointPositionObj

    if (currentPosition === Waypoint.inside) {
      this.props.updateSectionsPosition(Waypoint.inside)
      return
    }

    // User scrolls from bottom to top.
    // The bottom of Sections enters into Browser viewport
    if (
      currentPosition === Waypoint.below &&
      (previousPosition === Waypoint.inside ||
        previousPosition === Waypoint.above)
    ) {
      // Sections is inside the Browser viewport
      this.props.updateSectionsPosition(Waypoint.inside)
      return
    }

    // User scrolls from top to bottom
    // The bottom of Sections leaves Browser viewport
    if (
      currentPosition === Waypoint.above &&
      (previousPosition === Waypoint.inside ||
        previousPosition === Waypoint.below)
    ) {
      // Sections position is above the Browser viewport
      this.props.updateSectionsPosition(Waypoint.above)
    }
  }
}

const mapDispatchToProps = dispatch => ({
  updateSectionsPosition: dispatch.sectionsPositionRelativeToViewport.update,
})

export default {
  HeadEntryPoint: connect(
    undefined,
    mapDispatchToProps
  )(_HeadEntryPoint),
  BottomEntryPoint: connect(
    undefined,
    mapDispatchToProps
  )(_BottomEntryPoint),
}
