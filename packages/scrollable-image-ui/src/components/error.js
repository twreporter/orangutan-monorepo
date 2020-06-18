// @material-ui
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import PropTypes from 'prop-types'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'left',
    wordBreak: 'break-word',
  },
}))

const Error = ({ show, children }) => {
  const classes = useStyles()
  return show ? (
    <Alert severity="error" className={classes.root}>
      <AlertTitle>Error</AlertTitle>
      {children}
    </Alert>
  ) : null
}

Error.propTypes = {
  show: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
}

export default Error
