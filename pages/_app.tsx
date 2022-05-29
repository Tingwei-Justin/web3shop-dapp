import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { MoralisProvider } from 'react-moralis'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <link rel="shortcut icon" href="/logo.jpg" />
      </Head>
      <MoralisProvider
        serverUrl={`${process.env.MORALIS_SERVER_URL}`}
        appId={`${process.env.MORALIS_APP_ID}`}
      >
        <Component {...pageProps} />
      </MoralisProvider>
    </div>
  )
}

export default MyApp
