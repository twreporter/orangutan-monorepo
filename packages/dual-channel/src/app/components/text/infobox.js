import BaseComponents from '../base'
import BoxSvg from '../../static/infobox-logo.svg'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import theme from '../../constants/theme'

const TwoColumnContainer = styled(BaseComponents.ArticleElementContainer)`
  position: relative;
  background-color: ${theme.colors.white};
  white-space: pre-wrap;
  margin: 40px auto;
  padding-top: 36px;
  padding-bottom: 36px;
`

const OneColumnContainer = styled(BaseComponents.PageContainer)`
  position: relative;
  background-color: ${theme.colors.white};
  white-space: pre-wrap;
  margin: 40px auto;
  padding-top: 36px;
  padding-bottom: 36px;
`

const LogoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 23px;
  height: 24px;
`

const Header = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  color: ${theme.colors.hex404040};
  font-size: ${theme.typography.font.size.large};
  line-height: ${theme.typography.lineHeight.small};
  text-align: center;
`

const Text = styled.p`
  color: ${theme.colors.hex404040};
  font-size: ${theme.typography.font.size.small};
  font-weight: ${theme.typography.font.weight.medium};
  line-height: ${theme.typography.lineHeight.medium};
  text-align: justify;
  padding-right: 30px;
  padding-left: 30px;
  a {
    color: ${theme.colors.hex404040} !important;
  }
`

class InfoBox extends React.PureComponent {
  _renderTexts(texts) {
    return texts.map((text, index) => {
      return (
        <Text
          key={`info_p_${index}`}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )
    })
  }

  render() {
    const { content, wide } = this.props
    const Container = wide ? OneColumnContainer : TwoColumnContainer
    return (
      <Container>
        <LogoContainer>
          <img src={BoxSvg} />
        </LogoContainer>
        <Header>{content[0]}</Header>
        {this._renderTexts(content.slice(1))}
      </Container>
    )
  }
}

InfoBox.propTypes = {
  content: PropTypes.array.isRequired,
  wide: PropTypes.bool,
}

export default InfoBox
