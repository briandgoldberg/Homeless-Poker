import React from 'react'
import PropTypes from 'prop-types'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'
// // import get from 'lodash/get'

import MuiList from '@material-ui/core/List'
import MuiListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const SortableItem = sortableElement(({ value }) => (
  <MuiListItem button dividers>
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
  //   children: PropTypes.any
  // eslint-disable-next-line react/forbid-prop-types
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}

export default List
