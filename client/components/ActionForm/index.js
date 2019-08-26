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
  const { children, handleInput, onSubmit, query, type } = props
  console.log('koma', query)
  return (
    <>
      <div className={`${styles.action_container} ${styles[type]}`}>
        <div className={styles.title_container}>
          <div className={`${styles.title_box} ${styles[type]}`}>
            <h3 className={styles.title}>{type}</h3>
          </div>
        </div>
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
                value={query.address}
              />
              <Input
                label="Room Code"
                onChange={handleInput('roomcode')}
                placeholder="LOVE"
                defaultValue=""
                value={query.roomCode}
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
  query: PropTypes.objectOf(PropTypes.string),
  type: PropTypes.oneOf(['create', 'join']).isRequired
}

ActionForm.defaultProps = {
  query: {
    address: '',
    roomCode: ''
  }
}

export default ActionForm
