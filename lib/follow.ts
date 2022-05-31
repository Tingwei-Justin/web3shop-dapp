
export const followCommunity = async (communityId, operation = "follow", walletAddress) => {
    if (walletAddress?.length == 0 || communityId?.length == 0
        || (operation != "follow" && operation != "unfollow")) {
        return [];
    }
    const res = await fetch(`/api/user/${operation}/${walletAddress}/${communityId}`)
    const result = await res.json()
    if (!res.ok || !result || !result.success) {
        return [];
    }
    const latestFollowingCommunities = result?.data?.communities ?? [];
    return latestFollowingCommunities;
}

// TODO: move to recoil
export const getUersPosts = async (walletAddress) => {
    if (walletAddress?.length == 0) {
        return [];
    }
    const res = await fetch(`/api/post/user/${walletAddress}/`)
    const result = await res.json()
    if (!res.ok || !result || !result.success) {
        return [];
    }
    const posts = result?.data ?? [];
    const mediaPosts = posts.filter((post) => post?.data?.imageUrl?.length > 0)
    return mediaPosts;
}