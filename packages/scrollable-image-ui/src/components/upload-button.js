import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import PropTypes from 'prop-types'
import React from 'react'
import get from 'lodash/get'
import { makeStyles } from '@material-ui/core/styles'

const _ = {
  get,
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline',
  },
  input: {
    display: 'none',
  },
}))

const UploadButton = ({ action, isUploading, handleClick }) => {
  const classes = useStyles()

  const handleInputChange = e => {
    // upload single file
    const file = _.get(e, 'target.files[0]')
    if (file) {
      action(file)
      // empty input value
      e.target.value = ''
    }
  }

  return (
    <div className={classes.root}>
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          component="span"
          disabled={isUploading}
          endIcon={isUploading ? null : <CloudUploadIcon />}
          onClick={isUploading ? null : handleClick}
        >
          {isUploading ? 'UPLOADING...' : 'UPLOAD'}
        </Button>
      </label>
      <input
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
        onChange={handleInputChange}
        disabled={isUploading}
      />
    </div>
  )
}

UploadButton.propTypes = {
  action: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
}

export default UploadButton
