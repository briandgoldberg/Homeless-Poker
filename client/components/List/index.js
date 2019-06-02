/* eslint-disable react/forbid-prop-types */
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
import styles from './List.scss'

const DragHandle = sortableHandle(() => <Reorder color="disabled" />)

const SortableItem = sortableElement(({ value: { address, name } }) => (
  <MuiListItem button divider>
    <DragHandle />
    <ListItemText primary={name} secondary={address} />
  </MuiListItem>
))

const SortableContainer = sortableContainer(({ children }) => {
  return (
    <>
      <MuiList>{children}</MuiList>
    </>
  )
})
const PotiumContainer = props => {
  const { potium } = props
  return (
    <MuiList>
      {potium.map((value, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <MuiListItem key={index} divider selected>
          <ListItemText primary=" " secondary={`${value} ETH`} />
        </MuiListItem>
      ))}
    </MuiList>
  )
}

function List(props) {
  const { items, onChange, potium } = props
  return (
    // eslint-disable-next-line react/no-this-in-sfc
    <div className={styles.container}>
      <div className={styles.potium}>
        <PotiumContainer potium={potium} />
      </div>
      <div className={styles.players}>
        <SortableContainer onSortEnd={e => onChange(e)}>
          {items.map((value, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <SortableItem key={`item-${index}`} index={index} value={value} />
          ))}
        </SortableContainer>
      </div>
    </div>
  )
}

List.propTypes = {
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  potium: PropTypes.array.isRequired
}

export default List
