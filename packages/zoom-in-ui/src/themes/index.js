import defaultTheme from './default-theme'
import twreporterTheme from './twreporter-theme'
// lodash
import merge from 'lodash/merge'

const _ = {
  merge,
}

export default {
  defaultTheme: {
    desktop: _.merge({}, defaultTheme),
    hd: _.merge({}, defaultTheme),
    tablet: _.merge({}, defaultTheme),
    mobile: _.merge({}, defaultTheme),
  },
  twreporterTheme: {
    desktop: _.merge({}, defaultTheme, twreporterTheme.desktop),
    hd: _.merge({}, defaultTheme, twreporterTheme.hd),
    tablet: _.merge({}, defaultTheme, twreporterTheme.tablet),
    mobile: _.merge({}, defaultTheme),
  },
}
