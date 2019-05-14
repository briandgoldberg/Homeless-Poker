/* eslint-disable react/prop-types */
import React, { useContext, useReducer } from 'react'

export const Web3Context = React.createContext()

export const Web3Provider = ({ children, initalState, reducer }) => {
  const contextValue = useReducer(reducer, initalState)
  return (
    <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
  )
}

export const useWeb3 = () => {
  const contextValue = useContext(Web3Context)
  return contextValue
}
