import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { address } = req.query;

    try {
        const result = await fetch(`https://us-central1-lab3-club.cloudfunctions.net/api/v1/post/`)
            .then(resp => {
                if (resp.ok) {
                    return resp.json();
                } else {
                    throw new Error('Get products error, please try again later.');
                }
            })
            .then(res => res);

        res.status(200).json(result)
    } catch (error) {
        res.status(400).json(result);
    }
}
