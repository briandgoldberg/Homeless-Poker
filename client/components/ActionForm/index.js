import React from 'react'
import PropTypes from 'prop-types'
import { Button, InformationBox, Input } from 'components'
import InputAdornment from '@material-ui/core/InputAdornment'
import styles from './ActionForm.scss'

function ActionForm(props) {
  // const classes = useStyles()
  const createGame = () => {
    console.log('create games')
  }
  const { children, handleInput, onSubmit, type } = props
  return (
    <>
      <div className={`${styles.action_container} ${styles[type]}`}>
        <h3 className={styles.title}>{type}</h3>
        <div className={styles.information_section}>
          <InformationBox>
            <p>Information about this section</p>
          </InformationBox>
        </div>
        <div className={styles.input_section}>
          {type === 'create' && (
            <>
              <Input
                label="Amount"
                placeholder="0.0001"
                onChange={handleInput('value')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">ETH</InputAdornment>
                  )
                }}
              />
              <Input
                onChange={handleInput('roomsize')}
                label="Room Size"
                placeholder="6"
              />
            </>
          )}
          {type === 'join' && (
            <>
              <Input
                label="Room Address"
                onChange={handleInput('address')}
                placeholder="0xDEADB33F"
              />
              <Input
                label="Room Code"
                onChange={handleInput('roomcode')}
                placeholder="LOVE"
                defaultValue=""
              />
            </>
          )}
        </div>
        <div className={styles.button_section}>
          <Button
            className={styles.button}
            title={"Let's go"}
            onClick={onSubmit}
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
