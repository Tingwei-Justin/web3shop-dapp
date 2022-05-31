import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { rankingUsersInWeb3Graph, userAddress } from 'states/user';
import { parseAddressForShow } from '@components/common/Masonry/MasonryGallery';
import { client, FollowStatusQuery } from '@lib/cyberconnect-query';
import { classNames } from 'pages';
import { useMoralis } from 'react-moralis';
import CyberConnect, { Env, Blockchain, ConnectionType } from "@cyberlab/cyberconnect";

const ITEM_HEIGHT = 48;

function generate(element: React.ReactElement) {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

function getIcon(address: string) {
  const num = parseInt(address.slice(-4), 16);
  return `/logo/${num % 4}.png`;
}


function UserItem({ user }) {
  const [connection, setConnection] = React.useState({});
  const [isFollowing, setIsFollowing] = React.useState(false);
  const { web3, isWeb3Enabled, enableWeb3, provider, authenticate, isAuthenticated } = useMoralis();
  const [cyberConnect, setCyberConnect] = React.useState(null);
  const [address, setAddress] = useRecoilState<string>(userAddress);

  React.useEffect(() => {
    if (!address || address.length == 0) {
      return;
    }
  }, [address])

  React.useEffect(() => {
    const variables = {
      from: address,
      to: [user.address],
    };
    client
      .request(FollowStatusQuery, variables)
      .then((res) => {
        if (res?.connections?.length > 0) {
          setConnection(res.connections[0])
          setIsFollowing(res.connections[0].followStatus?.isFollowing)
        }
        console.log(res?.connections);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [user.address, address]);


  React.useEffect(() => {
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

  React.useEffect(() => {
    async function init() {
      await enableWeb3();
    }
    if (isWeb3Enabled) {
      console.log("isWeb3Enabled");
      console.log("provider", provider);
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

  return (
    <ListItem
      key={user?.address ?? idx}
      secondaryAction={
        <IconButton edge="end">
          <button className={classNames(
            'w-20 h-8 rounded-xl text-center text-sm hover:scale-105 hover:font-bold',
            isFollowing ? ' ring-gray ring-1 font-semibold text-black text-opacity-80' : 'text-white bg-black font-bold'
          )}
            onClick={onHandleFollow}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar alt={parseAddressForShow(user.address)} src={user.avatar?.length > 0 ? user.avatar : getIcon(user.address)} />
        {/* <Avatar>
        <GroupAddIcon />
      </Avatar> */}
      </ListItemAvatar>
      <ListItemText
        primary={user?.domain?.length > 0 ? user?.domain : parseAddressForShow(user.address)}
        secondary={`${user.followerCount} followers`}
      />
    </ListItem>
  )
}
export default function RankingUsers() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const rankingUsers = useRecoilValue(rankingUsersInWeb3Graph);

  // console.log(rankingUsers);
  const open = Boolean(anchorEl);

  // React.useEffect(() => {

  // }, [rankingUsers])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        sx={{ color: 'black', backgroundColor: 'white', borderColor: 'black' }}
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <GroupAddIcon />
        <span className='text-sm px-2'>Web3 Soulmate</span>
      </Button>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 8,
            width: '32rem',
          },
        }}
      >
        <List dense={false}>
          {
            rankingUsers.map((user, idx) =>
            (
              <UserItem key={user?.address ?? idx} user={user} />
            ))
          }
        </List>
      </Menu>
    </div>
  );
}
