const colors = {
  primary: '#c71b0a',
  secondary: '#a67a44',
  white: '#fff',
  black: '#000',
  hex404040: '#404040',
  hex808080: '#808080',
  hex4A4949: '#4A4949',
  hexF1F1F1: '#f1f1f1',
  tocItem: '#9c9c9c',
  tocItemFocused: '#a67a44',
  background: '#f1f1f1',
}

const typography = {
  font: {
    size: {
      title: '38px',
      headerOne: '32px',
      headerTwo: '27px',
      xlarge: '22px',
      large: '20px',
      medium: '18px',
      small: '16px',
      xsmall: '14px',
    },
    weight: {
      // extraLight: '100',
      light: '200',
      normal: '300',
      // regular: '400',
      // medium: '500',
      bold: '700',
      heavy: '900',
    },
  },
  lineHeight: {
    large: '2',
    medium: '1.8',
    small: '1.5',
  },
}

const zIndex = {
  hoverDetector: 5,
  // table-of-contents
  // z-index is set for covering @twreporter/universal-header.
  // Set z-index to 1001 because @twreporter/universal-header has z-index 1000.
  // ref: https://github.com/twreporter/twreporter-npm-packages/blob/192343033ccc798eabe0727c930a86ea0110be28/packages/universal-header/src/containers/header.js#L44
  toc: 1001,
  embeddedItem: 5,
}

export default {
  colors,
  typography,
  zIndex,
}
