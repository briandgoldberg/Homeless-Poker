import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import MuiButton from '@material-ui/core/Button'

function Button(props) {
  const { onClick, title } = props
  return (
    <MuiButton variant="contained" color="primary" onClick={() => onClick()}>
      {title}
    </MuiButton>
  )
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default Button
