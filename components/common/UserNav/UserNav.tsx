import cn from 'clsx'
import Link from 'next/link'
import s from './UserNav.module.css'
import useCart from '@framework/cart/use-cart'
import { useUI } from '@components/ui/context'
import { Heart, Bag, Menu } from '@components/icons'
import CustomerMenuContent from './CustomerMenuContent'
import useCustomer from '@framework/customer/use-customer'
import { ConnectButton } from 'web3uikit'
import React from 'react'
import {
  Dropdown,
  DropdownTrigger as DropdownTriggerInst,
  Button,
} from '@components/ui'

import type { LineItem } from '@commerce/types/cart'
import { useRecoilValue } from 'recoil'
import { userAddress } from 'states/user'
import { Avatar, Tooltip } from '@mui/material'
import { parseAddressForShow } from '@utils/'
import { getRandomIconFromAddress } from '@lib/util'

const countItem = (count: number, item: LineItem) => count + item.quantity

const UserNav: React.FC<{
  className?: string
}> = ({ className }) => {
  const { data } = useCart()
  const { data: isCustomerLoggedIn } = useCustomer()
  const {
    toggleSidebar,
    closeSidebarIfPresent,
    openModal,
    setSidebarView,
    openSidebar,
  } = useUI()
  const address = useRecoilValue(userAddress);
  const itemsCount = data?.lineItems.reduce(countItem, 0) ?? 0
  const DropdownTrigger = isCustomerLoggedIn
    ? DropdownTriggerInst
    : React.Fragment

  return (
    <nav className={cn(s.root, className)}>
      <ul className={s.list}>
        <li>
          <ConnectButton moralisAuth={true} />
          {/* <div className="bg-black px-3 py-1 rounded-2xl flex text-center items-center text-white text-sm">
            <ConnectButton />
          </div> */}
        </li>
        {/* {process.env.COMMERCE_CART_ENABLED && (
          <li className={s.item}>
            <Button
              className={s.item}
              variant="naked"
              onClick={() => {
                setSidebarView('CART_VIEW')
                toggleSidebar()
              }}
              aria-label={`Cart items: ${itemsCount}`}
            >
              <Bag />
              {itemsCount > 0 && (
                <span className={s.bagCount}>{itemsCount}</span>
              )}
            </Button>
          </li>
        )}
        {process.env.COMMERCE_WISHLIST_ENABLED && (
          <li className={s.item}>
            <Link href="/wishlist">
              <a onClick={closeSidebarIfPresent} aria-label="Wishlist">
                <Heart />
              </a>
            </Link>
          </li>
        )} */}
        {/* {process.env.COMMERCE_CUSTOMERAUTH_ENABLED && ( */}
        {
          address?.length > 0 ?
            <Tooltip title="Profile supported by CyberConnect" placement="bottom">
              <li className={s.item}>
                <Link href={`https://app.cyberconnect.me/address/${address}`}>
                  <a target="_blank" className='flex justify-center gap-2 hover:bg-slate-100 p-1 rounded-full hover:cursor-pointer'>
                    <Avatar className='hover:scale-105 ring-2 ring-black ring-opacity-10' sx={{ width: 38, height: 38 }} alt={address} src={getRandomIconFromAddress(address)} />
                  </a>
                </Link>
              </li>
            </Tooltip> :
            <Tooltip title="Please connect wallet first" placement="bottom">
              <li className={s.item}>
                <a className='flex justify-center gap-2 hover:bg-slate-100 p-1 rounded-full hover:cursor-pointer'>
                  <Avatar className='hover:scale-105 ring-2 ring-black ring-opacity-10' sx={{ width: 38, height: 38 }} />
                </a>
              </li>
            </Tooltip>

        }

        {/* )} */}
        <li className={s.mobileMenu}>
          <Button
            className={s.item}
            aria-label="Menu"
            variant="naked"
            onClick={() => {
              openSidebar()
              setSidebarView('MOBILE_MENU_VIEW')
            }}
          >
            <Menu />
          </Button>
        </li>
      </ul>
    </nav>
  )
}

export default UserNav
