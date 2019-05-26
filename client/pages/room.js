import React, { useState } from 'react'
import { Button, List } from 'components'
import arrayMove from 'array-move'
import { useWeb3 } from '../providers/useWeb3'

const mockRegisteredPlayer = ['einar', 'sveinar', 'geinar', 'meinar']
const Room = () => {
  const [state, dispatch] = useWeb3()
  const [listOrder, setListOrder] = useState(mockRegisteredPlayer)
  console.log(state)
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
