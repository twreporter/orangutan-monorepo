import PopoverHint from './simple-popover'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import SelectableCode from './selectable-code'
import webpackAssets from '@twreporter/orangutan/dist/webpack-assets.json'
import orangutan from '@twreporter/orangutan'
// @material-ui
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

// TODO: move this link into `cloud-function`
const questionnaireLink = 'https://forms.gle/vGgVaqdHWBC5Vvg1A'

const useStyles = makeStyles(theme => {
  const center = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }
  return {
    result: {
      ...center,
      minWidth: 400,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    error: {
      ...center,
      minWidth: 400,
      boxShadow: theme.shadows[5],
    },
    codeBlock: {
      padding: theme.spacing(1),
      margin: theme.spacing(2),
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

const EmbeddedCodeModal = ({ header, description, config, buttonLabel }) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [codeState, setCode] = useState('')
  const [popOverAnchor, setPopOverAnchor] = useState(null)
  const { data, lazyload } = config

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const buildCode = () => {
    const code = orangutan.buildScrollableImageEmbeddedCode(
      {
        data,
        lazyload,
      },
      webpackAssets
    )
    setCode(code)
    handleOpen()
  }

  const handleClick = ({ currentTarget }) => {
    const isDataValid = Array.isArray(data) && data.length > 0
    if (!isDataValid) {
      setPopOverAnchor(currentTarget)
      return
    }
    buildCode()
  }

  const result = (
    <>
      <Typography variant="h5" gutterBottom>
        {header}
      </Typography>
      <Typography variant="body1">{description}</Typography>
      <Paper className={classes.codeBlock} elevation={3}>
        <SelectableCode code={codeState} />
      </Paper>
      <a href={questionnaireLink} target="_blank" rel="noopener noreferrer">
        <Typography variant="body1">Please give us your feedback</Typography>
      </a>
    </>
  )

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClick}>
        {buttonLabel}
      </Button>
      <PopoverHint
        anchorEl={popOverAnchor}
        setAnchorEl={setPopOverAnchor}
        content="Hint: Add at least 1 image link."
      />
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        open={open}
        onClose={handleClose}
      >
        {codeState ? (
          <div className={classes.result}>{result}</div>
        ) : (
          <div className={classes.error}>
            <Error message="Cannot generate embedded code." />
          </div>
        )}
      </Modal>
    </>
  )
}

EmbeddedCodeModal.propTypes = {
  header: PropTypes.string.isRequired,
  description: PropTypes.string,
  buttonLabel: PropTypes.string.isRequired,
  config: PropTypes.shape({
    data: PropTypes.array,
    lazyload: PropTypes.bool,
  }).isRequired,
}

export default EmbeddedCodeModal
