import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { MoralisProvider } from 'react-moralis'


function MyApp({ Component, pageProps }: AppProps) {
  const appID = "https://nszopjl5luya.usemoralis.com:2053/server" //process.env.MORALIS_APP_ID;
  const serverUrl = "lCcURyqUP0QTmNdi8qwZp67Sq1IUkLM4xlZeDLYw" //process.env.MORALIS_SERVER_URL;
  return (
    <div>
      <Head>
        <link rel="shortcut icon" href="/logo.jpg" />
      </Head>
      <MoralisProvider
        serverUrl="https://ewfzwowhbm1w.usemoralis.com:2053/server"
        appId="3fGgHqtRsUXYlfed76R1L2GoFYkvB5mcZWAYINyz"
      >
        <Component {...pageProps} />
      </MoralisProvider>
    </div >
  )
}

export default MyApp
