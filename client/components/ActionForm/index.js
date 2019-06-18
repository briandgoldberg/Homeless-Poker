import React from 'react'
import PropTypes from 'prop-types'
import styles from './ActionForm.scss'

function ActionForm(props) {
  // const classes = useStyles()
  const { children, type } = props
  return (
    <>
      <div className="informationSection">
        <h3>Title</h3>
        <InformationBox>
          <p>Information about this section</p>
        </InformationBox>
      </div>
      <div className="inputSection">
        <Input />
        <Input />
      </div>
      <Button text={"Let's go"} handleClick={createGame()} />
    </>
  )
}

ActionForm.propTypes = {
  children: PropTypes.node.isRequired
}

export default ActionForm
