import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { params } = req.query;
    try {
        if (params.length !== 3 || (params[0] !== "follow" && params[0] !== "unfollow")) {
            throw new Error('Invalid input params');
        }
        const operation = params[0];
        const userWallet = params[1];
        const communityId = params[2];
        const result = await fetch(`https://us-central1-lab3-club.cloudfunctions.net/api/v1/user/${operation}/${userWallet}/${communityId}`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json; charset=utf-8",
                },
                // body: JSON.stringify(postData),
            }
        )
            .then(resp => {
                if (resp.ok) {
                    return resp.json();
                } else {
                    /**
                     * {
                            "success": false,
                            "message": "User xxx is already following community xxx."
                        }
                     */
                    return resp.json();
                }
            })
            .then(res => res);
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ error });
    }
}
