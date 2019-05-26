import React, { useEffect, useState } from 'react'
import { Button, List } from 'components'
import arrayMove from 'array-move'
import { useWeb3 } from '../providers/useWeb3'

const initialPlayerList = ['Loading']
const Room = () => {
  const [state, dispatch] = useWeb3()
  const [listOrder, setListOrder] = useState(initialPlayerList)

  const getPlayersRegistered = async () => {
    const { contractInstance } = state

    let registeredPlayers = null
    try {
      console.log(
        'addresses registered:',
        await contractInstance.getPlayersRegistered()
      )
      registeredPlayers = await contractInstance.getPlayersRegistered()
      setListOrder(registeredPlayers)
    } catch (error) {
      console.error(error)
    }
    return registeredPlayers
  }

  useEffect(() => {
    getPlayersRegistered()
  }, [state.contractInstance])

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
