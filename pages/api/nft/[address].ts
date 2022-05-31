import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { address } = req.query;
    let result = [];
    try {
        const nftData = await fetch(`https://us-central1-lab3-club.cloudfunctions.net/api/nft?address=${address}`)
            .then(resp => {
                if (resp.ok) {
                    return resp.json();
                } else {
                    throw new Error('NFT data load error');
                }
            })
            .then(res => {
                return res.data
            });

        res.status(200).json({ data: nftData, status: "success" })
    } catch (error) {
        res.status(400).json({ error: error, status: "error" });
    }
}
