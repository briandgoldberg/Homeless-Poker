/* eslint-disable react/forbid-prop-types */
import React from 'react'
import Web3 from 'utils/web3'
import Web3Provider from '../providers/useWeb3'

// let web3
// try {
//   web3 = Web3()
// } catch (err) {
//   console.error(err)
// }

const Landing = () => {
  const initialState = {
    web3: Web3()
    // theme: { primary: 'green' }
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'createInstance':
        return {
          ...state,
          theme: action.newTheme
        }

      default:
        return state
    }
  }
  console.log('lol')
  return (
    <Web3Provider initialState={initialState} reducer={reducer}>
      <p>lol</p>
    </Web3Provider>
  )
}

export default Landing

Landing.propTypes = {
  // eslint-disable-next-line react/require-default-props
  //   classes: PropTypes.object
}
