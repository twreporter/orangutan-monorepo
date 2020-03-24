import Popover from '@material-ui/core/Popover'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(1),
  },
}))

const SimplePopover = ({ anchorEl, setAnchorEl, content }) => {
  const classes = useStyles()
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Typography
        classes={{
          root: classes.content,
        }}
        variant="body1"
      >
        {content}
      </Typography>
    </Popover>
  )
}

SimplePopover.propTypes = {
  anchorEl: PropTypes.object,
  setAnchorEl: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
}

export default SimplePopover
