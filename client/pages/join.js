import React, { useEffect, useState } from 'react'
import { Button, Input } from 'components'
import Contract from 'utils/contract'
import Link from 'next/link'
import Web3 from 'utils/web3'
import { useWeb3 } from '../providers/useWeb3'

let web3
let contract

try {
  web3 = Web3()
  //   setWeb3Instance(web3) // re-render issue
} catch (err) {
  console.error(err)
}
const Join = () => {
  const [account, setAccount] = useState(null)
  const [value, setValue] = useState(null)
  const [username, setUsername] = useState(null)
  const [roomCode, setRoomCode] = useState(null)
  const [contractAddress, setContractAddress] = useState(null)
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
      await contract.register(
        contractAddress,
        account,
        username,
        value,
        roomCode
      )
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
      dispatch({ type: 'joinRoom', contractInfo, userInfo })
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
      <Input placeholder="username" onChange={handleInput('username')} />
      <Input
        placeholder="0.0001"
        id="123"
        name="345"
        onChange={handleInput('value')}
      />
      <Input placeholder="address" onChange={handleInput('address')} />
      <Input placeholder="roomCode" onChange={handleInput('roomcode')} />
      <Link href="/room">
        <a>
          <Button title="Deposit ether" onClick={join} />
        </a>
      </Link>
    </>
  )
}

export default Join

Join.propTypes = {
  // eslint-disable-next-line react/require-default-props
  //   classes: PropTypes.object
}
