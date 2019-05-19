import React, { useEffect, useState } from 'react'
import Contract from 'utils/contract'
import Web3 from 'utils/web3'
import { Button, Input } from 'components'
// import { useWeb3 } from '../providers/useWeb3'

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
  // const [{ theme }, dispatch] = useWeb3()
  // const [roomCode, setRoomCode] = useState(null)
  const [contractInstance, setContractInstance] = useState(null)
  // const [web3Instance, setWeb3Instance] = useState()
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
      await contract.deploy(account, username, value, roomSize)
      setContractInstance(contract)
      // this.getPlayersRegistered()
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
      <p>create</p>
      <Input placeholder="username" onChange={handleInput('username')} />
      <Input
        placeholder="0.0001"
        id="123"
        name="345"
        onChange={handleInput('value')}
      />
      <Input placeholder="roomsize" onChange={handleInput('roomsize')} />
      <Button title="Start" onClick={start} />
    </>
  )
}

export default Create

Create.propTypes = {
  // eslint-disable-next-line react/require-default-props
  //   classes: PropTypes.object
}