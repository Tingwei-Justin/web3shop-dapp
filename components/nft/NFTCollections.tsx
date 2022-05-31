import { Text } from '@components/ui';
import React, { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis';
import { useRecoilValueLoadable } from 'recoil';
import { userNFTCollectionsSelector } from 'states/nft';
import { Skeleton } from 'web3uikit';
import NFTCollectionCard from './NFTColllectionCard';

export default function NFTCollections() {
    const { isAuthenticated } = useMoralis();
    const userNFTCollectionsLoadable = useRecoilValueLoadable(userNFTCollectionsSelector);
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        if (userNFTCollectionsLoadable.state === "hasValue") {
            console.log(userNFTCollectionsLoadable.contents);

            // collections format: Array<[Contract: string, items: Array<nftItem>]>
            const currCollections = Object.entries(userNFTCollectionsLoadable.contents);

            console.log(currCollections);
            setCollections(currCollections);
        }
    }, [userNFTCollectionsLoadable.state, userNFTCollectionsLoadable.contents]);

    return (
        <div>
            <main className="pb-12">
                {/* Product grid */}
                <section aria-labelledby="nft-heading" className="px-6 lg:px-8 flex flex-col justify-center">
                    {
                        isAuthenticated ? <>
                            {
                                userNFTCollectionsLoadable.state !== "loading" ?
                                    <div className='tracking-wider flex gap-2 opacity-60 spx-2 self-center'>
                                        <span className="font-bold">Valid Digital Collections: {collections.length}</span>
                                    </div> :
                                    <Skeleton variant="text" className="w-2/5 h-10 py-2" />
                            }
                            <div className="mt-8 grid grid-flow-row grid-cols-1 col-span-1 sm:mx-0 md:grid-cols-2 lg:grid-cols-3">
                                {
                                    userNFTCollectionsLoadable.state !== "loading" ?
                                        collections.map((collection) => (
                                            <NFTCollectionCard key={`${collection[0]}`} collection={collection[1].slice(0, 9)} />
                                        ))
                                        :
                                        [...Array(12)].map((_, index) =>
                                            <div key={index} className="flex flex-col gap-2 justify-center items-center p-4">
                                                <Skeleton animation="wave" variant="rectangular" width={100} height={100} className="rounded-lg" />
                                                <Skeleton animation="wave" variant="text w-full rounded-lg" />
                                                <Skeleton animation="wave" variant="text w-full rounded-lg" />
                                            </div>
                                        )
                                }
                            </div>
                        </>
                            :
                            <div className="font-semibold opacity-80 text-xl text-center"> Please connect your wallet first </div>
                    }
                </section>
            </main>
        </div >
    )
}