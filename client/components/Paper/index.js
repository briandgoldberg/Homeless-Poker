import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'

function PaperSheet(props) {
  return <Paper elevation={1}>{props.children}</Paper>
}

PaperSheet.propTypes = {
  children: PropTypes.any
}

export default PaperSheet
