import PropTypes from 'prop-types'
import React from 'react'
import merge from 'lodash/merge'
import { Waypoint } from 'react-waypoint'

const _ = {
  merge,
}

const withWaypoints = WrappedComponent => {
  class WithWaypoints extends React.PureComponent {
    static propTypes = {
      debug: PropTypes.bool,
    }

    static defaultProps = {
      debug: false,
    }
    constructor(props) {
      super(props)
      this.state = {
        isActive: false,
        childrenAligned: 'top',
      }
      this.waypointsPosition = {
        topBoundaryPosition: undefined,
        bottomBoundaryPosition: undefined,
      }
      this.setScrollState = this._setScrollState.bind(this)
      this.handleTopBoundaryPositionChange = this._handleTopBoundaryPositionChange.bind(
        this
      )
      this.handleBottomBoundaryPositionChange = this._handleBottomBoundaryPositionChange.bind(
        this
      )
    }

    componentWillUnmount() {
      this.waypointsPosition = undefined
    }

    _setScrollState({ isActive, childrenAligned }) {
      this.setState({
        isActive,
        childrenAligned,
      })
    }

    _setWaypointPosition(pos) {
      this.waypoints = _.merge(this.waypointsPosition, pos)
    }

    _handleTopBoundaryPositionChange(position) {
      const { previousPosition, currentPosition } = position
      const { bottomBoundaryPosition } = this.waypointsPosition

      this._setWaypointPosition({ topBoundaryPosition: currentPosition })

      if (!previousPosition || !currentPosition) return

      // when scrolling from top to bottom
      // image is supposed to be in the viewport
      // set it fixed
      if (
        (previousPosition === Waypoint.inside ||
          previousPosition === Waypoint.below) &&
        currentPosition === Waypoint.above
      ) {
        if (bottomBoundaryPosition === Waypoint.inside) return
        this.setScrollState({
          isActive: true,
        })
        return
      }
      // otherwise, set the image to top
      this.setScrollState({
        isActive: false,
        childrenAligned: 'top',
      })
    }

    _handleBottomBoundaryPositionChange(position) {
      const { previousPosition, currentPosition } = position
      const { topBoundaryPosition } = this.waypointsPosition

      this._setWaypointPosition({ bottomBoundaryPosition: currentPosition })

      if (!previousPosition || !currentPosition) return

      // when scrolling from botttom to top
      // iimage is supposed to be in the viewport
      // set it fixed
      if (
        (previousPosition === Waypoint.inside ||
          previousPosition === Waypoint.above) &&
        currentPosition === Waypoint.below
      ) {
        if (topBoundaryPosition === Waypoint.inside) return
        this.setScrollState({
          isActive: true,
        })
        return
      }
      // otherwise, set the image to bottom
      this.setScrollState({
        isActive: false,
        childrenAligned: 'bottom',
      })
    }

    render() {
      const { isActive, childrenAligned } = this.state
      return (
        <>
          <Waypoint
            onPositionChange={this.handleTopBoundaryPositionChange}
            fireOnRapidScroll
            debug={this.props.debug}
          />
          <WrappedComponent
            {...this.props}
            isActive={isActive}
            childrenAligned={childrenAligned}
          />
          <Waypoint
            onPositionChange={this.handleBottomBoundaryPositionChange}
            fireOnRapidScroll
            debug={this.props.debug}
          />
        </>
      )
    }
  }

  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  WithWaypoints.displayName = `withWaypoints(${wrappedComponentName})`

  return WithWaypoints
}

export default withWaypoints
