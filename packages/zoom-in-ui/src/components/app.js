import AddImageLinkForm from './form'
import PropTypes from 'prop-types'
import React from 'react'
import themes from '../themes'
import useImagesState from '../hooks/use-images-state'
import zoomIn from '@twreporter/zoom-in'
// lodash
import assign from 'lodash/assign'
import get from 'lodash/get'
import map from 'lodash/map'
// @material-ui
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const _ = {
  assign,
  get,
  map,
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

const getImagesFromSearch = () => {
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.getAll('image')
  }
}

const App = props => {
  const { description, title } = props
  const classes = useStyles()
  const { imageLinks, addImageLink } = useImagesState(getImagesFromSearch())

  const handleSaveLink = link => {
    const trimmedLink = link.trim()
    if (trimmedLink.length > 0) {
      addImageLink(trimmedLink)
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
          <AddImageLinkForm
            buttonLabel="Submit"
            placeholder="public URL of your image"
            submitHandler={handleSaveLink}
            icon={<ArrowDownwardIcon />}
          />
          {imageLinks && imageLinks.length > 0 ? (
            <div className={classes.sandbox}>
              <ZoomableImage
                src={imageLinks[imageLinks.length - 1]}
                caption="數年前在美國使用VRS手語視訊翻譯平台（Video Relay Service）後，難忘如此振奮的感覺，歐陽磊回台便創立洛以，全體員工都是聽障者。（攝影／張家瑋）"
                theme={themes.twreporterTheme}
              />
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
