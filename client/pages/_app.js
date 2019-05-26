import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui//styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../src/theme'
import { Web3Provider } from '../providers/useWeb3'

// import styles from './assets.scss'
export default class HomelessPoker extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  /* eslint-disable class-methods-use-this */

  render() {
    const { Component, pageProps } = this.props

    const initialState = {
      contract: {
        address: undefined,
        code: undefined,
        instance: undefined
      },
      user: {
        buyIn: undefined,
        name: undefined
      },
      contractInstance: undefined,
      web3Instance: undefined
    }

    const reducer = (state, action) => {
      switch (action.type) {
        case 'createRoom':
          return {
            ...state,
            contract: action.contractInfo
          }
        case 'joinRoom':
          return {
            ...state,
            contract: action.contractInfo
          }
        default:
          console.log('-- default in reducer')
          return state
      }
    }

    return (
      <Container>
        <Web3Provider initialState={initialState} reducer={reducer}>
          <Head>
            <title>nextjs</title>
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component pageContext={this.pageContext} {...pageProps} />
          </ThemeProvider>
        </Web3Provider>
      </Container>
    )
  }
}
