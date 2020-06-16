import { init } from '@rematch/core'
import { Provider } from 'react-redux'
import * as models from '../models'
import * as predefinedPropTypes from '../constants/prop-types'
import EmbeddedItems, { TopOffset } from './embedded-items'
import FullWidthWrapper from './full-width-wrapper'
import Indicator from './indicator'
import mq from '../utils/media-query'
import PropTypes from 'prop-types'
import React from 'react'
import Sidebar from './sidebar'
import styled from 'styled-components'
import Text from './text'
import SectionsEntryPoints from './sections-entry-points'
// lodash
import get from 'lodash/get'
import map from 'lodash/map'

const Responsive = styled.div`
  margin-top: ${TopOffset};
  ${mq.desktopAbove`
    display: flex;
    justify-content: center;
  `}
`

const _ = {
  get,
  map,
}

const store = init({
  models,
})

const Container = styled.div`
  background-color: #f1f1f1;
  text-align: left;
  svg text,
  svg text > tspan {
    font-family: 'source-han-sans-traditional', 'Noto Sans TC', 'PingFang TC',
      'Apple LiGothic Medium', Roboto, 'Microsoft JhengHei', 'Lucida Grande',
      'Lucida Sans Unicode', sans-serif;
  }

  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0) !important;
    -webkit-focus-ring-color: rgba(255, 255, 255, 0) !important;
    outline: none !important;
  }
  a:link,
  a:visited,
  a:active {
    color: #a67a44;
    text-decoration: none;
    border-bottom: 1px solid #d8d8d8;
  }
  a:hover {
    border-color: #a67a44;
  }
`

const TabletAndBelow = styled.div`
  display: none;
  ${mq.tabletBelow`
    display: block
  `}
`

const FirstEmbeddedItem = styled.div`
  ${mq.tabletBelow`
    height: 50vh;
    width: 100%;
    text-align: center;

    /* default styles for img embedded items */
    /* users can overwrite these styles in the spreadsheet */
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }
  `}

  ${mq.desktopOnly`
    width: 415px;
    height: 453px;
  `}

  ${mq.hdAbove`
    width: 540px;
    height: 590px;
  `}

  > div {
    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
  }
`

export default function Root(props) {
  const { chapters, embeddedItems, isFullWidth } = props
  const anchors = _.map(chapters, chapter => ({
    id: _.get(chapter, 'id', ''),
    label: _.get(chapter, 'label', ''),
  }))
  const elements = (
    <Container>
      <SectionsEntryPoints.HeadEntryPoint bottomOffset="99%" />
      <TabletAndBelow>
        <FirstEmbeddedItem>
          <div
            dangerouslySetInnerHTML={{
              __html: _.get(embeddedItems, [0, 0, 0], ''),
            }}
          />
        </FirstEmbeddedItem>
      </TabletAndBelow>
      <Responsive>
        <EmbeddedItems embeddedItems={embeddedItems} />
        <Text anchors={anchors} chapters={chapters} />
      </Responsive>
      <SectionsEntryPoints.BottomEntryPoint topOffset="99%" />
      <Sidebar anchors={anchors} isOpened />
      <Indicator anchors={anchors} />
    </Container>
  )

  return (
    <Provider store={store}>
      {isFullWidth ? <FullWidthWrapper>{elements}</FullWidthWrapper> : elements}
    </Provider>
  )
}

Root.propTypes = {
  embeddedItems: PropTypes.arrayOf(
    PropTypes.arrayOf(predefinedPropTypes.embeddedItem)
  ).isRequired,
  chapters: PropTypes.arrayOf(predefinedPropTypes.chapter).isRequired,
  isFullWidth: PropTypes.bool,
}

Root.defaultProps = {
  isFullWidth: true,
}
