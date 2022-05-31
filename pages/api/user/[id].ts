import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;
    try {
        const result = await fetch(`https://us-central1-lab3-club.cloudfunctions.net/api/v1/user/${id}`)
            .then(resp => {
                if (resp.ok) {
                    return resp.json();
                } else {
                    throw new Error('Get user error, please try again later.');
                }
            })
            .then(res => res);
        const regesteredUser = result?.data.hasOwnProperty("data");
        res.status(200).json({ result, status: "success", regesteredUser })
    } catch (error) {
        res.status(400).json({ error: error, status: "error" });
    }
}
