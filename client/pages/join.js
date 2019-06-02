/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-this-in-sfc */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Container, Input } from 'components'
import Contract from 'utils/contract'
import Router from 'next/router'
import Web3 from 'utils/web3'
import { useWeb3 } from '../providers/useWeb3'
// import '../styles/main.scss'

let web3
let contract

try {
  web3 = Web3()
  //   setWeb3Instance(web3) // re-render issue
} catch (err) {
  console.error(err)
}

const Join = props => {
  const [account, setAccount] = useState(null)
  const [value, setValue] = useState(null)
  const [username, setUsername] = useState(null)
  const [roomCode, setRoomCode] = useState(props.queryCode)
  const [contractAddress, setContractAddress] = useState(props.queryAddress)
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [, dispatch] = useWeb3()

  async function getUserAccount() {
    try {
      const userAccount = (await web3.eth.getAccounts())[0]
      console.log('defaultAccount:', userAccount)
      setAccount(userAccount)
    } catch (error) {
      alert(`Failed to load web3.`)
      console.error(error)
    }
  }

  useEffect(() => {
    getUserAccount()
  }, [])

  const join = async () => {
    try {
      contract = new Contract(web3, contractAddress)
      console.log('join from address', account)
      const output = await contract
        .register(contractAddress, account, username, value, roomCode)
        .then(
          setMessage('Please wait for confirmation, should take around 20s')
        )

      console.log('Join info', output)
      const contractInfo = {
        address: contractAddress,
        code: roomCode,
        instance: contract
      }
      const userInfo = {
        address: account,
        buyIn: value,
        name: username
      }
      dispatch({
        type: 'joinRoom',
        contractInfo,
        userInfo,
        transactionHash: output.transactionHash
      })
      if (!output.error) {
        Router.push('/room')
      } else {
        setErrorMessage(output.error)
      }
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract.`)
      setErrorMessage(error)
      console.error(error)
    }
  }

  const handleInput = type => event => {
    if (type === 'value') {
      setValue(event.target.value)
    } else if (type === 'username') {
      setUsername(event.target.value)
    } else if (type === 'roomcode') {
      setRoomCode(event.target.value)
    } else if (type === 'address') {
      setContractAddress(event.target.value)
    }
  }
  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>
  }
  return (
    <>
      <Container>
        <Input
          label="Username"
          placeholder="Sóparinn"
          onChange={handleInput('username')}
        />
        <Input
          label="ETH amount"
          placeholder="0.0001"
          id="123"
          name="345"
          onChange={handleInput('value')}
        />
        <Input
          label="Contract address"
          placeholder="0x01234ADDRESS"
          onChange={handleInput('address')}
          value={props.queryAddress}
        />
        <Input
          label="4 letter room code"
          placeholder="C0D3"
          onChange={handleInput('roomcode')}
          value={props.queryCode}
        />
        <Button title="Deposit ether" onClick={join} />
        {message ? <h2>{`${message}`}</h2> : ''}
        {errorMessage ? (
          <h2 style={{ color: 'red' }}>{`${errorMessage}`}</h2>
        ) : (
          ''
        )}
      </Container>
    </>
  )
}

Join.getInitialProps = context => {
  let queryAddress
  let queryCode
  if (typeof window === 'undefined') {
    if (context.query && context.query.address && context.query.code) {
      queryAddress = context.query.address
      queryCode = context.query.code
    }
    console.log('Server Side Router Query', queryAddress, queryCode)
  } else {
    console.log('Client side Router Query', context.query)
  }
  return { queryAddress, queryCode }
}

export default Join

Join.propTypes = {
  queryAddress: PropTypes.string,
  queryCode: PropTypes.string
  // eslint-disable-next-line react/require-default-props
  //   classes: PropTypes.object
}

Join.defaultProps = {
  queryAddress: '',
  queryCode: ''
}
