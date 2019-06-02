import React, { useEffect, useState } from 'react'
import Contract from 'utils/contract'
import Web3 from 'utils/web3'
// import Link from 'next/link'
import Router from 'next/router'
import { Button, Container, Input } from 'components'
import { useWeb3 } from '../providers/useWeb3'

let web3
let contract

try {
  web3 = Web3()
} catch (err) {
  console.error(err)
}
const Create = () => {
  const [account, setAccount] = useState(null)
  const [value, setValue] = useState(null)
  const [username, setUsername] = useState(null)
  const [roomSize, setRoomSize] = useState(null)
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
      const output = await contract.deploy(account, username, value, roomSize)
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
      // output.unsubscribe(function(error, success) {
      //   if (success) console.log('Successfully unsubscribed!')
      // })

      if (!output.error) {
        Router.push('/room')
      } else {
        console.log('ERRORRRRRRRRR', output.error)
      }
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract.`)
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
    }
  }

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>
  }
  return (
    <>
      <Container>
        <h1>create</h1>
        <Input
          label="Username"
          placeholder="Satoshison"
          onChange={handleInput('username')}
        />
        <Input
          label="ETH amount"
          placeholder="0.0001"
          id="123"
          onChange={handleInput('value')}
        />
        <Input
          label="Room size"
          placeholder="5"
          onChange={handleInput('roomsize')}
        />
        {/* <Link href="/room">
          <a> */}
        <Button title="Start" onClick={start} />
        {/* TODO: when button has been clicked and we're waitiing for confirmation, show message */}
        {/* </a>
        </Link> */}
      </Container>
    </>
  )
}

export default Create

Create.propTypes = {
  // eslint-disable-next-line react/require-default-props
  //   classes: PropTypes.object
}
