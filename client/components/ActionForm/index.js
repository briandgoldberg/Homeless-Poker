import React from 'react'
import PropTypes from 'prop-types'
import { Button, InformationBox, Input } from 'components'
import styles from './ActionForm.scss'

function ActionForm(props) {
  // const classes = useStyles()
  const createGame = () => {
    console.log('create games')
  }
  const { children, type } = props
  return (
    <>
      <div className={styles.action_container}>
        <div className={styles.information_section}>
          <h3 className={styles.title}>Title</h3>
          <InformationBox>
            <p>Information about this section</p>
          </InformationBox>
        </div>
        <div className={styles.input_section}>
          <Input />
          <Input />
        </div>
      </div>
      <Button
        className={styles.button}
        title={"Let's go"}
        handleClick={createGame()}
      />
    </>
  )
}

ActionForm.propTypes = {
  children: PropTypes.node.isRequired
}

export default ActionForm
