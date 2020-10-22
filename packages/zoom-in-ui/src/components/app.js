import 'url-search-params-polyfill'
import AddImageForm from './form'
import EmbeddedCode from './embedded-code'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Setting from './setting'
import themes from '../themes'
import webpackAssets from '@twreporter/zoom-in/dist/webpack-assets.json'
import zoomIn from '@twreporter/zoom-in'
// lodash
import get from 'lodash/get'
import map from 'lodash/map'
import merge from 'lodash/merge'
// @material-ui
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import DevicesIcon from '@material-ui/icons/Devices'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import RedoIcon from '@material-ui/icons/Redo'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const _ = {
  get,
  map,
  merge,
}

const searchKey = {
  image: 'image',
  caption: 'caption',
}

const useStyles = makeStyles(theme => ({
  container: {
    textAlign: 'right',
    padding: 0,
  },
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
  button: {
    margin: `${theme.spacing(2)}px 0`,
  },
  alignRight: {
    textAlign: 'right',
  },
}))

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

const getParamsFromSearch = query => {
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get(query)
  }
}

const App = props => {
  const { description, title } = props
  const classes = useStyles()
  const [imageLink, setImageLink] = useState(
    getParamsFromSearch(searchKey.image) || ''
  )
  const [imageCaption, setImageCaption] = useState(
    getParamsFromSearch(searchKey.caption) || ''
  )
  const [code, setCode] = useState(null)
  const [buildCodeError, setBuildCodeError] = useState(null)
  const [theme, setTheme] = useState(
    imageCaption ? themes.twreporterTheme : themes.defaultTheme
  )
  const [isValidImage, setImageValid] = useState()

  const checkIfImageIsValid = imageSrc => {
    if (typeof window !== 'undefined') {
      const img = new window.Image()
      img.onload = () => setImageValid(true)
      img.onerror = () => setImageValid(false)
      img.src = imageSrc
    }
  }

  const handleSaveLink = ({ imgUrl, caption }) => {
    const trimmedLink = imgUrl.trim()
    if (trimmedLink.length > 0) {
      const newTheme = caption ? themes.twreporterTheme : themes.defaultTheme
      setImageLink(trimmedLink)
      checkIfImageIsValid(trimmedLink)
      setImageCaption(caption)
      setTheme(newTheme)
    }
  }

  const updateTheme = updatedPart => {
    const updatedTheme = _.merge({}, theme, updatedPart)
    setTheme(updatedTheme)
  }

  const buildCode = () => {
    try {
      const code = zoomIn.buildEmbeddedCode(
        {
          data: {
            src: imageLink,
            alt: imageCaption,
            caption: imageCaption,
            theme,
          },
        },
        webpackAssets
      )
      setCode(code)
      setBuildCodeError(null)
    } catch (error) {
      setBuildCodeError(error)
    }
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
            defaultValue={{
              image: imageLink,
              caption: imageCaption,
            }}
          />
          {imageLink && typeof isValidImage !== 'undefined' ? (
            isValidImage ? (
              <div className={classes.sandbox}>
                <Setting
                  theme={theme}
                  updateTheme={updateTheme}
                  caption={imageCaption}
                />
                <ZoomableImage
                  src={imageLink}
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
                      style={{
                        transform: 'translateY(25%)',
                        marginRight: '5px',
                      }}
                    />
                  </span>
                  <span>
                    Resize the browser window to emulate various screen
                    resolutions.
                  </span>
                </Typography>
                <div className={classes.alignRight}>
                  <Button
                    variant="contained"
                    onClick={buildCode}
                    className={classes.button}
                    endIcon={<ArrowDownwardIcon />}
                  >
                    build code
                  </Button>
                </div>
                <EmbeddedCode
                  header="Embedded Code"
                  description="Place this code wherever you want the plugin to appear on your page."
                  code={code}
                  buildCodeError={buildCodeError}
                />
              </div>
            ) : (
              <Error message="Cannot load image!" />
            )
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
