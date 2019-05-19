import React from 'react'
import PropTypes from 'prop-types'
import MuiCard from '@material-ui/core/Card'
import MuiCardContent from '@material-ui/core/CardContent'

function Card(props) {
  const { children, classes } = props
  return (
    <MuiCard className={classes.card} color="primary">
      <MuiCardContent>{children}</MuiCardContent>
    </MuiCard>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired
}

export default Card
