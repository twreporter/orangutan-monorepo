import { init } from '@rematch/core'
import { Provider } from 'react-redux'
import * as models from '../models'
import * as predefinedPropTypes from '../constants/prop-types'
import EmbeddedItems, { TopOffset } from './embedded-items'
import get from 'lodash/get'
import Indicator from './indicator'
import map from 'lodash/map'
import mq from '../utils/media-query'
import PropTypes from 'prop-types'
import React from 'react'
import Sidebar from './sidebar'
import styled from 'styled-components'
import Text from './text'
import SectionsEntryPoints from './sections-entry-points'

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
`

class Root extends React.Component {
  static propTypes = {
    embeddedItems: PropTypes.arrayOf(
      PropTypes.arrayOf(predefinedPropTypes.embeddedItem)
    ).isRequired,
    chapters: PropTypes.arrayOf(predefinedPropTypes.chapter).isRequired,
  }

  constructor(props) {
    super(props)
    this._updateCachedAnchors(_.get(this.props, 'chapters'))
  }

  componentWillUpdate(nextProps) {
    this._updateCachedAnchors(_.get(nextProps, 'chapters'))
  }

  _buildAnchorFromChapter = chapter => {
    return {
      id: _.get(chapter, 'id', ''),
      label: _.get(chapter, 'label', ''),
    }
  }

  _updateCachedAnchors(nextChapters, thisChapters) {
    if (nextChapters !== thisChapters) {
      this._cachedAnchors = _.map(nextChapters, this._buildAnchorFromChapter)
    }
  }

  render() {
    const { chapters, embeddedItems } = this.props
    return (
      <Provider store={store}>
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
            <Text anchors={this._cachedAnchors} chapters={chapters} />
          </Responsive>
          <SectionsEntryPoints.BottomEntryPoint topOffset="99%" />
          <Sidebar anchors={this._cachedAnchors} isOpened />
          <Indicator anchors={this._cachedAnchors} />
        </Container>
      </Provider>
    )
  }
}

export default Root
