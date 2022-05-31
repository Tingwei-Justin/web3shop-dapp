import { FC, useEffect, useState, useCallback } from 'react'
import { Info } from '@components/icons'
import { useUI } from '@components/ui/context'
import { Logo, Button } from '@components/ui'
import Image from 'next/image'
import { Autocomplete, Checkbox, FormControlLabel, Input, Switch, TextField } from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useRecoilState } from 'recoil'
import { userAddress } from 'states/user'
import ReactPlayer from 'react-player'
import Hint from '@components/common/Hint'
import { useMoralis } from 'react-moralis'

interface Props { }

// function isImage(url) {
//     return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
// }


const ProductUploadView: FC<Props> = () => {
    const [address, setAddress] = useRecoilState<string>(userAddress);
    const { authenticate, isAuthenticated } = useMoralis();
    // Form State
    const [isDesign, setIsDesign] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");///product-img-placeholder.svg
    const [collection, setCollection] = useState({});
    const [loading, setLoading] = useState(false)
    const [isImage, setIsImage] = useState(true)
    const [message, setMessage] = useState('')
    const [dirty, setDirty] = useState(false)
    const [disabled, setDisabled] = useState(false)

    //HINT PART
    const [openHint, setOpenHint] = useState(false)
    const [hintMessage, setHintMessage] = useState("");
    const [hintType, setHintType] = useState("success");

    const { setModalView, closeModal } = useUI()

    useEffect(() => {
        async function init() {
            await authenticate();
        }
        if (!isAuthenticated) {
            closeModal();
            init();
        }
    }, [isAuthenticated, authenticate, closeModal])

    const handleSubmit = async (e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault();
        setLoading(true);
        const data = JSON.stringify({
            "name": title,
            "desc": content,
            "collection": collection.contract,
            "userWallet": address,
            "isDesign": isDesign,
            "imageUrl": imageUrl === "/error-415.png" ? "" : imageUrl,
            "tags": [collection.title],
        });
        const res = await fetch("/api/post/create", {
            method: "POST",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
            },
            body: data,
        })
            .then(async (res) => {
                if (res.ok) {
                    setLoading(false);
                    setHintMessage(`Your Web3 post arrived successfully`);
                    setHintType("success");
                    setOpenHint(true);
                    closeModal();
                } else {
                    setLoading(false);
                    console.log("post failed!", res);
                    // setFeedbackMsg("Error happened, please try again!");
                }
            }).catch((err) => {
                setLoading(false);
                console.error(err);
            })
    }
    return (
        <div className="w-[56rem] flex justify-center gap-10">
            <Hint
                open={openHint}
                setOpen={setOpenHint}
                message={hintMessage}
                type={hintType}
            />
            {
                imageUrl && imageUrl.length > 0 &&
                <div className="flex-1 flex relative overflow-hidden">
                    {/* <img
                        className="pointer-events-none object-center object-contain"
                        alt="placeholder"
                        src={imageUrl}
                        onError={() => { console.log("img error") }}
                    /> */}
                    {
                        (isImage || imageUrl === "/error-415.png") ? <img
                            className="pointer-events-none object-center object-contain"
                            alt="placeholder"
                            src={imageUrl}
                            onError={() => {
                                setIsImage(false);
                                // setImageUrl("/product-img-placeholder.svg")
                            }}
                        /> :
                            <div className='w-full h-full flex items-center justify-center'>
                                {/* FB: https://www.facebook.com/watch/?v=10153231379946729 */}
                                {/* Youtube: https://www.youtube.com/watch?v=ysz5S6PUM-U */}
                                {/* 
                      <source src=http://techslides.com/demos/sample-videos/small.webm type=video/webm> 
                        <source src=http://techslides.com/demos/sample-videos/small.ogv type=video/ogg> 
                        <source src=http://techslides.com/demos/sample-videos/small.mp4 type=video/mp4>
                    */}
                                <ReactPlayer url={imageUrl}
                                    // className='w-full h-full flex items-center justify-center'
                                    width='100%'
                                    controls="true"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    onError={() => {
                                        setImageUrl("/error-415.png")
                                    }}
                                />
                            </div>
                    }

                </div>
            }

            <form
                className="flex-1 flex flex-col justify-between p-3"
            >
                {/* <div className="flex justify-center pb-12 ">
                    <Logo width="64px" height="64px" />
                </div> */}
                <div className="flex flex-col space-y-4">
                    {/* {message && (
                    <div className="text-red border border-red p-3">{message}</div>
                )} */}
                    <Input placeholder="Title" onChange={(e) => { setTitle(e.target.value) }} />
                    <TextField
                        id="outlined-multiline-static"
                        label="Post Content"
                        multiline
                        rows={5}
                        placeholder="Content"
                        onChange={(e) => { setContent(e.target.value) }}
                    />
                    <FormControlLabel
                        control={
                            <Switch checked={isDesign} onChange={() => { setIsDesign((isDesign) => !isDesign) }} name="gilad" />
                        }
                        label="Design for sell?"
                        className='font-semibold'
                    />
                    <Input placeholder="Media URI (support mostly image and video types)" label="Image URI" type="url" onChange={(e) => {
                        setImageUrl(e.target.value);
                        setIsImage(true);
                    }} />
                    <CommunityCheckboxesTags setCollection={setCollection} />

                    <span className="text-accent-8">
                        <span className="inline-block align-middle ">
                            <Info width="15" height="15" />
                        </span>{' '}
                        <span className="leading-6 text-sm">
                            <strong>Notice</strong>: Test ONLY{' '}
                        </span>
                    </span>
                    <div className="pt-2 w-full flex flex-col">

                        <Button
                            variant="slim"
                            onClick={handleSubmit}
                            loading={loading}
                            disabled={disabled}
                        >
                            Upload
                        </Button>

                    </div>
                </div>
            </form>
        </div>

    )
}

export default ProductUploadView


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function CommunityCheckboxesTags({ setCollection }) {
    return (
        <Autocomplete
            id="community-tags"
            options={topCollections}
            disableCloseOnSelect
            getOptionLabel={(option) => option.title}
            onChange={(event, collection) => { setCollection(collection) }}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option.title}
                </li>
            )}
            // style={{ width: 500 }}
            renderInput={(params) => (
                <TextField {...params} label="NFT Collection" placeholder="Choose an nft community it belongs to" onChange={(e) => { console.log(e.target) }} />
            )}
        />
    );
}

const topCollections = [
    { title: 'Bored Ape Yacht Club', contract: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d" },
    { title: 'Azuki', contract: "0xed5af388653567af2f388e6224dc7c4b3241c544" },
    { title: 'mfer', contract: "0x79fcdef22feed20eddacbb2587640e45491b757f" },
    { title: "Moonbirds", contract: "0x23581767a106ae21c074b2276d25e5c3e136a68b" },
    {
        title: "Crypto Coven",
        contract: "0x5180db8f5c931aae63c74266b211f580155ecac8",
    },
    // { title: 'mferspet', contract: "0xb51fec702a259759690ab0e8648033d18ef099c1" },
    {
        title: 'goblintown.wtf',
        contract: "0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e",
    },
    { title: 'Doodles', contract: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e" },
    { title: 'Boki', contract: "0x248139afb8d3a2e16154fbe4fb528a3a214fd8e7" },
    { title: 'meebits', contract: "0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7" },
    { title: 'DEGEN TOONZ COLLECTION', contract: "0x19b86299c21505cdf59ce63740b240a9c822b5e4" },

]