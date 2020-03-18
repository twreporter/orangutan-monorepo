import PropTypes from 'prop-types'
import React, { useState } from 'react'
import copy from 'clipboard-copy'
// @material-ui
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import Button from '@material-ui/core/Button'
import CopyIcon from '@material-ui/icons/FileCopy'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'

function Code(props) {
  const { code, label } = props
  const [showCopyBtnTooltip, setShowCopyBtnTooltip] = useState(false)
  const [copyBtnTooltipMessage, setCopyBtnTooltipMessage] = useState('')
  return (
    <React.Fragment>
      <Divider style={{ margin: '20px 0' }} variant="middle" />
      <div>
        <TextField
          fullWidth
          label={label}
          multiline
          rowsMax={8}
          value={code}
          variant="filled"
        />
        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          <Tooltip
            arrow
            disableFocusListener
            disableHoverListener
            disableTouchListener
            open={showCopyBtnTooltip}
            placement="bottom"
            title={copyBtnTooltipMessage}
          >
            <Button
              color="secondary"
              disabled={!code}
              endIcon={<CopyIcon />}
              variant="contained"
              onClick={() => {
                copy(code)
                  .then(() => {
                    setCopyBtnTooltipMessage('copied')
                    setShowCopyBtnTooltip(true)
                    setTimeout(() => {
                      setShowCopyBtnTooltip(false)
                    }, 700)
                  })
                  .catch(error => {
                    console.error(error)
                    setCopyBtnTooltipMessage('ERROR')
                  })
              }}
            >
              一鍵複製
            </Button>
          </Tooltip>
        </div>
      </div>
    </React.Fragment>
  )
}

Code.propTypes = {
  code: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

function Error(props) {
  return (
    <React.Fragment>
      <Divider style={{ margin: '20px 0' }} variant="middle" />
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {props.message}
      </Alert>
    </React.Fragment>
  )
}

Error.propTypes = {
  message: PropTypes.string.isRequired,
}

export default function Result(props) {
  const { code, codeLabel, errorMessage } = props
  if (errorMessage) {
    return <Error message={errorMessage} />
  }
  if (code) {
    return <Code label={codeLabel} code={code} />
  }
  return null
}

Result.propTypes = {
  code: PropTypes.string,
  codeLabel: PropTypes.string,
  errorMessage: PropTypes.string,
}
