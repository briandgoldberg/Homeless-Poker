import React from 'react'
import PropTypes from 'prop-types'
import styles from './InformationBox.scss'

function InformationBox(props) {
  // const classes = useStyles()
  const { children, type } = props
  return (
    <>
      <p>Information about this section</p>
    </>
  )
}

InformationBox.propTypes = {
  children: PropTypes.node.isRequired
}

export default InformationBox
