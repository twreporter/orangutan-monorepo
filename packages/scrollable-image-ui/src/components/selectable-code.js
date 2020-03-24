import PropTypes from 'prop-types'
import React, { useRef, useEffect } from 'react'
// @material-ui
import TextField from '@material-ui/core/TextField'

const SelectableCode = ({ code }) => {
  const inputRef = useRef()
  const selectText = () => {
    inputRef.current.focus()
    inputRef.current.select()
  }

  useEffect(() => {
    // put a slight time delay in to hint users
    // at first time it pops out
    const timeout = setTimeout(selectText, 200)
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <TextField
      fullWidth
      multiline
      rowsMax={8}
      value={code}
      variant="filled"
      inputRef={inputRef}
      onClick={selectText}
      InputProps={{ disableUnderline: true }}
    />
  )
}

SelectableCode.propTypes = {
  code: PropTypes.string,
}

export default SelectableCode
