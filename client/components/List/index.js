// import React, { Fragment } from 'react'
// import PropTypes from 'prop-types'
// import Paper from '@material-ui/core/Paper'
// import get from 'lodash/get'

// import List from '@material-ui/core/List'
// import ListItem from '@material-ui/core/ListItem'
// import { emojis } from 'data'

// const handleClick = e => {
//   console.log('clickHandler', e)
// }
// const getEmoji = type => {
//   const emoji = get(emojis.find(e => e.type === type), 'emoji')
//   return emoji || ''
// }
// function ListWrapper(props) {
//   const { content } = props
//   return (
//     <List>
//       {content.map((data, i) => (
//         <Paper key={i}>
//           <ListItem onClick={handleClick} key={i} button divider>
//             <p>{data.title}</p>
//             <p>{data.location}</p>
//             <p>{data.type}</p>
//             <p>{data.timestamp}</p>
//             <p>{getEmoji(data.type)}</p>
//             <p>{data.link}</p>
//           </ListItem>
//         </Paper>
//       ))}
//     </List>
//   )
// }

// ListWrapper.propTypes = {
//   children: PropTypes.any
// }

// export default ListWrapper
