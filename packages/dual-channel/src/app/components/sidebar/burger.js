import styles from '../../constants/theme'
import mq from '../../utils/media-query'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const HamburgerContainer = styled.div`
  ${mq.desktopAbove`
    display: none;
  `}
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  opacity: ${props => (props.show ? '0.5' : '0')};
  transition: opacity 300ms ease;
  position: relative;
  top: 15px;
  background: ${styles.colors.white};
  width: 40px;
  flex: 0 0 40px;
  height: 40px;
  cursor: pointer;
  z-index: ${styles.zIndex.toc};
`

const HamburgerFrame = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
`

const Storke = styled.div`
  width: ${props => props.length}px;
  position: relative;
  left: ${props => 20 - props.length}px;
  height: 1px;
  &:not(:last-of-type) {
    margin-bottom: 7px;
  }
  background-color: ${styles.colors.primary};
`

const CrossFrame = styled.div`
  position: absolute;
  width: 14x;
  height: 14px;
  transform: translate(-50%, -58%);
  top: 50%;
  left: 50%;
  &::before,
  ::after {
    position: absolute;
    content: ' ';
    height: 20px;
    width: 1px;
    background-color: ${styles.colors.primary};
  }
  &::after {
    transform: rotate(45deg);
  }
  &::before {
    transform: rotate(-45deg);
  }
`

const Hamburger = ({ show, isOpened, ...elseprops }) => (
  <HamburgerContainer show={show} {...elseprops}>
    {isOpened ? (
      <CrossFrame />
    ) : (
      <HamburgerFrame>
        <Storke length={20} />
        <Storke length={14} />
        <Storke length={17} />
      </HamburgerFrame>
    )}
  </HamburgerContainer>
)

Hamburger.propTypes = {
  onClick: PropTypes.func.isRequired,
  show: PropTypes.bool,
  isOpened: PropTypes.bool,
}

export default Hamburger
