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

      console.log('handle top boundary')
      console.log('top: previousPosition:', previousPosition)
      console.log('top: currentPosition:', currentPosition)

      if (!previousPosition || !currentPosition) return

      /// / top boundary enter to viewport
      // if (currentPosition === Waypoint.inside) {
      //  if (previousPosition === Waypoint.above) {
      //    this.setScrollState({
      //      isActive: false,
      //      childrenAligned: 'top',
      //    })
      //  } else if (previousPosition === Waypoint.below) {
      //    this.setScrollState({
      //      isActive: false,
      //      childrenAligned: 'top',
      //    })
      //  }
      //  return
      // }

      /// / top boundary leave from viewport
      // if (previousPosition === Waypoint.inside) {
      //  if (currentPosition === Waypoint.above) {
      //    if (bottomBoundaryPosition === Waypoint.inside) return
      //    this.setScrollState({
      //      isActive: true,
      //    })
      //  } else if (currentPosition === Waypoint.below) {
      //    this.setScrollState({
      //      isActive: false,
      //      childrenAligned: 'top',
      //    })
      //  }
      //  return
      // }

      if (
        currentPosition === Waypoint.above &&
        previousPosition !== Waypoint.above
      ) {
        this.setScrollState({
          isActive: true,
        })
      } else {
        this.setScrollState({
          isActive: false,
          childrenAligned: 'top',
        })
      }
    }

    _handleBottomBoundaryPositionChange(position) {
      const { previousPosition, currentPosition } = position
      const { topBoundaryPosition } = this.waypointsPosition

      this._setWaypointPosition({ bottomBoundaryPosition: currentPosition })

      console.log('handle bottom boundary')
      console.log('bottom: previousPosition:', previousPosition)
      console.log('bottom: currentPosition:', currentPosition)

      if (!previousPosition || !currentPosition) return

      /// / bottom boundary enter to viewport
      // if (currentPosition === Waypoint.inside) {
      //  if (previousPosition === Waypoint.below) {
      //    // bottom boundary enter from below
      //    this.setScrollState({
      //      isActive: false,
      //      childrenAligned: 'bottom',
      //    })
      //  } else if (previousPosition === Waypoint.above) {
      //    // bottom boundary enter from above
      //    this.setScrollState({
      //      isActive: false,
      //      childrenAligned: 'bottom',
      //    })
      //  }
      //  return
      // }

      /// / bottom boundary leave from viewport
      // if (previousPosition === Waypoint.inside) {
      //  if (currentPosition === Waypoint.below) {
      //    // bottom boundary leave to below
      //    if (topBoundaryPosition === Waypoint.inside) return
      //    this.setScrollState({
      //      isActive: true,
      //    })
      //  } else if (currentPosition === Waypoint.above) {
      //    // bottom boundary leave to above
      //    this.setScrollState({
      //      isActive: false,
      //      childrenAligned: 'bottom',
      //    })
      //  }
      //  return
      // }

      if (
        currentPosition === Waypoint.below &&
        previousPosition !== Waypoint.below
      ) {
        this.setScrollState({
          isActive: true,
        })
      } else {
        this.setScrollState({
          isActive: false,
          childrenAligned: 'bottom',
        })
      }
    }

    render() {
      const { isActive, childrenAligned } = this.state
      return (
        <>
          <Waypoint
            onPositionChange={this.handleTopBoundaryPositionChange}
            fireOnRapidScroll
            debug={this.props.debug}
            bottomOffset="99%"
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
            topOffset="99%"
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
