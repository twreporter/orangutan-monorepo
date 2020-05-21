import React, { useReducer } from 'react'
import PropTypes from 'prop-types'
// @material-ui
import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import LinearProgress from '@material-ui/core/LinearProgress'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
// lodash
import get from 'lodash/get'

const _ = {
  get,
}

const useStyles = makeStyles({
  root: {
    '& .MuiTextField-root': {
      margin: '8px 0',
    },
  },
  buttonGroup: {
    marginTop: '10px',
    textAlign: 'right',
  },
})

function initFormValuesState({ nOfSheetFields }) {
  const sheetsCount = nOfSheetFields === 'dynamic' ? 1 : nOfSheetFields
  const sheets = []
  for (let i = 0; i < sheetsCount; i++) {
    sheets.push('')
  }
  return {
    spreadsheet: '',
    sheets,
  }
}

const actionTypes = {
  updateSpreadsheet: 'updateSpreadsheet',
  updateSheet: 'updateSheet',
  deleteSheet: 'deleteSheet',
  insertSheet: 'insertSheet',
}

function remove(array = [], index) {
  const result = [...array]
  result.splice(index, 1)
  return result
}

function insert(array = [], index, element) {
  const result = [...array]
  result.splice(index + 1, 0, element)
  return result
}

function formValuesReducer(state, action) {
  switch (action.type) {
    case actionTypes.updateSpreadsheet: {
      const { spreadsheetId } = action.payload
      return {
        ...state,
        spreadsheet: spreadsheetId,
      }
    }
    case actionTypes.updateSheet: {
      const { sheetId, index } = action.payload
      const nextSheets = [...state.sheets]
      nextSheets[index] = sheetId
      return {
        ...state,
        sheets: nextSheets,
      }
    }
    case actionTypes.insertSheet: {
      const { sheetId, index } = action.payload
      return {
        ...state,
        sheets: insert(state.sheets, index, sheetId),
      }
    }
    case actionTypes.deleteSheet: {
      const { index } = action.payload
      return {
        ...state,
        sheets: remove(state.sheets, index),
      }
    }
    default:
      return state
  }
}

/**
 * Parse spreadsheet id from url. Example:
 * 'https://docs.google.com/spreadsheets/d/xxxxxxxxx/edit#gid=0'
 * 'https://drive.google.com/open?id=xxxxxxxxx&ww=ppp'
 * 'https://docs.google.com/spreadsheets/u/1/d/xxxxxxxxx/edit#gid=0'
 * -> 'xxxxxxxxx'
 * If the input string does not match the pattern, it will return the original string.
 *
 * @param {string} [input='']
 * @returns {string}
 */
function getSpreadsheetIdFromUrl(input = '') {
  const matchIdInDocsUrl = input.match(/spreadsheets\/(?:[\w-]+\/)*d\/([\w-]+)/)
  const matchIdInDriveUrl = input.match(/[&?]id=([a-zA-Z0-9-_]+)/)
  return _.get(matchIdInDocsUrl, '1') || _.get(matchIdInDriveUrl, '1') || input
}

function renderFixedSheetFields(sheets, formValuesDispatch) {
  const sheetsCount = sheets.length
  if (!sheetsCount) {
    return null
  }
  const fields = []
  for (let i = 0; i < sheetsCount; i++) {
    fields.push(
      <TextField
        label={`Sheet ${i + 1} ID`}
        key={`${i}-sheet`}
        variant="outlined"
        fullWidth
        value={sheets[i]}
        onChange={e => {
          formValuesDispatch({
            type: actionTypes.updateSheet,
            payload: {
              index: i,
              sheetId: e.target.value,
            },
          })
        }}
      />
    )
  }
  return fields
}

function renderDynamicSheetFields(sheets, formValuesDispatch) {
  const sheetsCount = sheets.length
  const fields = []
  for (let i = 0; i < sheetsCount; i++) {
    fields.push(
      <TextField
        label={`Sheet ${i + 1} ID`}
        key={`${i}-sheet`}
        variant="outlined"
        fullWidth
        value={sheets[i]}
        onChange={e => {
          formValuesDispatch({
            type: actionTypes.updateSheet,
            payload: {
              index: i,
              sheetId: e.target.value,
            },
          })
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {i === 0 ? null : (
                <Tooltip title="remove">
                  <IconButton
                    onClick={() => {
                      formValuesDispatch({
                        type: actionTypes.deleteSheet,
                        payload: {
                          index: i,
                        },
                      })
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="insert below">
                <IconButton
                  onClick={() => {
                    formValuesDispatch({
                      type: actionTypes.insertSheet,
                      payload: {
                        sheetId: '',
                        index: i,
                      },
                    })
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    )
  }
  return fields
}

export default function Form({ nOfSheetFields, handleSubmit, isSubmitting }) {
  const [formValuesState, formValuesDispatch] = useReducer(
    formValuesReducer,
    { nOfSheetFields },
    initFormValuesState
  )
  const styles = useStyles()
  return (
    <form
      className={styles.root}
      onSubmit={e => {
        e.preventDefault()
        handleSubmit(formValuesState)
        return false
      }}
    >
      <TextField
        label="Spreadsheet ID or URL"
        variant="outlined"
        fullWidth
        value={formValuesState.spreadsheet}
        onChange={e => {
          formValuesDispatch({
            type: actionTypes.updateSpreadsheet,
            payload: {
              spreadsheetId: e.target.value,
            },
          })
        }}
        onBlur={() => {
          const input = formValuesState.spreadsheet
          const id = getSpreadsheetIdFromUrl(input)
          if (id !== input) {
            formValuesDispatch({
              type: actionTypes.updateSpreadsheet,
              payload: {
                spreadsheetId: id,
              },
            })
          }
        }}
      />
      {nOfSheetFields === 'dynamic'
        ? renderDynamicSheetFields(formValuesState.sheets, formValuesDispatch)
        : renderFixedSheetFields(formValuesState.sheets, formValuesDispatch)}
      {isSubmitting ? <LinearProgress color="secondary" /> : null}
      <div className={styles.buttonGroup}>
        <Button
          variant="contained"
          disabled={isSubmitting}
          color="primary"
          size="large"
          type="submit"
        >
          Build
        </Button>
      </div>
    </form>
  )
}

Form.propTypes = {
  nOfSheetFields: PropTypes.oneOfType([
    PropTypes.oneOf(['dynamic']),
    PropTypes.number,
  ]),
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
}

Form.defaultProps = {
  nOfSheetFields: 'dynamic',
  isSubmitting: false,
  handleSubmit: () => {},
}
