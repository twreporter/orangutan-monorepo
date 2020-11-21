import PropTypes from 'prop-types'
import React from 'react'
import { Waypoint } from 'react-waypoint'

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
        isScrollingFromTopToBottom: false,
      }
      this.isEnabled = false
      this.setScrollState = this._setScrollState.bind(this)
      this.handleTopBoundaryEnter = this._handleTopBoundaryEnter.bind(this)
      this.handleTopBoundaryLeave = this._handleTopBoundaryLeave.bind(this)
      this.handleBottomBoundaryEnter = this._handleBottomBoundaryEnter.bind(
        this
      )
      this.handleBottomBoundaryLeave = this._handleBottomBoundaryLeave.bind(
        this
      )
    }

    _setScrollState({ isActive, verticalDirection }) {
      this.setState({
        isActive,
        verticalDirection,
      })
    }

    _handleTopBoundaryEnter({ previousPosition, currentPosition }) {
      if (!this.isEnabled) return
      if (
        previousPosition === Waypoint.above &&
        currentPosition === Waypoint.inside
      ) {
        this.setScrollState({
          isActive: false,
          verticalDirection: 'up',
        })
      }
    }

    _handleTopBoundaryLeave({ previousPosition, currentPosition }) {
      if (!this.isEnabled) return
      if (
        previousPosition === Waypoint.inside &&
        currentPosition === Waypoint.above
      ) {
        this.setScrollState({
          isActive: true,
          verticalDirection: 'down',
        })
      }
    }

    _handleBottomBoundaryEnter({ previousPosition, currentPosition }) {
      if (!this.isEnabled) return
      if (
        previousPosition === Waypoint.below &&
        currentPosition === Waypoint.inside
      ) {
        this.setScrollState({
          isActive: false,
          verticalDirection: 'down',
        })
      }
    }

    _handleBottomBoundaryLeave({ previousPosition, currentPosition }) {
      if (!this.isEnabled) return
      if (
        previousPosition === Waypoint.inside &&
        currentPosition === Waypoint.below
      ) {
        this.setScrollState({
          isActive: true,
          verticalDirection: 'up',
        })
      }
    }

    render() {
      const { isActive, verticalDirection } = this.state
      return (
        <>
          <Waypoint
            onEnter={this.handleTopBoundaryEnter}
            onLeave={this.handleTopBoundaryLeave}
            fireOnRapidScroll
            debug={this.props.debug}
          />
          <WrappedComponent
            {...this.props}
            isActive={isActive}
            verticalDirection={verticalDirection}
            enableWaypoint={() => (this.isEnabled = true)}
          />
          <Waypoint
            onEnter={this.handleBottomBoundaryEnter}
            onLeave={this.handleBottomBoundaryLeave}
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
