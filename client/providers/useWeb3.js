/* eslint-disable react/prop-types */
import React, { createContext, useContext, useReducer } from 'react'

export const Web3Context = createContext()

export const Web3Provider = ({ reducer, initialState, children }) => (
  <Web3Context.Provider value={useReducer(reducer, initialState)}>
    {children}
  </Web3Context.Provider>
)

export const useWeb3 = () => {
  const contextValue = useContext(Web3Context)
  return contextValue
}
