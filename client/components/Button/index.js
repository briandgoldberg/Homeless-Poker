import React from 'react'
import PropTypes from 'prop-types'
import MuiButton from '@material-ui/core/Button'
import styles from './Button.module.scss'

function Button(props) {
  const { className, onClick, title } = props
  return (
    <MuiButton
      className={`${className} ${styles.default}`}
      variant="contained"
      color="primary"
      onClick={() => onClick()}
    >
      {title}
    </MuiButton>
  )
}

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired
}

Button.defaultProps = {
  className: '',
  onClick: () => {}
}

export default Button
