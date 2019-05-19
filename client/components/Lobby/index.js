/* eslint-disable react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
// import MuiButton from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { Button, Card, Input } from 'components'

function Lobby(props) {
  // const { onClick, title } = props
  const { classes, handleInput, join, start } = props
  return (
    <Grid container>
      <Grid item>
        <Typography variant="h4" component="h1" gutterBottom>
          Homeless Poker
        </Typography>
        {/* <Link href="/about" color="secondary">
            Go to the about page
          </Link> */}
      </Grid>
      <Grid item>
        <Input placeholder="username" onChange={handleInput('username')} />
        <Input
          placeholder="0.0001"
          id="123"
          name="345"
          onChange={handleInput('value')}
        />
      </Grid>
      <Grid item>
        <Card classes={classes}>
          <Input placeholder="address" onChange={handleInput('address')} />
          <Input placeholder="roomCode" onChange={handleInput('roomcode')} />
          <Button title="Deposit ether" onClick={join} />
        </Card>
      </Grid>
      <Grid item>
        <Card classes={classes}>
          <Input placeholder="roomsize" onChange={handleInput('roomsize')} />
          <Button title="Start" onClick={start} />
        </Card>
      </Grid>
    </Grid>
  )
}

Lobby.propTypes = {
  // eslint-disable-next-line react/require-default-props
  classes: PropTypes.object,
  handleInput: PropTypes.func.isRequired,
  join: PropTypes.func.isRequired,
  // onClick: PropTypes.func.isRequired,
  // title: PropTypes.string.isRequired,
  start: PropTypes.func.isRequired
  // value: PropTypes.string.isRequired
}
export default Lobby
