import React from 'react'
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
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired
}

Button.defaultProps = {
  onClick: () => {}
}

export default Button
