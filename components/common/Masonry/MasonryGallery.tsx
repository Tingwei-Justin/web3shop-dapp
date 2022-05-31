import Masonry from 'react-masonry-css'
import React, { useState } from 'react'
import s from './MasonryGallery.module.css'
import Image from 'next/image'
// import Avatar from '../Avatar'
import { Tag } from 'web3uikit'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Avatar, Button, Chip } from '@mui/material'
import BrushIcon from '@mui/icons-material/Brush';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import ReactPlayer from 'react-player'
import { getRandomIconFromAddress } from '@lib/util'

export function parseAddressForShow(address: string) {
    return `${address.slice(0, 3)}...${address.slice(-2)}`
}
const breakpointColumnsObj = {
    default: 5,
    900: 3,
    700: 2,
};


function isImageValid(src) {
    let promise = new Promise(resolve => {
        let img = document.createElement("img");
        img.onerror = () => resolve(false);
        img.onload = () => resolve(true);
        img.src = src;
    });

    return promise;
}

function Img({ src, setImageError, ...rest }) {
    const imgEl = React.useRef(null);
    React.useEffect(
        () => {
            isImageValid(src).then(isValid => {
                if (!isValid) {
                    setImageError(true);
                    // imgEl.current.src = fallbackSrc;
                }
            });
        },
        [src, setImageError]
    );

    return <img {...rest} ref={imgEl} src={src} />;
}

function MediaPostCard({ post, handleClick }) {
    // const [imageError, setImageError] = useState(false);
    // const [imageUrl, setImageUrl] = useState(post?.data?.imageUrl);
    const [imageError, setImageError] = useState(false);
    const [placeholderImg, setPlaceholderImg] = useState("");

    return (
        <button onClick={() => { handleClick(post) }} className="w-full">
            <div className="self-center mb-8 group hover:cursor-pointer overflow-hidden">
                <div className='relative m-3 rounded-2xl overflow-hidden' >

                    <div className='transition ease-in-out delay-50 duration-300 hover:scale-110'>

                        {
                            (!imageError || placeholderImg === "/error-415.png") ?


                                <Img
                                    alt="img"
                                    className='rounded-2xl transition-opacity relative z-0 group-hover:brightness-110'
                                    src={placeholderImg === "/error-415.png" ? placeholderImg : post?.data?.imageUrl}
                                    setImageError={setImageError}
                                // fallbackSrc="/error-415.png"
                                // onError={() => {
                                //     setImageError(true);
                                // }}
                                />

                                :
                                <div className='w-full h-full flex items-center justify-center pointer-events-none'>
                                    <ReactPlayer url={post?.data?.imageUrl}
                                        width='100%'
                                        height='100%'
                                        // controls="true"
                                        style={{
                                            objectFit: "fill"
                                        }}
                                        onError={() => {
                                            setPlaceholderImg("/error-415.png")
                                        }}
                                    />
                                </div>
                        }

                    </div>
                    <div className='absolute top-4 left-4'>
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
                    {/* <div className='hidden absolute right-2 top-0 bottom-0 my-auto z-20 group-hover:flex'>
                <div className='self-center flex flex-col gap-2 group-hover:cursor-pointer'>
                    <div className='flex flex-col gap-1 justify-center'>
                        <Image alt="heart" src="/icons/heart.png" width={25} height={25} />
                        <span className='text-gray-2 text-sm'>32w</span>
                    </div>
                    <div className='flex flex-col gap-1 justify-center'>
                        <Image alt="info" src="/icons/info.png" width={25} height={25} />
                        <span className='text-gray-2 text-sm'>3.9w</span>
                    </div>
                    <div className='flex flex-col gap-1 justify-center'>
                        <Image alt="star" src="/icons/star.png" width={25} height={25} />
                        <span className='text-gray-2 text-sm'>1.3w</span>
                    </div>
                    <div className='flex flex-col gap-1 justify-center'>
                        <Image alt="retweet" src="/icons/retweet.png" width={25} height={25} />
                        <span className='text-gray-2 text-sm'>1w</span>
                    </div>
                </div>
            </div> */}
                </div>

                <div className='w-full flex flex-col mx-3'>
                   
                    <Link href={`https://app.cyberconnect.me/address/${post?.data?.userWallet}`}>
                        <a target="_blank" className='flex gap-2 items-center py-2'>
                            <Avatar className='hover:scale-110 ring-2 ring-black ring-opacity-10' sx={{ width: 28, height: 28 }} alt={parseAddressForShow(post?.data?.userWallet)} src={getRandomIconFromAddress(post?.data?.userWallet)} />
                            <span className='text-sm opacity-70'>{parseAddressForShow(post?.data?.userWallet)}</span>
                        </a>
                    </Link>

                    {/* <div className='opacity-80 px-1'>
                ❤️👍😂 1.6k
            </div> */}
                </div>
            </div>
        </button>
    )

}

function MasonryGallery({ posts, customBreakpointObj }) {
    const router = useRouter();


    function handleClick(post) {
        router.push(`/post/${post?.id ?? "unknown"}`);
    }

    return (
        <Masonry
            breakpointCols={customBreakpointObj ?? breakpointColumnsObj}
            className={s.myGasonryGrid}
            columnClassName={s.myGasonryGridColumn}>
            {
                posts.map((post, index) => (
                    <MediaPostCard key={post?.id ?? index} post={post} handleClick={handleClick} />
                ))
            }
        </Masonry>
    )
}

export default MasonryGallery