import { FC } from 'react'
import Link from 'next/link'
import s from './Navbar.module.css'
import NavbarRoot from './NavbarRoot'
import { Logo, Container } from '@components/ui'
import { Searchbar, UserNav } from '@components/common'
import Image from 'next/image'

interface Link {
  href: string
  label: string
}

interface NavbarProps {
  links?: Link[]
}

const Navbar: FC<NavbarProps> = ({ links }) => (
  <NavbarRoot>
    <Container clean className="mx-auto max-w-8xl px-6">
      <div className={s.nav}>
        <div className="flex items-center flex-1 gap-2">
          <Link href="/">
            <a aria-label="Logo" className='flex justify-center items-center'>
              <Image
                src="/web3shop-logo.png"
                width={32}
                height={32}
                layout="fixed"
                alt="web3shop"
              />
              {/* <Logo /> */}
            </a>
          </Link>
          <nav className="hidden md:flex flex-row text-white gap-2 text-sm">
            <Link href="/community" passHref>
              <a className='bg-gray px-3 py-1 rounded-2xl flex text-center items-center cursor-pointer hover:scale-105'>
                Community
              </a>
            </Link>
            <Link href="/" passHref>
              <a className='bg-black px-3 py-1 rounded-2xl flex text-center items-center cursor-pointer hover:scale-105'>
                Discover
              </a>
            </Link>

            <Searchbar className="rounded-2xl" />
          </nav>
        </div>
        {/* {process.env.COMMERCE_SEARCH_ENABLED && (
          <div className="justify-center flex-1 hidden lg:flex">
            <Searchbar />
          </div>
        )} */}
        <div className="flex items-center justify-end flex-1 space-x-8">
          <UserNav />
        </div>
      </div>
      {/* {process.env.COMMERCE_SEARCH_ENABLED && (
        <div className="flex pb-4 lg:px-6 lg:hidden">
          <Searchbar id="mobile-search" />
        </div>
      )} */}
    </Container>
  </NavbarRoot>
)

export default Navbar
