import React, { useEffect, useState } from 'react'
import { Button, List } from 'components'
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

    // TODO:
    console.log(listOrder.map(async address => getUsernameFromAddress(address)))
  }

  useEffect(() => {
    state.contract.instance && getRoomInfo()
  }, [state.contract.instance])

  const rearrangeList = ({ oldIndex, newIndex }) => {
    setListOrder(arrayMove(listOrder, oldIndex, newIndex))
  }
  return (
    <>
      <List items={listOrder} onChange={rearrangeList} />
      <Button title="Vote" onClick={() => console.log('vote')} />
    </>
  )
}
export default Room
