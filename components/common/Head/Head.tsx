import type { VFC } from 'react'
import { SEO } from '@components/common'

const Head: VFC = () => {
  return (
    <SEO>
      <meta
        key="viewport"
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <link rel="manifest" href="/web3shop-logo.png" key="site-manifest" />
      <link rel="shortcut icon" href="/web3shop-logo.png" />
    </SEO>
  )
}

export default Head
