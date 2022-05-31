import {
    atom,
    selector,
} from 'recoil';

// export type UserState = {
//     wallet: string,
// }

export const userAddress = atom({
    key: 'UserAddress',
    default: ""
});

export const userAllInfoSelector = selector({
    key: 'UserAllInfo',
    get: async ({ get }) => {
        const address = get(userAddress);
        if (address && address.length > 0) {
            const result = await fetch(`/api/user/${address}`)
                .then(response => response.json())
                .then(res => {
                    return res;
                });
            console.log(result);
            return result;
        }
        return {};
    },
});

export const userCommunities = atom({
    key: 'UserCommunities',
    default: []
});

export const userFollowingCommunitiesPostSelector = selector({
    key: 'UserFollowingCommunitiesPost',
    get: async ({ get }) => {
        const ids = get(userCommunities);
        if (ids?.length == 0) {
            return [];
        }
        const idsQuery = ids.join(',');
        const result = await fetch(`/api/post/community?query=${idsQuery}`)
            .then(response => response.json())
            .then(res => {
                return res?.data
            });
        const mediaPosts = result.filter((post) => post?.data?.imageUrl?.length > 0)
        return mediaPosts;
    },
});

export const UserFollowingCommunitiesSelector = selector({
    key: 'UserFollowingCommunities',
    get: async ({ get }) => {
        const address = get(userAddress);
        if (address && address.length > 0) {
            const result = await fetch(`/api/user/${address}`)
                .then(response => response.json())
                .then(res => {
                    return res?.result.data.data.communities;
                });
            return result;
        }
        return [];
    },
});

export const rankingUsersInWeb3Graph = atom({
    key: 'RankingUsersInWeb3Graph',
    default: []
});