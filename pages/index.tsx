import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import tw from 'twin.macro'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useMoralis, useMoralisWeb3Api, useWeb3Contract, useWeb3ExecuteFunction } from "react-moralis";
import { abi, bytecode } from "../data/abi"

const Home: NextPage = () => {
    const [showAll, setShowAll] = useState(false);
    const { web3, Moralis, enableWeb3, isWeb3Enabled, authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();

    // const myContract = new ethers.ContractFactory(abi, bytecode, signer)


    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const deploy = async () => {
        if (isAuthenticated && isWeb3Enabled) {
            const ethers = Moralis.web3Library;
            const signer = web3?.getSigner();
            const myContract = new ethers.ContractFactory(abi, bytecode, signer);
            console.log(myContract);
            // If your contract requires constructor args, you can specify them here
            const contract = await myContract.deploy("test", "test", "google");

            console.log("contract address", contract.address);
            console.log("trasaction record", contract.deployTransaction);
        }
    }
    const login = async () => {
        if (!isAuthenticated) {

            await authenticate({ signingMessage: "Log in using Moralis" })
                .then(function (user) {
                    console.log("logged in user:", user);
                    console.log(user!.get("ethAddress"));
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    const logOut = async () => {
        await logout();
        console.log("logged out");
    }
    return (
        <div>
            <Head>
                <title>Web3Shop</title>
                <meta name="description" content="Web3Shop" />
            </Head>
            {/* page container */}
            <div tw="max-w-7xl mx-auto flex flex-col gap-8">
                <div tw="text-blue-500">
                    hello web3shop
                </div>
                <div>
                    <button onClick={login}>Moralis Metamask Login</button>
                </div>

                <div>
                    <button onClick={logOut} disabled={isAuthenticating}>Logout</button>
                </div>


                <button tw=" bg-red-400 text-white" onClick={deploy}>
                    Deploy
                </button>
            </div>


        </div >
    )
}
export default Home
