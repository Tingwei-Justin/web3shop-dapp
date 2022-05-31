import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import RefreshIcon from '@mui/icons-material/Refresh';
import { Checkbox, Tooltip } from '@mui/material';
// import tw from 'twin.macro';
// import FeedbackSnackbar from '../FeedbackSnackbar';

function NFTCard({ nftItem }) {

  const [metadata, setMetadata] = useState(null);
  const [imageURI, setImageURI] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [open, setOpen] = useState(false);

  const [checked, setChecked] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  // console.log(nftItem);
  useEffect(() => {
    if (nftItem?.metadata != null && nftItem?.metadata.length > 0) {
      const metadataJson = JSON.parse(nftItem.metadata);
      setMetadata(metadataJson);
      let image: string = metadataJson?.image ?? "";

      if (image.length > 0) {
        const IPFS_BASE_URI = "https://gateway.moralisipfs.com/ipfs/"//"https://gateway.moralisipfs.com/ipfs/";
        let suffix = ""
        if (image.includes("ipfs://")) {
          suffix = image.split("ipfs://").pop();
        } else if (image.includes("/ipfs/")) {
          suffix = image.split("/ipfs/").pop();
        }
        if (suffix.length > 0) {
          setImageURI(`${IPFS_BASE_URI}${suffix}`);
        } else {
          setImageURI(image);
        }
      }
    }
  }, [nftItem])

  async function refreshMetadata(id: string, address: string) {
    const result = await (await fetch(`/api/refreshNFTMetadata?address=${address}&id=${id}`)).json();
    if (result.status === "success") {
      setFeedbackMsg("We've queued this item for an update! Check back in a minute...");
    } else {
      setFeedbackMsg("Error happened, please try again later.");
    }
    setOpen(true);
  }

  return (
    <div className="relative p-4 border-r border-b border-gray-200 sm:p-6">
      {/* <FeedbackSnackbar open={open} setOpen={setOpen} message={feedbackMsg} type={feedbackMsg.includes("error") ? "error" : "success"} /> */}
      {
        metadata != null && <>
          <div className="rounded-lg overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 hover:opacity-60">
            <img
              alt={`${nftItem.token_address}/${nftItem.token_id}`}
              src={imageURI}
              className="w-full h-full object-center object-cover"
            />
            {/* <Image
              alt={`${nftItem.token_address}/${nftItem.token_id}`}
              src={imageURI}
              // src={`/api/imageproxy?url=${encodeURIComponent(imageURI)}`}
              layout="responsive"
              width={500}
              height={500}
              objectFit="cover"
            /> */}
          </div>
          <div className="flex justify-center gap-2">
            <Tooltip
              onClick={() => {
                console.log(nftItem);
                refreshMetadata(nftItem?.token_id, nftItem?.token_address)
              }}
              title="Refresh metadata"
              placement="top"
              className="mt-2 bg-gray-200 hover:bg-gray-100 hover:shadow-lg hover:cursor-pointer)">
              <div className="w-8 h-8 justify-center flex items-center rounded-lg">
                <RefreshIcon fontSize="small" color="action" />
              </div>
            </Tooltip>
          </div>
          <div className="pt-4 pb-4 text-center">
            <h3 className="text-sm font-medium text-gray-900">

              {/* <RefreshIcon fontSize="small" color="action" /> */}
              <Link href={`https://etherscan.io/address/${nftItem.token_address}`} passHref>
                <Tooltip
                  title="View contract on etherscan"
                  placement="top"
                >
                  <a target="_blank" rel="noreferrer">
                    {nftItem.symbol}
                  </a>
                </Tooltip>
              </Link>


            </h3>
            <p className="mt-1 text text-gray-700">#{nftItem.token_id.length <= 5 ? nftItem.token_id : metadata?.name}</p>
            <p className="mt-1 text-sm text-gray-500">{nftItem.contract_type}</p>
            {/* <p className="mt-4 text-base font-medium text-gray-900"># {nftItem.token_id}</p> */}

            <Checkbox
              checked={checked}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        </>
      }

    </div>
  )
}

export default NFTCard