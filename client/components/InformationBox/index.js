import React from 'react'
import PropTypes from 'prop-types'
import styles from './InformationBox.scss'

function InformationBox(props) {
  // const classes = useStyles()
  const { children, type } = props
  return (
    <div className={styles.container}>
      <p>Information about this section</p>
    </div>
  )
}

InformationBox.propTypes = {
  children: PropTypes.node.isRequired
}

export default InformationBox
