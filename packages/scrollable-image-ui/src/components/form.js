import PropTypes from 'prop-types'
import React from 'react'
import useInputState from '../hooks/use-input-state'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
}))

const Form = ({ buttonLabel, placeholder, submitHandler }) => {
  const classes = useStyles()
  const { value, reset, onChange } = useInputState()

  const handleSubmit = event => {
    event.preventDefault()
    submitHandler(value)
    reset()
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          placeholder={placeholder}
          margin="normal"
          onChange={onChange}
          value={value}
          fullWidth
        />
      </form>
      <Button
        variant="contained"
        onClick={handleSubmit}
        className={classes.button}
        endIcon={<Icon>add_circle</Icon>}
      >
        {buttonLabel}
      </Button>
    </>
  )
}

Form.propTypes = {
  placeholder: PropTypes.string,
  buttonLabel: PropTypes.string,
  submitHandler: PropTypes.func.isRequired,
}

export default Form
