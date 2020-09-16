import PropTypes from 'prop-types'
import React from 'react'
import useInputState from '../hooks/use-input-state'
// lodash
import get from 'lodash/get'
// @material-ui
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'

const _ = {
  get,
}

const fieldName = {
  image: 'image',
  caption: 'caption',
}

const useStyles = makeStyles(theme => ({
  container: {
    textAlign: 'right',
    padding: 0,
  },
  button: {
    margin: `${theme.spacing(2)}px 0`,
  },
}))

const Form = ({
  buttonLabel,
  placeholder,
  submitHandler,
  icon,
  defaultValue,
}) => {
  const classes = useStyles()
  const { value: imgUrl, onChange: imgOnChange } = useInputState(
    _.get(defaultValue, fieldName.image)
  )
  const { value: caption, onChange: captionOnChange } = useInputState(
    _.get(defaultValue, fieldName.caption)
  )

  const handleSubmit = event => {
    event.preventDefault()
    submitHandler({
      imgUrl,
      caption,
    })
  }

  return (
    <Container className={classes.container}>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          placeholder={placeholder[0]}
          margin="normal"
          onChange={imgOnChange}
          value={imgUrl}
          fullWidth
        />
        <TextField
          variant="outlined"
          placeholder={placeholder[1]}
          margin="normal"
          onChange={captionOnChange}
          value={caption}
          fullWidth
        />
      </form>
      <Button
        variant="contained"
        onClick={handleSubmit}
        className={classes.button}
        endIcon={icon}
      >
        {buttonLabel}
      </Button>
    </Container>
  )
}

Form.propTypes = {
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  buttonLabel: PropTypes.string,
  submitHandler: PropTypes.func.isRequired,
  icon: PropTypes.node,
  defaultValue: PropTypes.shape({
    [fieldName.image]: PropTypes.string,
    [fieldName.caption]: PropTypes.string,
  }),
}

Form.defaultProps = {
  placeholder: '',
  buttonLabel: 'Add',
  icon: null,
  defaultValue: {
    [fieldName.image]: '',
    [fieldName.caption]: '',
  },
}

export default Form
