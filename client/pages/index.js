/* eslint-disable react/style-prop-object */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Web3 from 'utils/web3'
import Contract from 'utils/contract'
import Router from 'next/router'
import Link from 'next/link'

import { ActionForm, Button, Container, Header, Input } from 'components'
import { useWeb3 } from '../providers/useWeb3'

import styles from '../styles/index.scss'

let web3
let contract

try {
  web3 = Web3()
} catch (err) {
  console.error(err)
}

const Index = props => {
  const [account, setAccount] = useState(null)
  const [value, setValue] = useState(null)
  const [username, setUsername] = useState(null)
  const [roomSize, setRoomSize] = useState(null)
  const [roomCode, setRoomCode] = useState(props.queryCode)
  const [contractAddress, setContractAddress] = useState(props.queryAddress)
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [, dispatch] = useWeb3()

  async function getUserAccount() {
    try {
      const userAccount = (await web3.eth.getAccounts())[0]
      console.log(userAccount)
      setAccount(userAccount)
    } catch (error) {
      alert(`Failed to load web3.`)
      console.error(error)
    }
  }

  useEffect(() => {
    getUserAccount()
  }, [])

  const start = async () => {
    try {
      contract = new Contract(web3)
      // TODO: Set a message: Please accept the transaction in (...Metamask), it doesnt always pop up.
      const output = await contract
        .deploy(account, username, value, roomSize)
        .then(
          setMessage('Please wait for confirmation, should take around 20s')
        )
      console.log('Deploy info', output)

      const contractInfo = {
        address: output.contractAddress,
        code: output.roomCode,
        instance: contract
      }
      const userInfo = {
        address: account,
        buyIn: value,
        name: username
      }
      dispatch({
        type: 'createRoom',
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
    } else if (type === 'roomsize') {
      setRoomSize(event.target.value)
    } else if (type === 'roomcode') {
      setRoomCode(event.target.value)
    } else if (type === 'address') {
      setContractAddress(event.target.value)
    }
  }

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>
  }
  if (!web3.givenProvider) {
    return (
      <div>Found no Web3 provider, try installing the Metamask extension</div>
    )
  }

  return (
    <>
      <Container>
        <Header title="Homeless Poker" subtitle="No Need for a house">
          <p>What should we call you?</p>
          <Input
            className={styles.input_user}
            placeholder="Satoshison"
            label="Username"
            type="Username"
            onChange={handleInput('username')}
          />
        </Header>
        {/* TODO: Show error messages here if web3 not found */}
        <ActionForm type="join" handleInput={handleInput} onSubmit={join} />
        <ActionForm type="create" handleInput={handleInput} onSubmit={start} />
      </Container>
    </>
  )
}
Index.getInitialProps = context => {
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

export default Index

Index.propTypes = {
  queryAddress: PropTypes.string,
  queryCode: PropTypes.string
  // eslint-disable-next-line react/require-default-props
  // classes: PropTypes.object
}

Index.defaultProps = {
  queryAddress: '',
  queryCode: ''
}
