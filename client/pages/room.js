import React, { useEffect, useState } from 'react'
import { Button, List } from 'components'
import arrayMove from 'array-move'
import { useWeb3 } from '../providers/useWeb3'

const initialPlayerList = ['Loading']
const Room = () => {
  const [state] = useWeb3()
  const [listOrder, setListOrder] = useState(initialPlayerList)

  const getPlayersRegistered = async () => {
    const { instance } = state.contract

    let registeredPlayers = null

    try {
      registeredPlayers = await instance.getPlayersRegistered()
      setListOrder(registeredPlayers)
    } catch (error) {
      console.error(error)
    }
    return registeredPlayers
  }

  const getPrizehandoutForPlace = async place => {
    const { instance } = state.contract
    const potiumSize = await instance.getPotiumSize()
    const prizePool =
      (await instance.getRoomSize()) * (await instance.getBuyIn())
    return instance.getPrizeForPlace(place, potiumSize, `${prizePool}`)
  }

  useEffect(() => {
    state.contract.instance && getPlayersRegistered()
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
