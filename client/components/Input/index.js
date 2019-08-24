import React from 'react'
import PropTypes from 'prop-types'
// import MuiInput from '@material-ui/core/Input'
import TextField from '@material-ui/core/TextField'
import styles from './Input.module.scss'

function Input(props) {
  const { className, onChange, placeholder } = props
  return (
    // <div>
    <TextField
      className={className}
      placeholder={placeholder}
      onChange={() => onChange}
      {...props}
    />
    // </div>
  )
}

Input.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired
}
export default Input
