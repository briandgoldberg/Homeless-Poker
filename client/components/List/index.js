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

const DragHandle = sortableHandle(() => <span>::</span>)

const SortableItem = sortableElement(({ value }) => (
  <MuiListItem button dividers="true">
    <DragHandle />
    <ListItemText primary={value} secondary="Secondary text" />
  </MuiListItem>
))

const SortableContainer = sortableContainer(({ children }) => {
  return <MuiList>{children}</MuiList>
})

function List(props) {
  const { items, onChange } = props

  return (
    // eslint-disable-next-line react/no-this-in-sfc
    <SortableContainer onSortEnd={e => onChange(e)}>
      {items.map((value, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </SortableContainer>
  )
}

List.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}

export default List
