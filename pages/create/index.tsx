import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Text, useUI } from '@components/ui'
import Image from 'next/image'
import Link from 'next/link'
import NFTCollectionsContent from '@components/nft/NFTCollectionsContent'
import NFTCollections from '@components/nft/NFTCollections'
import { useState } from 'react'

// export async function getStaticProps({
//   preview,
//   locale,
//   locales,
// }: GetStaticPropsContext) {
//   const config = { locale, locales }
//   const { pages } = await commerce.getAllPages({ config, preview })
//   const { categories, brands } = await commerce.getSiteInfo({ config, preview })
//   return {
//     props: {
//       pages,
//       categories,
//       brands,
//     },
//     revalidate: 200,
//   }
// }


const testTemplates = [
    { name: "T-shirt", uri: "/test/template/1.png" },
    { name: "Phone Cases", uri: "/test/template/2.png" },
    { name: "Hoodie", uri: "/test/template/3.png" },
    { name: "Jacket", uri: "/test/template/4.png" },
    { name: "Bag", uri: "/test/template/5.png" },
    { name: "Pillow", uri: "/test/template/6.png" },
    { name: "Cap", uri: "/test/template/7.png" },
    { name: "Inspiration Ben", uri: "/test/template/8.png" },
]

function DesignTemplateCard({ text = "T-shirt", uri = "/test/template/1.png" }) {
    return (
        <div>
            <div className="relative ring-1 ring-black ring-opacity-70 rounded-xl flex items-center justify-center overflow-hidden p-4">
                <Image
                    className="p-8 pointer-events-none object-contain"
                    alt="banner-test"
                    src={uri}
                    layout="intrinsic"
                    width={800}
                    height={800}
                />
                <div className='absolute left-0 right-0 top-0 bottom-0 my-auto mx-auto bg-neutral-800 text-white bg-opacity-70 h-20 w-20 rounded-full flex justify-center items-center text-center hover:cursor-pointer'>
                    Upload NFT
                </div>
            </div>
            <div className='text-center p-2 '>
                {text}
            </div>
        </div>


    )
}

export default function Home() {
    const [step, setStep] = useState(1);
    const {
        setModalView,
        openModal,
    } = useUI()

    return (
        <div className="max-w-7xl mx-8 sm:mx-auto py-20 flex flex-col items-center justify-center fit">
            {
                step === 1 &&
                <div className='w-full flex flex-col items-center'>
                    <Text variant="sectionHeading">Choose a nft collection you own for creation</Text>
                    <NFTCollections />
                </div>
            }

            {
                step > 1 && <div className=''>
                    <div className='w-full grid grid-cols-6 gap-4 items-center justify-items-center'>
                        <Text variant="sectionHeading" className='col-start-3 col-span-2'>Choose a template</Text>


                        <div className='col-start-5 col-span-2 justify-self-end'>
                            <button
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-2xl text-white bg-[#DF5949] hover:bg-[#e12b17] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DF5949]"
                                onClick={() => {
                                    setModalView("UPLOAD_PRODUCT_VIEW");
                                    openModal();
                                }}
                            >
                                Custom Upload
                            </button>
                        </div>
                    </div>
                    <div className='w-full grid grid-cols-1 gap-8 mt-6 sm:grid-cols-2 lg:grid-cols-4 px-4'>
                        {
                            testTemplates.map((item, index) =>
                                <DesignTemplateCard key={item.name} name={item.name} uri={item.uri} />
                            )
                        }

                        {/* <DesignTemplateCard />
                        <DesignTemplateCard />
                        <DesignTemplateCard />
                        <DesignTemplateCard />
                        <DesignTemplateCard />
                        <DesignTemplateCard />
                        <DesignTemplateCard /> */}
                    </div>
                </div>
            }


            <div className='flex gap-8'>
                <button onClick={() => { setStep((step) => step + 1) }} className='bg-[#DF5949] hover:bg-[#e12b17] w-36 py-2 rounded-2xl text-white text-center'>
                    Next
                </button>
            </div>

        </div >
    )
}

Home.Layout = Layout
