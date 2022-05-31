import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import RefreshIcon from '@mui/icons-material/Refresh';
import { Checkbox } from '@mui/material';
import { classNames } from 'pages';
import { Skeleton } from 'web3uikit';
// import tw from 'twin.macro';
// import FeedbackSnackbar from '../FeedbackSnackbar';


function NFTImage({ metadata }) {
  const [imageURI, setImageURI] = useState("");
  useEffect(() => {
    if (metadata != null && metadata.length > 0) {
      const metadataJson = JSON.parse(metadata);
      // console.log(metadataJson);
      // setMetadata(metadataJson);
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
  }, [metadata])
  const handleImageError = (e) => {
    // console.log("errorr", e);
    setImageURI("/test/unsupported.png");
  }
  return imageURI && imageURI.length > 0 ?
    <img
      alt={`${imageURI}`}
      src={imageURI || "/test/avator/1.png"}
      className="w-full h-full object-center object-cover"
      onError={handleImageError}
    /> :
    <Skeleton animation="wave" variant="rectangular" width={100} height={100} className="rounded-lg" />
}

export default function NFTCollectionCard({ collection }) {

  const [metadata, setMetadata] = useState(null);
  const [collectionInfo, setCollectionInfo] = useState({ name: "", count: 0, metadatas: [] });
  const [imageURI, setImageURI] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [open, setOpen] = useState(false);

  const [checked, setChecked] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  // console.log(collection);

  useEffect(() => {
    if (collection?.length >= 0) {
      setCollectionInfo(
        {
          name: collection[0]?.name,
          count: collection.length,
          metadatas: collection.map((item) => item?.metadata ?? {}),
        }
      )
    }
  }, [collection])

  return (
    <div className="relative p-4 sm:p-6">
      <div className={classNames("rounded-2xl grid grid-cols-1 h-72 w-72 overflow-hidden hover:scale-105 hover:shadow-2xl",
        collectionInfo.metadatas.length > 1 && collectionInfo.metadatas.length <= 4 && "grid-cols-2",
        collectionInfo.metadatas.length > 4 && collectionInfo.metadatas.length <= 9 && "grid-cols-3",
      )}>
        {
          collectionInfo.metadatas.map((metadata, idx) =>
            <div key={idx}>
              <NFTImage metadata={metadata} />
            </div>)
        }
      </div>
      <div className="mt-2 mx-2 flex justify-between">
        <div>
          <div>{collectionInfo.name}</div>
          <div className="text-sm opacity-70">{collectionInfo.count} collectible</div>
        </div>

        <Checkbox
          checked={checked}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </div>

    </div>
  )
}