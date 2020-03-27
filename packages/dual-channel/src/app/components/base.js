import * as layout from '../constants/layout'
// import React from 'react'
import mq from '../utils/media-query'
import styled from 'styled-components'

const getCustomWidthContainer = ({ mobile, tablet, desktop, hd }) => styled.div`
  ${mq.mobileBelow`
    width: ${mobile};
  `}
  ${mq.tabletOnly`
    width: ${tablet};
  `};
  ${mq.desktopOnly`
    width: ${desktop};
  `};
  ${mq.hdAbove`
    width: ${hd};
  `};
`

const ArticleElementContainer = getCustomWidthContainer(
  layout.articleContainerWidth
)

const ArticleContainer = styled(ArticleElementContainer)`
  ${mq.tabletBelow`
    margin: 0 auto;
  `}
  ${mq.desktopAbove`
    margin-left: 112px;
    align-items: stretch;
  `}
`

const PageContainer = getCustomWidthContainer(layout.pageContainerWidth)

export default {
  ArticleElementContainer,
  ArticleContainer,
  PageContainer,
}
