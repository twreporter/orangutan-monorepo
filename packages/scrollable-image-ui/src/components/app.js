/* eslint-env browser */
import AddImageLinkForm from './form'
import EmbeddedCode from './embedded-code'
import Error from './error'
import ImageList from './image-list'
import PopoverHint from './simple-popover'
import Preview from './preview'
import React, { useState, useReducer } from 'react'
import UploadButton from './upload-button'
import assign from 'lodash/assign'
import axios from 'axios'
import get from 'lodash/get'
import useImagesState from '../hooks/use-images-state'
import webpackAssets from '@twreporter/orangutan/dist/webpack-assets.json'
// @material-ui
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const isDevelopment = process.env.NODE_ENV === 'development'

const _ = {
  assign,
  get,
}

const actionTypes = {
  request: 'request',
  success: 'success',
  fail: 'fail',
  reset: 'reset',
}

const initialImageUploadingState = {
  isUploading: false,
  imagePublicUrl: '',
  errorMessage: null,
}

const imageUploadingReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.request: {
      return _.assign({}, initialImageUploadingState, {
        isUploading: true,
      })
    }
    case actionTypes.success: {
      return _.assign({}, initialImageUploadingState, {
        isUploading: false,
        imagePublicUrl: action.imagePublicUrl,
      })
    }
    case actionTypes.fail: {
      return _.assign({}, initialImageUploadingState, {
        isUploading: false,
        errorMessage: action.errorMessage,
      })
    }
    case actionTypes.reset: {
      return _.assign({}, initialImageUploadingState)
    }
    default: {
      return state
    }
  }
}

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(3),
    textAlign: 'center',
  },
  formControlLabel: {
    display: 'block',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  progressBar: {
    marginTop: '50px',
  },
  errorMessage: {
    marginTop: theme.spacing(2),
  },
}))

const getImagesFromSearch = () => {
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.getAll('image')
  }
}

const Content = () => {
  const { imageLinks, addImageLink, deleteImageLink } = useImagesState(
    getImagesFromSearch()
  )
  const classes = useStyles()
  const [toLazyload, setLazyload] = useState(false)
  const [code, setCode] = useState(null)
  const [buildCodeError, setBuildCodeError] = useState(null)
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null)
  const [showProgress, setProgress] = useState(false)
  const [imageUploadingState, dispatchImageUploadingAction] = useReducer(
    imageUploadingReducer,
    initialImageUploadingState
  )

  const buildCode = async () => {
    setProgress(true)
    const { default: orangutan } = await import(
      /* webpackChunkName: "orangutan" */ '@twreporter/orangutan'
    )
    try {
      const code = orangutan.buildScrollableImageEmbeddedCode(
        {
          data: imageLinks,
          lazyload: toLazyload,
        },
        webpackAssets
      )
      setProgress(false)
      setCode(code)
      setBuildCodeError(null)
    } catch (error) {
      setBuildCodeError(error)
    }
  }

  const handleSaveLink = link => {
    const trimmedLink = link.trim()
    if (trimmedLink.length > 0) {
      addImageLink(trimmedLink)
    }
  }

  const resetState = () => {
    dispatchImageUploadingAction({
      type: actionTypes.reset,
    })
  }

  const uploadImage = image => {
    if (image) {
      let formData = new FormData()
      formData.append('image', image)

      dispatchImageUploadingAction({
        type: actionTypes.request,
      })

      return axios({
        method: 'POST',
        headers: { 'content-type': 'multipart/form-data' },
        data: formData,
        url: isDevelopment
          ? 'http://localhost:8080/api/asset/scrollable-image'
          : '/scrollable-image/api/asset/scrollable-image',
      })
        .then(res => {
          const data = JSON.parse(_.get(res, 'data.data'))
          const imagePublicUrl = _.get(data, 'publicUrls[0]')
          if (imagePublicUrl) {
            dispatchImageUploadingAction({
              type: actionTypes.success,
              imagePublicUrl,
            })
            addImageLink(imagePublicUrl)
          } else {
            dispatchImageUploadingAction({
              type: actionTypes.fail,
              errorMessage: 'Server responds with empty content.',
            })
          }
        })
        .catch(error => {
          const axiosErrorMessage = error.message
          const errorMessageFromResponse = _.get(error, 'response.data.message')
          // eslint-disable-next-line no-console
          console.error(error.response || error.message)
          dispatchImageUploadingAction({
            type: actionTypes.fail,
            errorMessage: errorMessageFromResponse || axiosErrorMessage,
          })
        })
    }
  }

  return (
    <Container className={classes.container}>
      <Container maxWidth="sm">
        <Typography variant="h3" gutterBottom>
          Scrollable Image Maker
        </Typography>
        <AddImageLinkForm
          buttonLabel="ADD"
          placeholder="Add image link"
          submitHandler={handleSaveLink}
        />
        <UploadButton
          action={uploadImage}
          isUploading={imageUploadingState.isUploading}
          handleClick={resetState}
        />
        <Error show={Boolean(imageUploadingState.errorMessage)}>
          <Typography variant="body1">
            There is a problem uploading your image.
          </Typography>
          <Typography variant="body1" className={classes.errorMessage}>
            <strong>Error message:</strong>
          </Typography>
          <Typography variant="body1">
            {imageUploadingState.errorMessage}
          </Typography>
        </Error>
        <ImageList imageLinks={imageLinks} deleteImageLink={deleteImageLink} />
        <FormControlLabel
          className={classes.formControlLabel}
          control={
            <Checkbox
              checked={toLazyload}
              onChange={event => {
                setLazyload(event.target.checked)
              }}
              name="toLazyload"
              color="primary"
            />
          }
          label="enable Lazyload"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={e => {
            const isDataValid =
              Array.isArray(imageLinks) && imageLinks.length > 0
            if (isDataValid) {
              buildCode()
            } else {
              setPopoverAnchorEl(e.currentTarget)
            }
          }}
        >
          GET CODE
        </Button>
        {showProgress ? (
          <LinearProgress className={classes.progressBar} color="primary" />
        ) : null}
        <PopoverHint
          anchorEl={popoverAnchorEl}
          setAnchorEl={setPopoverAnchorEl}
          content="Hint: Add at least 1 image link."
        />
        <EmbeddedCode
          header="Embedded Code"
          description="Place this code wherever you want the plugin to appear on your page."
          code={code}
          buildCodeError={buildCodeError}
        />
      </Container>
      {code ? <Preview code={code} /> : null}
    </Container>
  )
}

const App = () => {
  return (
    <>
      <CssBaseline />
      <Content />
    </>
  )
}

export default App
