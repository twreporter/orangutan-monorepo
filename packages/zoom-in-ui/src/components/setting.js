import PropTypes from 'prop-types'
import React from 'react'
import useTabState from '../hooks/use-tab-state'
// @material-ui
import MenuItem from '@material-ui/core/MenuItem'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles, withStyles } from '@material-ui/core/styles'

const positionsEnum = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
}

const fieldType = {
  image: 'image',
  overlay: 'overlay',
  caption: 'caption',
}

const textFields = {
  marginTop: {
    label: 'margin-top(px)',
    name: 'marginTop',
  },
  marginBottom: {
    label: 'margin-bottom(px)',
    name: 'marginBottom',
  },
  marginLeft: {
    label: 'margin-left(px)',
    name: 'marginLeft',
  },
  marginRight: {
    label: 'margin-right(px)',
    name: 'marginRight',
  },
  background: {
    label: 'background',
    name: 'background',
  },
  opacity: {
    label: 'opacity',
    name: 'opacity',
  },
  zIndex: {
    label: 'z-index',
    name: 'zIndex',
  },
  side: {
    label: 'side',
    name: 'side',
  },
  align: {
    label: 'align',
    name: 'align',
  },
  fontSize: {
    label: 'font-size(px)',
    name: 'fontSize',
  },
  lineHeight: {
    label: 'line-height(px)',
    name: 'lineHeight',
  },
  letterSpacing: {
    label: 'letter-spacing(px)',
    name: 'letterSpacing',
  },
  color: {
    label: 'color',
    name: 'color',
  },
  fontFamily: {
    label: 'font-family',
    name: 'fontFamily',
  },
  width: {
    label: 'width',
    name: 'width',
  },
}

const tabsLabel = ['HD', 'DESKTOP', 'TABLET', 'MOBILE']

const positions = [
  positionsEnum.top,
  positionsEnum.bottom,
  positionsEnum.left,
  positionsEnum.right,
]

const useStyles = makeStyles(theme => ({
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
  preferences: {
    padding: '20px',
  },
  title: {
    color: 'rgba(0, 0, 0, 0.54)',
    borderLeft: 'solid 4px rgba(0, 0, 0, 0.54)',
    paddingLeft: '10px',
  },
  textField: {
    margin: '10px 5px',
  },
  block: {
    marginBottom: '20px',
  },
}))

const StyledTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: 'rgb(166, 122, 68)',
  },
})(Tabs)

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    '&:hover': {
      color: 'rgb(166, 122, 68)',
      opacity: 1,
    },
    '&$selected': {
      color: 'rgb(166, 122, 68)',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: 'rgb(166, 122, 68)',
    },
  },
  selected: {},
}))(props => <Tab disableRipple {...props} />)

const Settings = ({ updateTheme, theme, caption }) => {
  const classes = useStyles()
  const { tabIndex, setTabIndex, targetDevice } = useTabState(0)

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  const handleTextChange = (event, { type, name }) => {
    updateTheme({
      [targetDevice]: {
        [type]: {
          [name]: event.target.value,
        },
      },
    })
  }

  const handleBlur = (event, { type, name }) => {
    const targetValue = event.target.value
    const value = isNaN(targetValue) ? targetValue : Number(targetValue)
    updateTheme({
      [targetDevice]: {
        [type]: {
          [name]: value,
        },
      },
    })
  }

  const showCaptionConfig = () => {
    return caption !== '' && targetDevice !== 'mobile'
  }

  const currentTheme = theme[targetDevice]

  return (
    <div className={classes.tabs}>
      <StyledTabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="on"
      >
        {tabsLabel.map((label, index) => (
          <StyledTab key={label} label={label} />
        ))}
      </StyledTabs>
      <div className={classes.preferences}>
        <div className={classes.block}>
          <Typography
            className={classes.title}
            variant="body1"
            component="div"
            gutterBottom
          >
            image
          </Typography>
          <TextField
            className={classes.textField}
            variant="outlined"
            label={textFields.marginTop.label}
            value={currentTheme.image.marginTop}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={event =>
              handleTextChange(event, {
                type: fieldType.image,
                name: textFields.marginTop.name,
              })
            }
            onBlur={event =>
              handleBlur(event, {
                type: fieldType.image,
                name: textFields.marginTop.name,
              })
            }
          />
          <TextField
            className={classes.textField}
            variant="outlined"
            label={textFields.marginRight.label}
            value={currentTheme.image.marginRight}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={event =>
              handleTextChange(event, {
                type: fieldType.image,
                name: textFields.marginRight.name,
              })
            }
            onBlur={event =>
              handleBlur(event, {
                type: fieldType.image,
                name: textFields.marginRight.name,
              })
            }
          />
          <TextField
            className={classes.textField}
            variant="outlined"
            label={textFields.marginBottom.label}
            value={currentTheme.image.marginBottom}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={event =>
              handleTextChange(event, {
                type: fieldType.image,
                name: textFields.marginBottom.name,
              })
            }
            onBlur={event =>
              handleBlur(event, {
                type: fieldType.image,
                name: textFields.marginBottom.name,
              })
            }
          />
          <TextField
            className={classes.textField}
            variant="outlined"
            label={textFields.marginLeft.label}
            value={currentTheme.image.marginLeft}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={event =>
              handleTextChange(event, {
                type: fieldType.image,
                name: textFields.marginLeft.name,
              })
            }
            onBlur={event =>
              handleBlur(event, {
                type: fieldType.image,
                name: textFields.marginLeft.name,
              })
            }
          />
        </div>
        <div className={classes.block}>
          <Typography
            className={classes.title}
            variant="body1"
            component="div"
            gutterBottom
          >
            overlay
          </Typography>
          <TextField
            className={classes.textField}
            variant="outlined"
            label={textFields.background.label}
            value={currentTheme.overlay.background}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={event =>
              handleTextChange(event, {
                type: fieldType.overlay,
                name: textFields.background.name,
              })
            }
          />
          <TextField
            className={classes.textField}
            variant="outlined"
            label={textFields.opacity.label}
            value={currentTheme.overlay.opacity}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={event =>
              handleTextChange(event, {
                type: fieldType.overlay,
                name: textFields.opacity.name,
              })
            }
            onBlur={event =>
              handleBlur(event, {
                type: fieldType.overlay,
                name: textFields.opacity.name,
              })
            }
          />
          <TextField
            className={classes.textField}
            variant="outlined"
            label={textFields.zIndex.label}
            value={currentTheme.overlay.zIndex}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={event =>
              handleTextChange(event, {
                type: fieldType.overlay,
                name: textFields.zIndex.name,
              })
            }
            onBlur={event =>
              handleBlur(event, {
                type: fieldType.overlay,
                name: textFields.zIndex.name,
              })
            }
          />
        </div>
        {showCaptionConfig() ? (
          <div className={classes.block}>
            <Typography
              className={classes.title}
              variant="body1"
              component="div"
              gutterBottom
            >
              caption
            </Typography>
            <TextField
              select
              className={classes.textField}
              label={textFields.side.label}
              value={currentTheme.caption.side}
              variant="outlined"
              fullWidth
              style={{
                width: '97%',
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={event =>
                handleTextChange(event, {
                  type: fieldType.caption,
                  name: textFields.side.name,
                })
              }
            >
              {positions.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              className={classes.textField}
              label={textFields.align.label}
              value={currentTheme.caption.align}
              variant="outlined"
              fullWidth
              style={{
                width: '97%',
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={event =>
                handleTextChange(event, {
                  type: fieldType.caption,
                  name: textFields.align.name,
                })
              }
            >
              {positions.map(option => {
                if (
                  currentTheme.caption.side === positionsEnum.top ||
                  currentTheme.caption.side === positionsEnum.bottom
                ) {
                  if (
                    option === positionsEnum.top ||
                    option === positionsEnum.bottom
                  )
                    return
                } else {
                  if (
                    option === positionsEnum.left ||
                    option === positionsEnum.right
                  )
                    return
                }
                return (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                )
              })}
            </TextField>
            <TextField
              className={classes.textField}
              variant="outlined"
              label={textFields.marginTop.label}
              value={currentTheme.caption.marginTop}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={event =>
                handleTextChange(event, {
                  type: fieldType.caption,
                  name: textFields.marginTop.name,
                })
              }
              onBlur={event =>
                handleBlur(event, {
                  type: fieldType.caption,
                  name: textFields.marginTop.name,
                })
              }
            />
            <TextField
              className={classes.textField}
              variant="outlined"
              label={textFields.marginRight.label}
              value={currentTheme.caption.marginRight}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={event =>
                handleTextChange(event, {
                  type: fieldType.caption,
                  name: textFields.marginRight.name,
                })
              }
              onBlur={event =>
                handleBlur(event, {
                  type: fieldType.caption,
                  name: textFields.marginRight.name,
                })
              }
            />
            <TextField
              className={classes.textField}
              variant="outlined"
              label={textFields.marginBottom.label}
              value={currentTheme.caption.marginBottom}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={event =>
                handleTextChange(event, {
                  type: fieldType.caption,
                  name: textFields.marginBottom.name,
                })
              }
              onBlur={event =>
                handleBlur(event, {
                  type: fieldType.caption,
                  name: textFields.marginBottom.name,
                })
              }
            />
            <TextField
              className={classes.textField}
              variant="outlined"
              label={textFields.marginLeft.label}
              value={currentTheme.caption.marginLeft}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={event =>
                handleTextChange(event, {
                  type: fieldType.caption,
                  name: textFields.marginLeft.name,
                })
              }
              onBlur={event =>
                handleBlur(event, {
                  type: fieldType.caption,
                  name: textFields.marginLeft.name,
                })
              }
            />
            <TextField
              className={classes.textField}
              variant="outlined"
              label={textFields.fontSize.label}
              value={currentTheme.caption.fontSize}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={event =>
                handleTextChange(event, {
                  type: fieldType.caption,
                  name: textFields.fontSize.name,
                })
              }
              onBlur={event =>
                handleBlur(event, {
                  type: fieldType.caption,
                  name: textFields.fontSize.name,
                })
              }
            />
            <TextField
              className={classes.textField}
              variant="outlined"
              label={textFields.lineHeight.label}
              value={currentTheme.caption.lineHeight}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={event =>
                handleTextChange(event, {
                  type: fieldType.caption,
                  name: textFields.lineHeight.name,
                })
              }
              onBlur={event =>
                handleBlur(event, {
                  type: fieldType.caption,
                  name: textFields.lineHeight.name,
                })
              }
            />
            <TextField
              className={classes.textField}
              variant="outlined"
              label={textFields.letterSpacing.label}
              value={currentTheme.caption.letterSpacing}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={event =>
                handleTextChange(event, {
                  type: fieldType.caption,
                  name: textFields.letterSpacing.name,
                })
              }
              onBlur={event =>
                handleBlur(event, {
                  type: fieldType.caption,
                  name: textFields.letterSpacing.name,
                })
              }
            />
            <TextField
              className={classes.textField}
              variant="outlined"
              label={textFields.color.label}
              value={currentTheme.caption.color}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={event =>
                handleTextChange(event, {
                  type: fieldType.caption,
                  name: textFields.color.name,
                })
              }
            />
            <TextField
              className={classes.textField}
              variant="outlined"
              label={textFields.fontFamily.label}
              value={currentTheme.caption.fontFamily}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={event =>
                handleTextChange(event, {
                  type: fieldType.caption,
                  name: textFields.fontFamily.name,
                })
              }
            />
            <TextField
              className={classes.textField}
              variant="outlined"
              label={textFields.width.label}
              value={currentTheme.caption.width}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={event =>
                handleTextChange(event, {
                  type: fieldType.caption,
                  name: textFields.width.name,
                })
              }
              onBlur={event =>
                handleBlur(event, {
                  type: fieldType.caption,
                  name: textFields.width.name,
                })
              }
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

Settings.propTypes = {
  updateTheme: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    image: PropTypes.shape({
      marginTop: PropTypes.number,
      marginBottom: PropTypes.number,
      marginLeft: PropTypes.number,
      marginRight: PropTypes.number,
    }),
    overlay: PropTypes.shape({
      background: PropTypes.string,
      opacity: PropTypes.number,
      zIndex: PropTypes.number,
    }),
    caption: PropTypes.shape({
      marginTop: PropTypes.number,
      marginBottom: PropTypes.number,
      marginLeft: PropTypes.number,
      marginRight: PropTypes.number,
      fontSize: PropTypes.number,
      lineHeight: PropTypes.number,
      letterSpacing: PropTypes.number,
      color: '#000',
      fontFamily: PropTypes.string,
      offset: PropTypes.number,
      showCaptionWhenZoomOut: PropTypes.bool,
    }),
    zoomOptions: PropTypes.shape({
      transitionDuration: PropTypes.number,
      transitionFunction: PropTypes.string,
      scrollOffset: PropTypes.number,
    }),
    frame: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
    }),
  }),
  caption: PropTypes.string,
}

export default Settings
