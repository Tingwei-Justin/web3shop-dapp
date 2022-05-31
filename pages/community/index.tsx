import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Text } from '@components/ui'
import Image from 'next/image'
import Link from 'next/link'
import { topCollections, Collection } from 'constant/collections'
import { useEffect, useState } from 'react'
import { classNames } from 'pages'
import { useRouter } from 'next/router'
import { useRecoilState, useRecoilStateLoadable, useRecoilValue } from 'recoil'
import { userAddress, userCommunities, UserFollowingCommunitiesSelector } from 'states/user'
import { followCommunity } from '@lib/follow'


export async function getStaticProps({ }: GetStaticPropsContext) {
    const res = await fetch(`${process.env.DOMAIN_URL}/api/community`)
    const result = await res.json()
    if (!res.ok || !result || !result.success) {
        return {
            notFound: true,
        };
        // throw new Error(`Failed to fetch products, received status ${res.status}`);
    }
    return {
        props: {
            communities: result?.data ?? []
        },
        revalidate: 1000,
    }
}

function Tag({ name }: { name: string }) {
    return (
        <div className='bg-gray px-2 py-1 rounded-2xl text-white text-xs'>
            {name}
        </div>
    )
}

function Button({ text, color = "red" }: { text: string, color: string }) {
    if (color === "black") {
        return <a className='bg-black w-36 py-2 rounded-2xl text-white text-center'>
            {text}
        </a>
    }
    return (
        <a className='bg-rose-500 w-36 py-2 rounded-2xl text-white text-center'>
            {text}
        </a>
    )
}

function CommunityCard({ community, addCommunity, removeCommunity, onHandleFollowCommunity, following = false }: { community: any, addCommunity: any, removeCommunity: any, onHandleFollowCommunity: any, following: boolean }) {
    const [postCount, setPostCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    async function handleFollow() {
        if (following) {
            removeCommunity(community);
            await onHandleFollowCommunity(community.id, "unfollow");
        } else {
            addCommunity(community);
            await onHandleFollowCommunity(community.id, "follow");
        }
    }
    // console.log(community)

    useEffect(() => {
        async function getPostCount() {
            const postRes = await fetch(`/api/post/collection/${community.data.nftCollection}`)
            const postResult = await postRes.json()
            if (!postRes.ok || !postResult || !postResult.success) {
                return;
            }
            setPostCount(postResult?.data?.length);
        }
        getPostCount();
    }, [community.data.nftCollection])

    useEffect(() => {
        async function getUserCount() {
            const usersRes = await fetch(`/api/user/community/${community.id}`)
            const usersResult = await usersRes.json();
            let users;
            if (!usersRes.ok || !usersResult || !usersResult.success) {
                users = [];
            } else {
                users = usersResult?.data;
            }
            setUserCount(users.length);

        }
        getUserCount();
    }, [community.id])

    const router = useRouter();
    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <Link href={`/community/${community.id}`}>
                <a target="_blank"
                    className="ring-2 ring-gray-2 rounded-xl flex flex-col gap-2 h-64 w-52 hover:cursor-pointer hover:scale-105"
                >
                    <div className='h-36 w-full overflow-hidden relative rounded-lg'>
                        <img
                            className="w-full h-full object-fill"
                            alt={community?.data?.name}
                            src={community.data.background ?? ""}
                        />
                        {/* 
                        <Image
                            className="rounded-lg"
                            alt="banner-test"
                            src={community.data.background ?? ""}
                            layout="fill"
                        /> */}
                    </div>
                    <div className='relative flex flex-col justify-center items-center text-center px-4 py-4'>
                        <img
                            className="absolute h-10 w-10 rounded-full -top-8 ring-2 ring-white"
                            src={community.data.icon}
                            alt={community.data.name}
                        />
                        <div id="name" className="text-black text-base">{community.data.name}</div>
                        <div id="tags" className="flex gap-2">
                            <Tag name={community.data.symbol} />
                        </div>
                        <div className='flex justify-center gap-4 pt-2'>
                            <div className='flex flex-col'>
                                <span className="text-black font-bold">{postCount}</span>
                                <span className='opacity-50 text-sm'>Posts</span>
                            </div>
                            <div className='flex flex-col'>
                                <span className=" text-black font-bold">{userCount}</span>
                                <span className='opacity-50 text-sm'>Members</span>
                            </div>
                        </div>
                    </div>
                </a>
            </Link>


            <button className={classNames(
                'w-20 py-2 ring-gray rounded-2xl text-center text-sm hover:text-black hover:ring-black hover:scale-105',
                following ? 'ring-black text-black ring-2 font-semibold' : 'text-gray ring-1'
            )}
                onClick={handleFollow}
            >
                {following ? "Following" : "Follow"}
            </button>
        </div>

    )
}
export default function Home({ communities }) {
    const walletAddress = useRecoilValue<string>(userAddress);
    const [selectedCommunities, setSelectedCommunities] = useState([]);
    const [followings, setFollowings] = useRecoilState(userCommunities);
    const router = useRouter();

    const onHandleFollowCommunity = async (communityId, operation = "follow") => {
        const latestFollowings = await followCommunity(communityId, operation, walletAddress);
        setFollowings(latestFollowings);
    }

    const addCommunity = (community) => {
        setSelectedCommunities([...selectedCommunities, community])
    }
    const removeCommunity = (community) => {
        let communities = [...selectedCommunities];
        for (let i = 0; i < selectedCommunities.length; ++i) {
            if (communities[i].contract === community.contract) {
                communities.splice(i, 1);
                setSelectedCommunities(communities)
                return;
            }
        }
    }
    const onFinish = (event) => {
        event.preventDefault();
        router.push(`/`);
    }
    return (
        <div className="max-w-7xl mx-8 sm:mx-auto py-20 flex flex-col items-center justify-center fit">
            <div className='flex w-full px-8 justify-between'>
                <Text variant="sectionHeading">Follow your interest communities</Text>
                <div className='flex gap-6'>
                    <button className='bg-black w-36 h-10 rounded-2xl text-white text-center hover:scale-105'
                        onClick={onFinish}
                    >
                        Finish
                    </button>
                    {/* <button className='bg-rose-500 w-36 h-10 rounded-2xl text-white text-center hover:scale-105'
                        onClick={onFinish}
                    >
                        Finish
                    </button> */}
                </div>
            </div>


            <div className="w-full grid grid-cols-1 items-stretch gap-8 mt-6 sm:grid-cols-3 lg:grid-cols-5 px-4">
                {
                    communities.map((community, idx) =>
                        <div className='col-span-1 w-full' key={community.id}>
                            <CommunityCard
                                community={community}
                                addCommunity={addCommunity}
                                removeCommunity={removeCommunity}
                                onHandleFollowCommunity={onHandleFollowCommunity}
                                following={followings?.includes(community?.id ?? "none")}
                            />
                        </div>

                    )
                }
            </div>
        </div>
    )
}

Home.Layout = Layout
