import React, { useEffect, useState } from 'react'
import { Layout } from '@components/common'
import Image from 'next/image'
import { Avatar, Badge, Divider, IconButton, Tooltip } from '@mui/material'
import { classNames } from 'pages'
import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderSharpIcon from '@mui/icons-material/FavoriteBorderSharp';
import StarSharpIcon from '@mui/icons-material/StarSharp';
import Masonry from '@components/common/Masonry'
import { useRecoilState } from 'recoil'
import { parseAddressForShow } from '@components/common/Masonry/MasonryGallery'
import { userAddress } from 'states/user'
import { useMoralis } from 'react-moralis'
import { abi, bytecode } from 'constant/contract'
import ReactPlayer from 'react-player'
import { client, FollowStatusQuery, GET_IDENTITY } from '@lib/cyberconnect-query'
import CyberConnect, { Env, Blockchain, ConnectionType } from "@cyberlab/cyberconnect";
import { ShoppingCartIcon } from '@heroicons/react/solid'
import DeployNFTVerticalStepper from '@components/nft/DeployNFTVerticalStepper'
import Link from 'next/link'


import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useRouter } from 'next/router'
import { getRandomIconFromAddress } from '@lib/util'

export async function getServerSideProps(context) {
    const id = context.params?.id;
    const res = await fetch(`${process.env.DOMAIN_URL}/api/post`)
    const result = await res.json()
    if (!res.ok || !result || !result?.success) {
        return {
            notFound: true,
        };
        // throw new Error(`Failed to fetch products, received status ${res.status}`);
    }
    let posts = [];
    if (result?.data?.length > 0) {
        posts = result.data.filter((post) => post?.data?.imageUrl?.length > 0)
    }

    const currPostRes = await fetch(`${process.env.DOMAIN_URL}/api/post/${id}`)
    const currPostResult = await currPostRes.json()
    if (!currPostRes.ok || !currPostResult || !currPostResult?.success) {
        return {
            notFound: true,
        };
    }
    const post = currPostResult.data;
    return {
        props: {
            posts,
            post
        },
    }
}

export default function Post({ posts, post }) {
    const [displayedPosts, setDisplayedPosts] = useState(posts);
    const [address, setAddress] = useRecoilState<string>(userAddress);
    const { web3, provider, Moralis, isWeb3Enabled, enableWeb3, isAuthenticated } = useMoralis();
    const [imageError, setImageError] = useState(false);
    const [placeholderImg, setPlaceholderImg] = useState("");
    const [identity, setIdentity] = useState<any>([]);
    const [cyberConnect, setCyberConnect] = useState(null);
    // const [isFollowingAuthor, setFollowingAuthor] = useState(false);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [showDeployStepper, setShowDeployStepper] = useState<boolean>(false);
    const [deployedContractAddress, setDeployedContractAddress] = useState<string>("");

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
        setCyberConnect(connect);
    }, [provider]);

    useEffect(() => {
        const variables = {
            address: post?.data?.userWallet
        };
        client
            .request(GET_IDENTITY, variables)
            .then((res) => {
                setIdentity(res?.identity);
            })
            .catch((e) => {
                // setError(e.message);
            });
    }, [post?.data?.userWallet]);

    useEffect(() => {
        const variables = {
            from: address,
            to: [post?.data?.userWallet]
        };
        client
            .request(FollowStatusQuery, variables)
            .then((res) => {
                setIsFollowing(res?.connections[0]?.followStatus?.isFollowing);
                console.log(res?.connections[0]?.followStatus?.isFollowing);
            })
            .catch((e) => {
                console.error(e);
            });
    }, [address, post?.data?.userWallet]);


    const deploy = async (data) => {
        if (isAuthenticated) {
            const ethers = Moralis.web3Library;
            const signer = web3?.getSigner();
            const myContract = new ethers.ContractFactory(abi, bytecode, signer);
            console.log(myContract);
            // If your contract requires constructor args, you can specify them here
            const contract = await myContract.deploy(data.name, data.symbol, data.metadataUri, Moralis.Units.ETH(data.price), data.maxSupply);
            // console.log("contract address", contract.address);
            // console.log("trasaction record", contract.deployTransaction);
            setDeployedContractAddress(contract.address)
            await contract.deployed()
        }
    }

    async function onHandleFollow(event) {
        event.preventDefault();
        if (!cyberConnect) {
            await enableWeb3();
            return;
        }
        try {
            const author = post?.data?.userWallet;
            if (!isFollowing) {
                await cyberConnect.connect(author, "", ConnectionType.FOLLOW);
                setIsFollowing(true);
                // alert(`Success: you're following ${connection.toAddr} successfully!`);
            } else {
                await cyberConnect.disconnect(author);
                setIsFollowing(false);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div className="w-screen min-h-screen bg-slate-50">
            <div className='max-w-7xl mx-auto flex flex-col items-center justify-center mt-4'>
                <div className='w-4/5 shadow-xl min-h-[66vh] rounded-2xl my-8 flex overflow-hidden'>
                    <div className='flex-1 relative overflow-hidden flex items-center justify-center'>

                        {
                            (!imageError || placeholderImg === "/error-415.png") ?

                                <img
                                    className="object-cover"
                                    alt={post?.data?.name}
                                    src={placeholderImg === "/error-415.png" ? placeholderImg : post?.data?.imageUrl}
                                    onError={() => {
                                        setImageError(true);
                                    }}
                                />
                                :
                                <ReactPlayer url={post?.data?.imageUrl}
                                    width='100%'
                                    className="object-cover"
                                    controls="true"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    onError={() => {
                                        setPlaceholderImg("/error-415.png")
                                    }}
                                />
                        }
                        <div className='absolute top-8 left-4'>
                            {
                                post?.data?.isDesign ?
                                    <div className='bg-orange-400 px-2 py-1 rounded-2xl text-white text-xs font-semibold'>
                                        Design
                                    </div>
                                    :
                                    <div className='bg-orange-700 px-2 py-1 rounded-2xl text-white text-xs font-semibold'>
                                        Social
                                    </div>
                            }
                        </div>
                    </div>
                    <div className='flex-1 relative'>
                        {
                            !showDeployStepper ?
                                <>
                                    {/* Follow feature */}
                                    <div className='flex px-8 justify-between p-2 items-center'>
                                        <Link href={`https://app.cyberconnect.me/address/${post?.data?.userWallet}`}>
                                            <a target="_blank" className='flex justify-center gap-2 hover:bg-slate-100 p-2 rounded-xl hover:cursor-pointer'>
                                                <Avatar className='hover:scale-110 ring-2 ring-black ring-opacity-10' sx={{ width: 48, height: 48 }} alt={parseAddressForShow(post?.data?.userWallet)} src={getRandomIconFromAddress(post?.data?.userWallet)} />
                                                <div className='flex flex-col justify-center'>
                                                    <div className='text-sm font-semibold'>{identity?.domain || parseAddressForShow(post?.data?.userWallet)}</div>
                                                    <div className='text-xs opacity-60'>{identity?.followerCount} Followers</div>
                                                </div>
                                            </a>
                                        </Link>


                                        {

                                            address !== post?.data?.userWallet ? <button className={classNames(
                                                'w-20 h-8 rounded-xl text-center text-sm hover:scale-105 hover:font-bold',
                                                isFollowing ? ' ring-gray ring-1 font-semibold text-black text-opacity-80' : 'text-white bg-black font-bold'
                                            )}
                                                onClick={onHandleFollow}
                                            >
                                                {isFollowing ? "Following" : "Follow"}
                                            </button> :
                                                <div className={'w-20 h-8 rounded-xl flex items-center justify-center text-sm ring-gray ring-1 font-semibold text-black text-opacity-80'}
                                                >
                                                    Author
                                                </div>
                                        }
                                    </div>
                                    <Divider component="div" className='mx-6' />

                                    <div className="px-8 pb-8">
                                        <div className="text-3xl my-4 font-semibold">
                                            {post?.data?.name}
                                        </div>
                                        {
                                            post?.data?.isDesign && post?.data?.userWallet === address &&
                                            <div className=''>
                                                <div className='mt-5 flex gap-4'>
                                                    <div>Receive interest requests: </div>
                                                    <Badge badgeContent={5} color="secondary" className='h-7 w-10'>
                                                        <ShoppingCartIcon />
                                                    </Badge>
                                                </div>
                                                {
                                                    deployedContractAddress.length === 0 ?
                                                        <div>
                                                            <Tooltip title="Please use TESTNET, DEMO ONLY" placement="top">
                                                                <button
                                                                    className="my-4 px-8 flex-1 inline-flex items-center py-2 border border-transparent shadow-sm font-medium rounded-2xl text-white bg-[#DF5949] hover:bg-[#e12b17] hover:scale-105"
                                                                    onClick={() => setShowDeployStepper(true)}
                                                                // onClick={deploy}
                                                                >
                                                                    Deploy your design as NFT for SELL
                                                                </button>
                                                            </Tooltip>

                                                        </div>

                                                        :
                                                        <Link

                                                            href={`https://rinkeby.etherscan.io/address/${deployedContractAddress}`}
                                                        // onClick={deploy}
                                                        >
                                                            <a target="_blank" className="my-4 px-8 flex-1 inline-flex items-center py-2 border border-transparent shadow-sm font-medium rounded-2xl text-white bg-[#DF5949] hover:bg-[#e12b17] hover:scale-105">
                                                                View your smart contract
                                                            </a>
                                                        </Link>
                                                }
                                                <BasicMenu />
                                            </div>

                                        }


                                        {
                                            post?.data?.isDesign && post?.data?.userWallet !== address &&
                                            <div>
                                                {/* <div className="text-xl mt-8 my-4 px-1 font-semibold opacity-80">
                                        0.2 ETH
                                    </div> */}
                                                <button
                                                    className="px-10 flex-1 inline-flex items-center py-2 border border-transparent shadow-sm font-medium rounded-2xl text-white bg-[#DF5949] hover:bg-[#e12b17] hover:scale-105"
                                                >
                                                    🔥 Ask the designer to sell it 🔥
                                                </button>
                                            </div>
                                        }

                                    </div>

                                    <Divider component="div" className='mx-6' />

                                    <div className='flex flex-col px-8 py-8'>
                                        <div className='font-bold'>Description</div>

                                        <div className='text-sm opacity-60 mt-2'>
                                            {post?.data?.desc}
                                        </div>

                                        {

                                            !post?.data?.isDesign &&
                                            <div className='flex gap-2 mt-4'>
                                                <Tooltip title="Coming soon" placement="top">
                                                    <button
                                                        className="flex-1 flex justify-center text-sm items-center py-2 border border-transparent shadow-sm leading-4 font-medium rounded-2xl text-white bg-black bg-opacity-70 hover:bg-opacity-90 hover:scale-105"
                                                    >
                                                        Request the design or merch link
                                                    </button>
                                                </Tooltip>

                                                {/* <button
                                        className="flex-1 text-sm flex justify-center items-center py-2 border border-transparent shadow-sm leading-4 font-medium rounded-2xl text-white bg-black bg-opacity-70 hover:bg-opacity-90 hover:scale-105"
                                    >
                                        Request the merch link
                                    </button> */}
                                            </div>
                                        }

                                    </div>

                                    <div className="absolute flex gap-6 bottom-8 right-8">
                                        <Tooltip title="Comming soon" placement="top">
                                            <FavoriteIcon fontSize="large" className='text-gray hover:text-rose-600 hover:cursor-pointer' />
                                        </Tooltip>
                                        <Tooltip title="Comming soon" placement="top">
                                            <StarSharpIcon fontSize="large" className='text-gray hover:text-rose-600 hover:cursor-pointer' />
                                        </Tooltip>

                                    </div>
                                </>
                                :
                                <div className='w-full h-full flex justify-center items-center'>
                                    <DeployNFTVerticalStepper
                                        goBack={() => { setShowDeployStepper(false) }}
                                        deploy={deploy}
                                        contract={deployedContractAddress}
                                        post={post}
                                    />
                                </div>

                        }

                    </div>
                </div>
                <div>
                    <section className='px-2 mx-auto my-12 w-full'>
                        <div className='text-xl font-semibold tracking-wider opacity-90 text-center py-2'>
                            Similar Web3 Style
                        </div>
                        <Masonry posts={displayedPosts} />
                    </section>
                </div>

            </div>
        </div >
    )
}

function BasicMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    }

    const jumpToMerchantPage = () => {
        window.open("https://mfermerch.com/products/mfer-hoodie-project-1-ships-march-16th", "_blank");
    }
    //https://mfermerch.com/products/mfer-hoodie-project-1-ships-march-16th
    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{ color: 'black' }}
                onClick={handleClick}
                startIcon={<ArrowDropUpIcon />}
            >
                Manufacturing Price
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                className="w-full"
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                PaperProps={{
                    style: {
                        width: 300,
                    },
                }}
            >
                <MenuItem onClick={() => {
                    handleClose();
                    jumpToMerchantPage();
                }}>
                    <div className='w-full flex justify-between items-center'>
                        <div className="flex flex-col">
                            <div className='opacity-60 text-xs'>Merchants 1</div>
                            <div className='font-semibold'>$180</div>
                        </div>
                        <div> Buy</div>
                    </div>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleClose();
                    jumpToMerchantPage();
                }}>
                    <div className='w-full flex justify-between items-center'>
                        <div className="flex flex-col">
                            <div className='opacity-60 text-xs'>Merchants 2</div>
                            <div className='font-semibold'>$160</div>
                        </div>
                        <div> Buy</div>
                    </div>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleClose();
                    jumpToMerchantPage();
                }}>
                    <div className='w-full flex justify-between items-center'>
                        <div className="flex flex-col">
                            <div className='opacity-60 text-xs'>Merchants 3</div>
                            <div className='font-semibold'>$200</div>
                        </div>
                        <div> Buy</div>
                    </div>
                </MenuItem>
            </Menu>
        </div>
    );
}

Post.Layout = Layout