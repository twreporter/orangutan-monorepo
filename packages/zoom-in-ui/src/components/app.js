import AddImageForm from './form'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Setting from './setting'
import themes from '../themes'
import useImagesState from '../hooks/use-images-state'
import zoomIn from '@twreporter/zoom-in'
// lodash
import get from 'lodash/get'
import map from 'lodash/map'
import merge from 'lodash/merge'
// @material-ui
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import RedoIcon from '@material-ui/icons/Redo'
import Typography from '@material-ui/core/Typography'
import DevicesIcon from '@material-ui/icons/Devices'
import { makeStyles } from '@material-ui/core/styles'

const _ = {
  get,
  map,
  merge,
}

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '50px',
    marginTop: '50px',
  },
  divider: {
    margin: '20px 0',
  },
  sandbox: {
    width: '100%',
    marginTop: '25px',
  },
}))

const App = props => {
  const { description, title } = props
  const classes = useStyles()
  const { imageLinks, addImageLink } = useImagesState([])
  const [imageCaption, addImageCaption] = useState()
  const [theme, setTheme] = useState(_.merge({}, themes.twreporterTheme))

  const handleSaveLink = ({ imgUrl, caption }) => {
    const trimmedLink = imgUrl.trim()
    if (trimmedLink.length > 0) {
      addImageLink(trimmedLink)
      addImageCaption(caption)
    }
  }

  const updateTheme = updatedPart => {
    const updatedTheme = _.merge({}, theme, updatedPart)
    setTheme(updatedTheme)
  }

  const ZoomableImage = zoomIn.Component
  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Paper className={classes.paper}>
          <Typography variant="h3" component="h1" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" component="div" gutterBottom>
            {_.map(description, (p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </Typography>
          <Divider className={classes.divider} variant="middle" />
          <AddImageForm
            buttonLabel="Submit"
            placeholder={[
              'public URL of your image',
              'caption for the image (optional)',
            ]}
            submitHandler={handleSaveLink}
            icon={<ArrowDownwardIcon />}
          />
          {imageLinks && imageLinks.length > 0 ? (
            <div className={classes.sandbox}>
              <Setting
                theme={theme}
                updateTheme={updateTheme}
                caption={imageCaption}
              />
              <ZoomableImage
                src={imageLinks[imageLinks.length - 1]}
                caption={imageCaption}
                theme={theme}
              />
              <Typography
                style={{ textAlign: 'right', color: 'grey' }}
                variant="body1"
                component="div"
                gutterBottom
              >
                <span>
                  <RedoIcon style={{ transform: 'rotate(243deg)' }} />
                </span>
                click to preview
              </Typography>
              <Typography
                style={{ fontSize: '14px', color: 'grey', marginTop: '20px' }}
                variant="body1"
                component="div"
                gutterBottom
              >
                <span>
                  <DevicesIcon
                    style={{ transform: 'translateY(25%)', marginRight: '5px' }}
                  />
                </span>
                <span>
                  Resize the browser window to emulate various screen
                  resolutions.
                </span>
              </Typography>
            </div>
          ) : null}
        </Paper>
      </Container>
    </>
  )
}

App.propTypes = {
  title: PropTypes.string,
  description: PropTypes.array,
  codeLabel: PropTypes.string,
}

App.defaultProps = {
  title: 'Zoom In',
  description: ['Generate your own zoom image'],
  codeLabel: 'Embedded Code',
}

export default App
