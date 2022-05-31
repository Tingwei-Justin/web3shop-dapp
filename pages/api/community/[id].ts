import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;
    let result = {};
    try {
        result = await fetch(`https://us-central1-lab3-club.cloudfunctions.net/api/v1/community/${id}`)
            .then(resp => {
                if (resp.ok) {
                    return resp.json();
                } else {
                    return resp.json();
                }
            })
            .then(res => res);
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json(result);
    }
}
