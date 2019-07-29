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
        <h3 className={styles.title}>{type}</h3>
        <div className={styles.information_section}>
          <InformationBox>
            <p>Information about this section</p>
          </InformationBox>
        </div>
        <div className={styles.input_section}>
          {type === 'Create' && (
            <>
              <Input label="Amount" placeholder="0.0001" />
              <Input label="Room Size" placeholder="6" />
            </>
          )}
          {type === 'Join' && (
            <>
              <Input label="Room Address" placeholder="0xDEADB33F" />
              <Input label="Room Code" placeholder="LOVE" />
            </>
          )}
        </div>
        <div className={styles.button_section}>
          <Button
            className={styles.button}
            title={"Let's go"}
            handleClick={createGame()}
          />
        </div>
      </div>
    </>
  )
}

ActionForm.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['Create', 'Join']).isRequired
}

export default ActionForm
