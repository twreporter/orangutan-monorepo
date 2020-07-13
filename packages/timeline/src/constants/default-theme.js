import defaultFontFamily from './font-family'
import elementTypes from './element-types'
import { sourceHanSansTC as fontWeight } from '@twreporter/core/lib/constants/font-weight'

export default {
  [elementTypes.record]: {
    color: '#404040',
    figcaptionColor: '#808080',
    figcaptionFontWeight: fontWeight.light,
    fontFamily: defaultFontFamily,
    linkColor: '#a67a44',
    linkUnderlineColor: '#d8d8d8',
    pFontWeight: fontWeight.normal,
    strongColor: '#262626',
    titleColor: '#a67a44',
    titleFontWeight: fontWeight.medium,
  },
  [elementTypes.unitFlag]: {
    color: '#fff',
    background: '#000',
    fontFamily: defaultFontFamily,
    labelFontWeight: fontWeight.normal,
    titleFontWeight: fontWeight.regular,
  },
  [elementTypes.groupFlag]: {
    color: '#fff',
    background: '#a67a44',
    fontFamily: defaultFontFamily,
    labelFontWeight: fontWeight.normal,
    titleFontWeight: fontWeight.regular,
  },
  lineColor: '#000',
  emphasizedElements: {
    background: '#fff',
  },
}
