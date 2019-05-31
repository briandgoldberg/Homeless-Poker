import React, { useEffect, useState } from 'react'
import { Button, Container, List } from 'components'
import arrayMove from 'array-move'
import { useWeb3 } from '../providers/useWeb3'

const initialPlayerList = []
const Room = () => {
  const [state] = useWeb3()
  const [listOrder, setListOrder] = useState(initialPlayerList)

  const getPlayersRegistered = async () => {
    const { instance } = state.contract
    return instance.getPlayersRegistered()
  }

  const getUsernameFromAddress = async address => {
    const { instance } = state.contract
    console.log('address', address)
    const name = await instance.getUsername(address)
    return name
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

    const names = await Promise.all(
      registeredPlayers.map(address => getUsernameFromAddress(address))
    )

    console.log(names)
  }

  useEffect(() => {
    state.contract.instance && getRoomInfo()
    console.log('state change')
    console.log('state change', state)
  }, [state.contract.instance, state])

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
        <List items={listOrder} onChange={rearrangeList} />
        <Button title="Vote" onClick={() => console.log('vote')} />
      </Container>
    </>
  )
}
export default Room
