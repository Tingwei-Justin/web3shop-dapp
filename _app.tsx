import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'

import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import { MoralisProvider } from 'react-moralis'
import { RecoilRoot } from "recoil";

const Noop: FC = ({ children }) => <>{children}</>

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop

  useEffect(() => {
    document.body.classList?.remove('loading')
  }, [])

  return (
    <MoralisProvider
      serverUrl="https://nszopjl5luya.usemoralis.com:2053/server"
      appId="lCcURyqUP0QTmNdi8qwZp67Sq1IUkLM4xlZeDLYw"
    >
      <RecoilRoot>
        <Head />
        <ManagedUIContext>
          <Layout pageProps={pageProps}>
            <Component {...pageProps} />
          </Layout>
        </ManagedUIContext>
      </RecoilRoot>

    </MoralisProvider>
  )
}
