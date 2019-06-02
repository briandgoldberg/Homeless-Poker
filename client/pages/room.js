import React, { useEffect, useState } from 'react'
import { Button, Container, List } from 'components'
import arrayMove from 'array-move'
import Web3 from 'utils/web3'
import Contract from 'utils/contract'
import { useWeb3 } from '../providers/useWeb3'

let web3
let contract

try {
  web3 = Web3()
  //   setWeb3Instance(web3) // re-render issue
} catch (err) {
  console.error(err)
}
let transactionConfirmed = false
const Room = () => {
  const [state] = useWeb3()
  const [players, setPlayers] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)

  const getPlayersRegistered = async () => {
    const { instance } = state.contract
    return instance.getPlayersRegistered()
  }

  const getUsernameFromAddress = async address => {
    const { instance } = state.contract
    console.log('address', address)
    const name = await instance.getUsername(address)
    return {
      address,
      name
    }
  }
  useEffect(() => {
    console.log(errorMessage)
  }, errorMessage)
  const vote = async ballot => {
    console.log(ballot)
    try {
      contract = new Contract(web3, state.contract.address)
      const output = await contract.vote(state.user.address, ballot)

      if (output.error) {
        setErrorMessage(output.error)
      } else {
        setMessage('You have voted.')
      }
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract.`)
      setErrorMessage(error)
      console.error(error)
    }
  }
  // const getPrizehandoutForPlace = async place => {
  //   const { instance } = state.contract
  //   const potiumSize = await instance.getPotiumSize()

  //   const prizePool =
  //     (await instance.getRoomSize()) * (await instance.getBuyIn())
  //   return instance.getPrizeForPlace(place, potiumSize, `${prizePool}`)
  // }

  const getRoomInfo = async () => {
    const registeredPlayers = await getPlayersRegistered()
    const playerInfo = await Promise.all(
      registeredPlayers.map(address => getUsernameFromAddress(address))
    )
    setPlayers(playerInfo)
  }

  useEffect(() => {
    state.contract.instance && getRoomInfo()
    if (state.transactionHash) {
      transactionConfirmed = true
    }
  }, [state.contract.instance, state.transactionHash])

  const rearrangeList = ({ oldIndex, newIndex }) => {
    setPlayers(arrayMove(players, oldIndex, newIndex))
  }
  return (
    <>
      <Container>
        <p>
          Please submit who who the tournament. $X will be returned to you if
          you vote with the consensus. We think this is enough of an incentive
          to submit accurate results.
        </p>
        {/* 
           I should create an event that is triggered when the deposit is finished on the contract side:
           so I can let the user know that the transfer is on it's way, will be in the next block
           */}
        {/* TODO: link to be copied to join this room */}
        <p>
          {`http://localhost:3000/join?address=${state.contract.address}&code=${
            state.contract.code
          }`}
        </p>
        {transactionConfirmed && players ? (
          <List items={players} onChange={rearrangeList} />
        ) : (
          <p>Waiting for confirmation, add a spinner here or similar</p>
        )}
        <Button
          title="Vote"
          onClick={() => vote(players.map(p => p.address))}
        />
        {errorMessage ? (
          <h2 style={{ color: 'red' }}>{`${errorMessage}`}</h2>
        ) : (
          ''
        )}
        {message ? <h2>{`${message}`}</h2> : ''}
      </Container>
    </>
  )
}

export default Room
