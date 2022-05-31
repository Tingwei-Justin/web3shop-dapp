import type { GetStaticPropsContext } from 'next'
import { Layout } from '@components/common'
import { Text } from '@components/ui'
import Image from 'next/image'
import { PlusSmIcon as PlusSmIconSolid } from '@heroicons/react/solid'
import Masonry from '@components/common/Masonry'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { userAllInfoSelector, userAddress, userFollowingCommunitiesPostSelector, rankingUsersInWeb3Graph } from 'states/user'
import { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PostButton from '@components/post/PostButton'
import { getUersPosts } from '@lib/follow'
import { client, TopNRankingsQuery } from '@lib/cyberconnect-query'
import RankingUsers from '@components/user/RankingUsers'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'


export async function getStaticProps({ }: GetStaticPropsContext) {
    const res = await fetch(`${process.env.DOMAIN_URL}/api/post`)
    const result = await res.json()
    if (!res.ok || !result || !result.success) {
        return {
            notFound: true,
        };
        // throw new Error(`Failed to fetch products, received status ${res.status}`);
    }
    let posts = [];
    if (result?.data?.length > 0) {
        posts = result.data.filter((post) => post?.data?.imageUrl?.length > 0)
    }
    return {
        props: {
            posts
        },
        revalidate: 5,
    }
}

const defaultTabs = [
    { name: 'Hot', href: '#', current: true },
    { name: 'Followed', href: '#', current: false },
    { name: 'My', href: '#', current: false },
]

export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Home({ posts }) {
    const [address, setAddress] = useRecoilState<string>(userAddress);
    const userFollowingsPostLoadable = useRecoilValueLoadable(userFollowingCommunitiesPostSelector);
    // const [followingPosts, setFollowingPosts] = useRecoilState(userFollowingCommunitiesPostSelector);
    const [tabs, setTabs] = useState(defaultTabs);
    const [displayedPosts, setDisplayedPosts] = useState(posts);
    const [renderPosts, setRenderPosts] = useState(posts);
    const [displayedPostsBySelection, setDisplayedPostsBySelection] = useState(posts);
    const [userPosts, setUserPosts] = useState([]);
    const [userFollowingPosts, setUserFollowingPosts] = useState([]);
    const router = useRouter();
    // const user = useRecoilValue(userAllInfoSelector);
    const userLoadable = useRecoilValueLoadable(userAllInfoSelector);
    const { isAuthenticated, user: web3user } = useMoralis();
    const [rankingUsers, setRankingUsers] = useRecoilState(rankingUsersInWeb3Graph);
    const [postType, setPostType] = useState("all");


    useEffect(() => {
        let postsResult = [];
        if (postType === "design") {
            postsResult = displayedPosts.filter((post) => post?.data?.isDesign)
        } else if (postType === "social") {
            postsResult = displayedPosts.filter((post) => !post?.data?.isDesign)
        } else {
            postsResult = displayedPosts;
        }
        setRenderPosts(postsResult);
    }, [postType, displayedPosts, setRenderPosts])

    // get the top 20 users for suggestion
    useEffect(() => {
        const variables = {
            first: 50,
        };
        client
            .request(TopNRankingsQuery, variables)
            .then((res) => {
                // console.log(res);
                if (res?.rankings?.list?.length > 0) {
                    // console.log(res.rankings.list);
                    setRankingUsers(res.rankings.list)
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }, [setRankingUsers]);

    useEffect(() => {
        console.log("displayedPosts", displayedPosts);
    }, [displayedPosts]);

    async function onHandleTab(idx) {
        let newTabs = [...tabs];
        for (let i = 0; i < newTabs.length; ++i) {
            newTabs[i].current = i === idx;
        }
        setTabs(newTabs);
        // TODO: LOADING STATE
        if (newTabs[idx].name === "My" && address.length > 0) {
            const currPosts = await getUersPosts(address);
            setDisplayedPosts(currPosts);
        } else if (newTabs[idx].name === "Followed" && address.length > 0) {
            setDisplayedPosts(userFollowingPosts);
        }
        else {
            setDisplayedPosts(posts);
        }
    }

    useEffect(() => {
        if (userFollowingsPostLoadable.state === "hasValue") {
            const followingPosts = userFollowingsPostLoadable.contents;
            setUserFollowingPosts(followingPosts);
        }
    }, [userFollowingsPostLoadable.state, userFollowingsPostLoadable.contents]);

    function handlePostTypeChange(event) {
        setPostType(event.target.value);
    };

    // useEffect(() => {
    //     if (userLoadable.state === "hasValue") {
    //         const userInfo = userLoadable.contents;
    //         if (address && userInfo && !userInfo?.regesteredUser) {
    //             router.push("/community");
    //         }
    //     }
    // }, [userLoadable.state, userLoadable.contents, router, address]);

    return (
        <div className="w-screen">
            <Image
                className=""
                alt="banner"
                src="/test/banner.png"
                layout="responsive"
                width={1920}
                height={522}
            />
            <div className='max-w-7xl mx-auto flex flex-col items-center justify-center mt-4'>
                <div className="w-full flex justify-between items-center px-4">
                    <RankingUsers />
                    <nav className="-mb-px flex space-x-8 self-center" aria-label="Tabs">
                        <FormControl fullWidth sx={{ width: "8rem" }} variant="standard">
                            <InputLabel id="post-select-label">Post type</InputLabel>
                            <Select
                                sx={{ color: 'black', backgroundColor: 'white', borderColor: 'black' }}
                                labelId="postType-select"
                                value={postType}
                                label="postType"
                                onChange={handlePostTypeChange}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="design">Design</MenuItem>
                                <MenuItem value="social">Social</MenuItem>
                            </Select>
                        </FormControl>

                        {tabs.map((tab, idx) => (
                            <a
                                key={tab.name}
                                href={tab.href}
                                onClick={() => { onHandleTab(idx) }}
                                className={classNames(
                                    tab.current
                                        ? 'border-black text-black font-bold'
                                        : 'border-transparent opacity-60 hover:opacity-80',
                                    'whitespace-nowrap py-4 px-1 border-b-[3px] font-medium text-sm'
                                )}
                                aria-current={tab.current ? 'page' : undefined}
                            >
                                {tab.name}
                            </a>
                        ))}
                    </nav>

                    <div className='flex gap-2'>
                        <PostButton />
                    </div>
                </div>

                <section className='px-2 mx-auto my-12 w-full'>
                    <Masonry posts={renderPosts} />
                </section>
            </div>
        </div>
    )
}

Home.Layout = Layout
