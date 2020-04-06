import Avatar from '@material-ui/core/Avatar'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import ImageIcon from '@material-ui/icons/Image'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import PropTypes from 'prop-types'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}))

const ImageList = ({ imageLinks, deleteImageLink }) => {
  const classes = useStyles()
  const deleteHandler = index => {
    deleteImageLink(index)
  }
  return (
    <List className={classes.list} disablePadding>
      {imageLinks.map((link, index) => (
        <ListItem key={index.toString()}>
          <ListItemAvatar>
            <Avatar>
              <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="image" secondary={link} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => deleteHandler(index)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}

ImageList.propTypes = {
  imageLinks: PropTypes.array.isRequired,
  deleteImageLink: PropTypes.func.isRequired,
}

export default ImageList
