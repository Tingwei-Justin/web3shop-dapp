import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import tw from 'twin.macro'
import Link from 'next/link'
import { useState } from 'react'


const Home: NextPage = () => {
    const [showAll, setShowAll] = useState(false);
    return (
        <div>
            <Head>
                <title>Web3Shop</title>
                <meta name="description" content="Web3Shop" />
            </Head>
            {/* page container */}
            <div tw="text-blue-500">
                hello web3shop
            </div>
        </div >
    )
}
export default Home
