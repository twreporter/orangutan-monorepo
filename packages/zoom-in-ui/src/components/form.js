import PropTypes from 'prop-types'
import React from 'react'
import useInputState from '../hooks/use-input-state'
// @material-ui
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  container: {
    textAlign: 'right',
    padding: 0,
  },
  button: {
    margin: `${theme.spacing(2)}px 0`,
  },
}))

const Form = ({ buttonLabel, placeholder, submitHandler, icon }) => {
  const classes = useStyles()
  const { value: imgUrl, onChange: imgOnChange } = useInputState()
  const { value: caption, onChange: captionOnChange } = useInputState()

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
}

Form.defaultProps = {
  placeholder: '',
  buttonLabel: 'Add',
  icon: null,
}

export default Form
