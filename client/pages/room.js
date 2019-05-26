import React, { useState } from 'react'
import { Button, List } from 'components'
import arrayMove from 'array-move'

const mockRegisteredPlayer = ['einar', 'sveinar', 'geinar', 'meinar']
const Room = () => {
  const [listOrder, setListOrder] = useState(mockRegisteredPlayer)
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
