import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import React, { Component } from 'react'
import * as Link from '../src/Link'

const Input = (placeholder, onChange) => (
  <input placeholder={placeholder} onChange={onChange()} />
)

const Button = (title, onClick) => (
  <button type="submit" onClick={onClick()}>
    {title}
  </button>
)

export default class Index extends Component {
  render() {
    const { contractAddress, value } = this.state
    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Next.js v4-alpha example
          </Typography>
          <Link href="/about" color="secondary">
            Go to the about page
          </Link>
          <Button title="Start" onClick={() => this.start()} />
          <Input placeholder="address" onChange={e => this.handleAddress(e)} />
          <Input placeholder="0.0001" onChange={e => this.handleValue(e)} />
          <Button
            title="Deposit ether"
            onClick={() =>
              value && this.join(contractAddress, 'name', value, 'TEST')
            }
          />
        </Box>
      </Container>
    )
  }
}
