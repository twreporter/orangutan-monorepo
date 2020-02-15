import { sourceHanSansTC as fontWeight } from '@twreporter/core/lib/constants/font-weight'
import predefinedPropTypes from '../constants/prop-types'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

const UnitFlagContainer = styled.div`
  margin-top: 6px;
  margin-bottom: 6px;
  position: relative;
`

const Flag = styled.h3`
  /* h3 reset start */
  margin: 0;
  border: 0;
  outline: 0;
  font-size: 100%;
  vertical-align: baseline;
  /* h3 reset end */
  color: ${props => props.color};
  max-width: 95%;
  background: ${props => props.background};
  margin-left: 9px;
  display: inline-block;
  padding: 1px 12px 1px 5px;
  line-height: 1.28;
  display: inline-flex;
`

const Label = styled.div`
  font-size: 16px;
  font-weight: ${fontWeight.normal};
  letter-spacing: 0.9px;
  flex: 0 0 auto;
`

const Title = styled.div`
  font-size: 16px;
  font-weight: ${fontWeight.regular};
  margin-left: 0.4em;
  flex: 0 1 auto;
`

export default class UnitFlag extends PureComponent {
  static propTypes = {
    as: PropTypes.string.isRequired,
    color: PropTypes.string,
    background: PropTypes.string,
    ...predefinedPropTypes.unitFlag,
  }

  static defaultProps = {
    color: '#fff',
    background: '#000',
  }

  render() {
    const { label, color, background, title, as } = this.props
    return (
      <UnitFlagContainer>
        <Flag color={color} background={background} as={as}>
          {label ? <Label>{label}</Label> : null}
          {title ? <Title>{title}</Title> : null}
        </Flag>
      </UnitFlagContainer>
    )
  }
}
