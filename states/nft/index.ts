import { selector } from "recoil";
import { userAddress } from "states/user";

// const API_DOMAIN = "https://us-central1-lab3-club.cloudfunctions.net/api/nft";

export const userNFTsDataSelector = selector({
    key: 'UserNFTsData',
    get: async ({ get }) => {
        const address = get(userAddress);
        // let resulst = {};
        if (address && address.length > 0) {
            const result = await fetch(`/api/nft/${address}`)
                .then(response => response.json())
                .then(res => {
                    return res.data;
                });
            console.log(result);
            return result;
        }
        return null;
    },
});

export const userNFTCollectionsSelector = selector({
    ////  ENS NFT can't show, will add other invalid collections here
    key: 'UserNFTCollections',
    get: async ({ get }) => {
        const nftData = await get(userNFTsDataSelector);
        let result = {};
        if (nftData && nftData?.result?.length > 0) {
            nftData.result.forEach(nft => {
                console.log(nft);
                if (nft?.metadata != null && nft?.token_address.toLowerCase() !== "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85") {
                    if (!(nft.token_address in result)) {
                        result[nft.token_address] = [nft];
                    } else {
                        result[nft.token_address].push(nft);
                    }
                }
            });
        }
        console.log(result)
        return result;
    },
});