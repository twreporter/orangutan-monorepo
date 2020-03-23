import PropTypes from 'prop-types'

export const embeddedItem = PropTypes.arrayOf(PropTypes.string)

export const element = PropTypes.shape({
  type: PropTypes.string.isRequired,
  content: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        content: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
    ])
  ).isRequired,
})

export const section = PropTypes.shape({
  id: PropTypes.string.isRequired,
  content: PropTypes.arrayOf(element),
})

export const chapter = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  content: PropTypes.arrayOf(section).isRequired,
})

export const anchor = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
})
