import React from 'react'
import PropTypes from 'prop-types'
// import MuiInput from '@material-ui/core/Input'
import TextField from '@material-ui/core/TextField'

function Input(props) {
  const { onChange, placeholder } = props
  return (
    <TextField
      placeholder={placeholder}
      onChange={e => onChange(e)}
      {...props}
    />
  )
}

Input.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired
}
export default Input
