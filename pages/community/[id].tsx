import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Text } from '@components/ui'
import Image from 'next/image'
import { PlusSmIcon as PlusSmIconSolid } from '@heroicons/react/solid'
import Masonry from '@components/common/Masonry'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { userAddress, userCommunities } from 'states/user'
import { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PostButton from '@components/post/PostButton'
import { topCollections } from 'constant/collections'
import { classNames } from 'pages'
import { Avatar, Fab, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { followCommunity } from '@lib/follow'
import CyberConnect, { Env, Blockchain, ConnectionType } from "@cyberlab/cyberconnect";
import { parseAddressForShow } from '@components/common/Masonry/MasonryGallery'
import { GraphQLClient, gql } from "graphql-request";
import { CYBERCONNECT_ENDPOINT } from 'constant/endpoint'
import { FollowStatusQuery, GET_IDENTITY, client } from '@lib/cyberconnect-query'

function FollowPeopleCard({ connection }) {
    const { web3, isWeb3Enabled, enableWeb3, provider, isAuthenticated } = useMoralis();
    const [cyberConnect, setCyberConnect] = useState(null);
    const [identity, setIdentity] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>("");
    const [isFollowing, setIsFollowing] = useState<boolean>(connection?.followStatus?.isFollowing);

    // You can change the below variables

    useEffect(() => {
        const variables = {
            address: connection.toAddr
        };
        client
            .request(GET_IDENTITY, variables)
            .then((res) => {
                setLoading(false);
                console.log(res?.identity);
                setIdentity(res?.identity);
            })
            .catch((e) => {
                setLoading(false);
                console.log(e);
                setError(e.message);
            });
    }, [connection]);
    
    useEffect(() => {
        if (!provider) {
            return;
        }
        const connect = new CyberConnect({
            namespace: "Web3Shop",
            env: Env.Production,
            chain: Blockchain.ETH,
            provider: provider, //window.ethereum,
            signingMessageEntity: "Web3Shop",
        });
        console.log("connect", connect)
        setCyberConnect(connect);
    }, [provider]);

    useEffect(() => {
        async function init() {
            await enableWeb3();
        }
        if (isWeb3Enabled) {
            console.log("isWeb3Enabled");
            console.log("provider", provider);
            // console.log("web3", web3);
        } else {
            init();
        }
        // esslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWeb3Enabled, enableWeb3, web3, provider]);

    async function onHandleFollow(event) {
        event.preventDefault();
        if (!cyberConnect) {
            await enableWeb3();
            return;
        }
        try {
            if (!isFollowing) {
                await cyberConnect.connect(connection.toAddr, "", ConnectionType.FOLLOW);
                setIsFollowing(true);
                // alert(`Success: you're following ${connection.toAddr} successfully!`);
            } else {
                await cyberConnect.disconnect(connection.toAddr);
                setIsFollowing(false);
                // alert(`Success: you're unfollowed ${connection.toAddr} successfully!`);
            }

        } catch (error) {
            console.error(error.message);
        }
    }

    return <>
        <div className='flex justify-between items-center p-2 hover:cursor-pointer hover:bg-slate-300 rounded-xl'>
            <div className='flex justify-center gap-2'>
                <Avatar alt="test avatar" src="/community/mfers-icon.png" />
                <div className='flex flex-col'>
                    <div className='text-sm font-semibold'>{identity?.domain || parseAddressForShow(connection.toAddr)}</div>
                    <div className='text-xs opacity-60'>{identity?.followerCount} Followers</div>
                </div>
            </div>
            <button className={classNames(
                'w-20 h-8 rounded-xl text-center text-sm hover:scale-105 hover:font-bold',
                isFollowing ? ' ring-gray ring-1 font-semibold text-black text-opacity-80' : 'text-white bg-black font-bold'
            )}
                onClick={onHandleFollow}
            >
                {isFollowing ? "Following" : "Follow"}
            </button>
        </div>
    </>
}

export async function getServerSideProps(context) {
    const id = context.params?.id;
    if (id == null) {
        return {
            notFound: true,
        };
    }
    let res = await fetch(`${process.env.DOMAIN_URL}/api/community/${id}`)
    let result = await res.json()
    console.log(result);
    if (!res.ok || !result || !result?.success || !result?.data) {
        return {
            notFound: true,
        };
    }
    const community = result.data;
    const collection = community?.data?.nftCollection ?? "";
    const postRes = await fetch(`${process.env.DOMAIN_URL}/api/post/collection/${collection}`)
    const postResult = await postRes.json()
    if (!postRes.ok || !postResult || !postResult.success) {
        return {
            notFound: true,
        };
    }
    let posts = [];
    if (postResult?.data?.length > 0) {
        posts = postResult.data.filter((post) => post?.data?.imageUrl?.length > 0)
    }

    const usersRes = await fetch(`${process.env.DOMAIN_URL}/api/user/community/${id}`)
    const usersResult = await usersRes.json();
    let users;
    if (!usersRes.ok || !usersResult || !usersResult.success) {
        users = [];
    } else {
        users = usersResult?.data;
    }

    return {
        props: {
            posts,
            community,
            users
        },
    }
}

const breakpointColumnsObj = {
    default: 3,
    900: 2,
    700: 1,
};

export default function Community({ posts, community, users }) {
    const [address, setAddress] = useRecoilState<string>(userAddress);
    const [followings, setFollowings] = useRecoilState(userCommunities)
    const [following, setFollowing] = useState<boolean>(false);
    const [otherFollowers, setOtherFollowers] = useState([]);
    const [otherFollowersConnections, setOtherFollowersConnections] = useState([]);
    const [displayedPosts, setDisplayedPosts] = useState(posts);
    const router = useRouter();

    useEffect(() => {
        const variables = {
            from: address,
            to: otherFollowers,
        };
        client
            .request(FollowStatusQuery, variables)
            .then((res) => {
                setOtherFollowersConnections(res?.connections)
                console.log(res?.connections);
            })
            .catch((e) => {
                console.error(e);
            });
    }, [address, otherFollowers]);


    useEffect(() => {
        console.log(address);
    }, [address]);

    useEffect(() => {
        setOtherFollowers(users.filter((user) => user?.id !== address)
            .map((user) => user?.id));
    }, [setOtherFollowers, users, address]);

    useEffect(() => {
        setFollowing(followings.includes(community.id));
    }, [setFollowing, followings, community.id]);

    async function onHandleFollow(operation = "follow") {
        //communityId, operation = "follow", walletAddress
        const updatedFollowings = await followCommunity(community.id, operation, address);
        setFollowings(updatedFollowings);
    }

    return (
        <div className="w-screen bg-slate-100">
            <div className="w-full relative h-60 pointer-events-none">
                <img
                    className="w-full h-full object-cover"
                    alt={community.data.name}
                    src={community.data.banner}
                />
                {/* <Image
                    className="object-cover"
                    alt={community.data.name}
                    src={community.data.banner}
                    layout="fill"
                /> */}
            </div>

            <div className='relative max-w-7xl mx-auto flex flex-col items-center justify-center mt-4'>
                <div className='-top-28 relative flex flex-col justify-center items-center text-center px-4 pt-4 gap-2'>
                    <img
                        className="h-32 w-32 rounded-xl -top-8 ring-4 ring-white overflow-hidden"
                        src={community.data.icon}
                        alt={community.data.name}
                    />
                    <div id="name" className="text-black text-opacity-80 text-lg font-semibold">{community.data.name}</div>
                    <div>
                        <Tooltip describeChild title={following ? `Are you sure to unfollow this community?` : ""}>
                            <button className={classNames(
                                'w-32 py-2  rounded-2xl text-center text-sm hover:scale-105 hover:font-bold',
                                following ? ' ring-gray ring-1 font-semibold text-black text-opacity-80' : 'text-white bg-black font-bold'
                            )}
                                onClick={() => {
                                    onHandleFollow(following ? "unfollow" : "follow");
                                    // setFollowed((follow) => !follow);
                                    // if (selected) {
                                    //     removeCommunity(collection);
                                    // } else {
                                    //     addCommunity(collection);
                                    // }
                                    // setSelected((selected) => !selected);
                                }}
                            >
                                {following ? "Following" : "Follow"}
                            </button>
                        </Tooltip>

                    </div>
                    <div className='flex justify-center gap-8 pt-2'>
                        <div className='flex flex-col'>
                            <span className="text-lg text-black font-bold">{posts.length}</span>
                            <span className='opacity-50'>Posts</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className="text-lg text-black font-bold">{users?.length ?? "none"}</span>
                            <span className='opacity-50'>Members</span>
                        </div>
                    </div>
                </div>

                <section className=' px-4 mx-auto w-full grid grid-cols-1 justify-center lg:grid-cols-12 gap-4 lg:px-0'>
                    <div className='col-span-9 relative'>
                        <div className="absolute -top-20 right-4">
                            <Tooltip title="Create a new post" placement="top">
                                <PostButton />
                            </Tooltip>

                        </div>
                        <Masonry posts={displayedPosts} customBreakpointObj={breakpointColumnsObj} />
                    </div>

                    <div className="col-span-8 lg:col-span-3 mt-3 pb-4">
                        <div className='px-2 py-3 bg-slate-200 rounded-2xl flex flex-col items-center'>
                            <div className="text-center font-semibold text-lg opacity-80 mb-4 mt-2">
                                Find your web3 soul mate?!
                            </div>

                            <div className="w-full flex flex-col px-4 px-auto">
                                {
                                    otherFollowersConnections.map((conn, idx) =>
                                        <FollowPeopleCard
                                            key={conn?.toAddr}
                                            connection={conn}
                                        />)
                                }
                            </div>
                        </div>

                    </div>

                </section>
            </div>
        </div>
    )
}

Community.Layout = Layout
