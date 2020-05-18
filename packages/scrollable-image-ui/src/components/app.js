import AddImageLinkForm from './form'
import EmbeddedCode from './embedded-code'
import ImageList from './image-list'
import React, { useState } from 'react'
import useImagesState from '../hooks/use-images-state'
import webpackAssets from '@twreporter/orangutan/dist/webpack-assets.json'
import orangutan from '@twreporter/orangutan'
import PopoverHint from './simple-popover'
import Preview from './preview'
// @material-ui
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

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
}))

const Content = () => {
  const classes = useStyles()
  const { imageLinks, addImageLink, deleteImageLink } = useImagesState([])
  const [toLazyload, setLazyload] = useState(false)
  const [code, setCode] = useState(null)
  const [buildCodeError, setBuildCodeError] = useState(null)
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null)

  const buildCode = () => {
    try {
      const code = orangutan.buildScrollableImageEmbeddedCode(
        {
          data: imageLinks,
          lazyload: toLazyload,
        },
        webpackAssets
      )
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
      <Preview code={code} />
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
