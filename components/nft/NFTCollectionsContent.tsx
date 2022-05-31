import React, { Fragment, useEffect, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import NFTCard from './NFTCard'
import { Skeleton } from '@mui/material'
import { useMoralis } from 'react-moralis'
import { userNFTsDataSelector } from 'states/nft'

function NFTCollectionsContent() {
    const { isAuthenticated } = useMoralis();
    const userNFTsDataLoadable = useRecoilValueLoadable(userNFTsDataSelector);
    const [userNFTsData, setUserNFTsData] = useState(null);
    const [validNFTItems, setValidNFTItems] = useState([]);

    useEffect(() => {
        if (userNFTsDataLoadable.state === "hasValue") {
            setUserNFTsData(userNFTsDataLoadable.contents)
            // console.log(userNFTsDataLoadable.contents);
            const nftItems = userNFTsDataLoadable.contents?.result;
            if (nftItems?.length > 0) {
                const data = nftItems.filter((item) => item?.metadata != null
                    && item?.metadata.length > 0
                    && item?.token_address !== "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"); // this is ENS NFT (can not show)
                console.log(data);
                setValidNFTItems(data);
            }
        }
    }, [userNFTsDataLoadable.state, userNFTsDataLoadable.contents]);
    return (
        <div>
            <main className="pb-24">
                {/* Product grid */}
                <section aria-labelledby="nft-heading" className="max-w-7xl mx-auto overflow-hidden sm:px-6 lg:px-8">
                    {
                        isAuthenticated ? <>
                            {
                                userNFTsDataLoadable.state !== "loading" ?
                                    <div className='tracking-wider flex gap-2 opacity-60 mb-2 px-2'>
                                        <span className="font-bold">Valid Digital Collectibles:</span>
                                        <span className="">{validNFTItems.length}</span>
                                    </div> :
                                    <Skeleton variant="text" className="w-2/5 h-10 py-2" />
                            }
                            <div className="-mx-px border border-gray-200 grid grid-cols-2 sm:mx-0 md:grid-cols-4 lg:grid-cols-6">
                                {
                                    userNFTsDataLoadable.state !== "loading" ?
                                        validNFTItems.map((item) => (
                                            <NFTCard key={`${item.token_address}/${item.token_id}`} nftItem={item} />
                                        ))
                                        :
                                        [...Array(12)].map((_, index) =>
                                            <div key={index} className="flex flex-col gap-2 justify-center items-center p-4">
                                                <Skeleton animation="wave" variant="rectangular" width={100} height={100} className="rounded-lg" />
                                                <Skeleton animation="wave" variant="text w-full rounded-lg" />
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
        </div>
    )
}

export default NFTCollectionsContent