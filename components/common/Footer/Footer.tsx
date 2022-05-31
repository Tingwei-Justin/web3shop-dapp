import { FC } from 'react'
import cn from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { Page } from '@commerce/types/page'
import getSlug from '@lib/get-slug'
import { Github, Vercel } from '@components/icons'
import { Logo, Container } from '@components/ui'
import { I18nWidget } from '@components/common'
import s from './Footer.module.css'
import Image from 'next/image'

interface Props {
  className?: string
  children?: any
  pages?: Page[]
}

const links = [
  // {
  //   name: 'Home',
  //   url: '/',
  // },
]

const Footer: FC<Props> = ({ className, pages }) => {
  const { sitePages } = usePages(pages)
  const rootClassName = cn(s.root, className)

  return (
    <footer className={rootClassName}>
      <Container>
        <div className="w-full flex flex-col justify-center items-center gap-8 border-b border-accent-2 py-12 text-primary bg-primary transition-colors duration-150">
          <Image
            src="/web3shop.png"
            width={800}
            height={100}
            layout="intrinsic"
            objectFit="contain"
            alt="web3shop"
          />
          <div className='text-lg font-semibold tracking-widest'>
            Shop it, Show it, or Web3 it
          </div>
          <div>
            <Link href="/">
              <a className="flex flex-initial items-center font-bold">
                <span className="rounded-full mr-2">
                  <Image
                    src="/web3shop-logo.png"
                    width={32}
                    height={32}
                    layout="fixed"
                    alt="web3shop"
                  />
                </span>
                <span>Web3Shop</span>
              </a>
            </Link>
          </div>

          {/* <div className="col-span-1 lg:col-span-2 flex items-start lg:justify-end text-primary">
            <div className="flex space-x-6 items-center h-10">
              <a
                className={s.link}
                aria-label="Github Repository"
                href="https://github.com/vercel/commerce"
              >
                <Github />
              </a>
              <I18nWidget />
            </div>
          </div> */}
        </div>
        <div className="py-10 flex flex-col md:flex-row justify-center items-center space-y-4 text-accent-6 text-sm">
          <div>
            <span>&copy; 2022 Web3Shop | Lab3</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}

function usePages(pages?: Page[]) {
  const { locale } = useRouter()
  const sitePages: Page[] = []

  if (pages) {
    pages.forEach((page) => {
      const slug = page.url && getSlug(page.url)
      if (!slug) return
      if (locale && !slug.startsWith(`${locale}/`)) return
      sitePages.push(page)
    })
  }

  return {
    sitePages: sitePages.sort(bySortOrder),
  }
}

// Sort pages by the sort order assigned in the BC dashboard
function bySortOrder(a: Page, b: Page) {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0)
}

export default Footer
