import type { NextApiRequest, NextApiResponse } from 'next'

export interface Post {
    name: string;
    collection: string;
    userWallet: string;
    isDesign: boolean;
    desc?: string;
    imageUrl?: string;
    tags?: [string];
    contractAddress?: string;
}

/**
 * Create new Post API
 * @param req 
 * @param res 
 * 
 * Test data: {
    "name": "test",
    "collection": "0xb51FEc702a259759690ab0e8648033d18EF099c1",
    "userWallet": "0xfA4f913718d9D51F8eE7F4094bBE523e244e8C7F",
    "isDesign": false,
    "imageUrl": "https://www.mferspet.com/_next/image?url=%2Fslot-machine-images%2F17.png&w=640&q=75",
    "tags": ["mfer", "mferspet", "social"]
}
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { name, desc, collection, imageUrl, userWallet, tags, isDesign }: Post = req.body;
    try {
        const postData = {
            name: name,
            desc: desc ?? "",
            userWallet: userWallet,
            collection: collection ?? "",
            imageUrl: imageUrl ?? "",
            tags: tags ?? [],
            isDesign: isDesign,
        }
        const result = await fetch(`https://us-central1-lab3-club.cloudfunctions.net/api/v1/post`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(postData),
            }
        )
            .then(resp => {
                // console.log(resp);
                if (resp.ok) {
                    return resp.json();
                } else {
                    throw new Error('Create new post error, please try again later.');
                }
            })
            .then(res => res);
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ errorMessage: error, result });
    }
}
