import React, { useEffect, useState } from 'react'
import { Button, Container, List } from 'components'
import arrayMove from 'array-move'
import { useWeb3 } from '../providers/useWeb3'

const initialPlayerList = []
let transactionConfirmed = false
const Room = () => {
  const [state] = useWeb3()
  const [listOrder, setListOrder] = useState(initialPlayerList)
  const [players, setPlayers] = useState(undefined)

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

  // const getPrizehandoutForPlace = async place => {
  //   const { instance } = state.contract
  //   const potiumSize = await instance.getPotiumSize()

  //   const prizePool =
  //     (await instance.getRoomSize()) * (await instance.getBuyIn())
  //   return instance.getPrizeForPlace(place, potiumSize, `${prizePool}`)
  // }

  const getRoomInfo = async () => {
    const registeredPlayers = await getPlayersRegistered()
    setListOrder(registeredPlayers)

    const playerInfo = await Promise.all(
      registeredPlayers.map(address => getUsernameFromAddress(address))
    )
    setPlayers(playerInfo)
    console.log(playerInfo)
  }

  useEffect(() => {
    state.contract.instance && getRoomInfo()
    if (state.transactionHash) {
      transactionConfirmed = true
    }
  }, [state.contract.instance, state.transactionHash])

  const rearrangeList = ({ oldIndex, newIndex }) => {
    setListOrder(arrayMove(listOrder, oldIndex, newIndex))
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
        <Button title="Vote" onClick={() => console.log('vote')} />
      </Container>
    </>
  )
}

export default Room
