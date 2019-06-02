import React from 'react'
import PropTypes from 'prop-types'
import styles from './Container.scss'

function Container(props) {
  // const classes = useStyles()
  const { children } = props
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}

Container.propTypes = {
  children: PropTypes.node.isRequired
}

export default Container
