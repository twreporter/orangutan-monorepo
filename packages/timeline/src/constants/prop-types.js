import PropTypes from 'prop-types'
import elementTypes from './element-types'

const elementSharedProps = {
  as: PropTypes.string,
  index: PropTypes.number,
}

const groupFlag = {
  ...elementSharedProps,
  type: PropTypes.oneOf([elementTypes.groupFlag]),
  content: PropTypes.shape({
    label: PropTypes.string,
    title: PropTypes.string,
  }),
}

const recordFlag = {
  ...elementSharedProps,
  type: PropTypes.oneOf([elementTypes.unitFlag]),
  content: PropTypes.shape({
    label: PropTypes.string,
    title: PropTypes.string,
  }),
}

const record = {
  ...elementSharedProps,
  type: PropTypes.oneOf([elementTypes.record]),
  content: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.shape({
      src: PropTypes.string,
      alt: PropTypes.string,
      caption: PropTypes.string,
    }),
  }),
}

export default {
  record,
  groupFlag,
  recordFlag,
}
