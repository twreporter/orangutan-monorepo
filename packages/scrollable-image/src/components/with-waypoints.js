import PropTypes from 'prop-types'
import React from 'react'
import childrenPositionConst from '../constants/children-position'
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
        childrenPosition: childrenPositionConst.top,
      }
      this.waypointsPosition = {
        topBoundaryPosition: undefined,
        bottomBoundaryPosition: undefined,
      }
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
        // To ensure triggering order,
        // top boundary leaves viewport event should be triggered
        // before bottom boundary enters viewport event
        // to avoid incapable of escaping fullscreen issue.
        //
        // This case happens when the image has not been loaded yet,
        // so the content width equals `100vh`.
        // If bottom boundary enters viewport first, there is no way to
        // escape fullscreen (i.e. set `childrenPosition` to 'top').
        if (bottomBoundaryPosition === Waypoint.inside) return
        this.setState({
          childrenPosition: childrenPositionConst.fixed,
        })
        return
      }
      // otherwise, set the image to top
      this.setState({
        childrenPosition: childrenPositionConst.top,
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
        // To ensure triggering order,
        // bottom boundary leaves viewport event should be triggered
        // before top boundary enters viewport event
        // to avoid incapable of escaping fullscreen issue.
        //
        // This case happens when the image has not been loaded yet,
        // so the content width equals `100vh`.
        // If top boundary enters viewport first, there is no way to
        // escape fullscreen (i.e. set `childrenPosition` to 'bottom').
        if (topBoundaryPosition === Waypoint.inside) return
        this.setState({
          childrenPosition: childrenPositionConst.fixed,
        })
        return
      }
      // otherwise, set the image to bottom
      this.setState({
        childrenPosition: childrenPositionConst.bottom,
      })
    }

    render() {
      const { childrenPosition } = this.state
      return (
        <>
          <Waypoint
            onPositionChange={this.handleTopBoundaryPositionChange}
            fireOnRapidScroll
            debug={this.props.debug}
          />
          <WrappedComponent
            {...this.props}
            childrenPosition={childrenPosition}
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
