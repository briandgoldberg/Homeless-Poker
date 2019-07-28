import React from 'react'
import PropTypes from 'prop-types'
import styles from './Header.scss'

function Header(props) {
  const { children, title, subtitle } = props
  return (
    <>
      <div className={styles.container}>
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
        <div className={styles.content}>{children}</div>
      </div>
    </>
  )
}

Header.propTypes = {
  children: PropTypes.node.isRequired
}

export default Header
