import React from 'react'
import PropTypes from 'prop-types'
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from 'react-sortable-hoc'

import MuiList from '@material-ui/core/List'
import MuiListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Reorder } from '@material-ui/icons'

const DragHandle = sortableHandle(() => <Reorder color="disabled" />)

const SortableItem = sortableElement(({ value }) => (
  <MuiListItem button divider>
    <DragHandle />
    <ListItemText primary={value} secondary="0xADDRESS0123567" />
  </MuiListItem>
))

const SortableContainer = sortableContainer(({ children }) => {
  return (
    <>
      <MuiList>{children}</MuiList>
    </>
  )
})
const PotiumContainer = () => {
  const fakeAmount = ['1.2', '0.56', '0.23']
  const awardAmount = fakeAmount
  return (
    <MuiList>
      {awardAmount.map((value, index) => (
        <MuiListItem divider selected>
          <ListItemText
            primary={`${index + 1}. place`}
            secondary={`${value} ETH`}
          />
        </MuiListItem>
      ))}
    </MuiList>
  )
}

function List(props) {
  const { items, onChange } = props

  return (
    // eslint-disable-next-line react/no-this-in-sfc
    <>
      <PotiumContainer />
      <SortableContainer onSortEnd={e => onChange(e)}>
        {items.map((value, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <SortableItem key={`item-${index}`} index={index} value={value} />
        ))}
      </SortableContainer>
    </>
  )
}

List.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}

export default List
