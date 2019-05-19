import React from 'react'
import PropTypes from 'prop-types'
import MuiInput from '@material-ui/core/Input'

function Input(props) {
  const { onChange, placeholder } = props
  return <MuiInput placeholder={placeholder} onChange={e => onChange(e)} />
}

Input.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired
}
export default Input
