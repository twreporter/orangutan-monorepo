import PropTypes from 'prop-types'
import elementTypes from './element-types'

const elementSharedProps = {
  as: PropTypes.string,
  index: PropTypes.number,
  label: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
    caption: PropTypes.string,
  }),
}

const groupFlag = {
  type: PropTypes.oneOf([elementTypes.groupFlag]),
  ...elementSharedProps,
}

const recordFlag = {
  type: PropTypes.oneOf([elementTypes.unitFlag]),
  ...elementSharedProps,
}

const record = {
  type: PropTypes.oneOf([elementTypes.record]),
  ...elementSharedProps,
}

export default {
  record,
  groupFlag,
  recordFlag,
}
