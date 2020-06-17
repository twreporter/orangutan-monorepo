import PropTypes from 'prop-types'
import React, { useState } from 'react'
import copy from 'clipboard-copy'
// @material-ui
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import Button from '@material-ui/core/Button'
import CopyIcon from '@material-ui/icons/FileCopy'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

// TODO: move this link into `cloud-function`
const questionnaireLink = 'https://forms.gle/TidE4vNBzsPWECXDA'

const useStyles = makeStyles(theme => {
  return {
    result: {
      marginTop: '50px',
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    error: {
      minWidth: 400,
      boxShadow: theme.shadows[5],
    },
    codeBlock: {
      padding: theme.spacing(1),
      margin: theme.spacing(2),
    },
    copyBtn: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
  }
})

const Error = ({ message }) => {
  return (
    <>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {message}
      </Alert>
    </>
  )
}

Error.propTypes = {
  message: PropTypes.string.isRequired,
}

const EmbeddedCodeModal = ({ header, description, code, buildCodeError }) => {
  const classes = useStyles()
  const [isCopied, setIsCopied] = useState(false)
  if (buildCodeError) {
    console.error(buildCodeError)
    return (
      <div className={classes.error}>
        <Error message="Cannot generate embedded code." />
      </div>
    )
  }
  if (code) {
    return (
      <div className={classes.result}>
        <Typography variant="h5" gutterBottom>
          {header}
        </Typography>
        <Typography variant="body1">{description}</Typography>
        <Paper className={classes.codeBlock} elevation={3}>
          <TextField
            fullWidth
            multiline
            rowsMax={8}
            value={code}
            variant="filled"
            InputProps={{ disableUnderline: true }}
          />
        </Paper>
        <Button
          className={classes.copyBtn}
          disabled={!code}
          endIcon={<CopyIcon />}
          variant="contained"
          onClick={() => {
            copy(code)
              .then(() => {
                setIsCopied(true)
                setTimeout(() => {
                  setIsCopied(false)
                }, 700)
              })
              .catch(error => {
                console.error(error)
              })
          }}
        >
          {isCopied ? 'COPIED ' : 'CLICK TO COPY'}
        </Button>
        <a href={questionnaireLink} target="_blank" rel="noopener noreferrer">
          <Typography variant="body1">Please give us your feedback</Typography>
        </a>
      </div>
    )
  }
  return null
}

EmbeddedCodeModal.propTypes = {
  header: PropTypes.string.isRequired,
  description: PropTypes.string,
  code: PropTypes.string,
  buildCodeError: PropTypes.instanceOf(Error),
}

export default EmbeddedCodeModal
