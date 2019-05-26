import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import MuiButton from '@material-ui/core/Button'

function Button(props) {
  const { href, onClick, title } = props
  return (
    <MuiButton variant="contained" color="primary" onClick={() => onClick()}>
      <Link href={href}>{title}</Link>
    </MuiButton>
  )
}

Button.propTypes = {
  // eslint-disable-next-line react/require-default-props
  href: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}
Button.defaultProps = {
  href: ''
}
export default Button
