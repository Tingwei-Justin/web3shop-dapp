import cn from 'clsx'
import s from './Layout.module.css'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { CommerceProvider } from '@framework'
import LoginView from '@components/auth/LoginView'
import { useUI } from '@components/ui/context'
import { Navbar, Footer } from '@components/common'
import ShippingView from '@components/checkout/ShippingView'
import CartSidebarView from '@components/cart/CartSidebarView'
import { useAcceptCookies } from '@lib/hooks/useAcceptCookies'
import { Sidebar, Button, LoadingDots } from '@components/ui'
import PaymentMethodView from '@components/checkout/PaymentMethodView'
import CheckoutSidebarView from '@components/checkout/CheckoutSidebarView'
import { CheckoutProvider } from '@components/checkout/context'
import { MenuSidebarView } from '@components/common/UserNav'
import type { Page } from '@commerce/types/page'
import type { Category } from '@commerce/types/site'
import type { Link as LinkProps } from '../UserNav/MenuSidebarView'
import { useRecoilState, useRecoilValueLoadable } from 'recoil'
import { userAddress, userAllInfoSelector, userCommunities, UserFollowingCommunitiesSelector } from 'states/user'
import { useMoralis } from 'react-moralis'
import { useEffect, useState } from 'react'
import { ProductUploadView } from '@components/product/ProductModal'
import Hint from '../Hint'

const Loading = () => (
  <div className="w-80 h-80 flex items-center text-center justify-center p-3">
    <LoadingDots />
  </div>
)

const dynamicProps = {
  loading: Loading,
}

const SignUpView = dynamic(() => import('@components/auth/SignUpView'), {
  ...dynamicProps,
})

const ForgotPassword = dynamic(
  () => import('@components/auth/ForgotPassword'),
  {
    ...dynamicProps,
  }
)

const FeatureBar = dynamic(() => import('@components/common/FeatureBar'), {
  ...dynamicProps,
})

const Modal = dynamic(() => import('@components/ui/Modal'), {
  ...dynamicProps,
  ssr: false,
})

interface Props {
  pageProps: {
    pages?: Page[]
    categories: Category[]
  }
}

const ModalView: React.FC<{ modalView: string; closeModal(): any }> = ({
  modalView,
  closeModal,
}) => {
  return (
    <Modal onClose={closeModal}>
      {modalView === 'LOGIN_VIEW' && <LoginView />}
      {modalView === 'SIGNUP_VIEW' && <SignUpView />}
      {modalView === 'FORGOT_VIEW' && <ForgotPassword />}
      {modalView === 'UPLOAD_PRODUCT_VIEW' && <ProductUploadView />}
      {modalView === 'POST_VIEW' && <ProductUploadView />}
    </Modal>
  )
}

const ModalUI: React.FC = () => {
  const { displayModal, closeModal, modalView } = useUI()
  return displayModal ? (
    <ModalView modalView={modalView} closeModal={closeModal} />
  ) : null
}

const SidebarView: React.FC<{
  sidebarView: string
  closeSidebar(): any
  links: LinkProps[]
}> = ({ sidebarView, closeSidebar, links }) => {
  return (
    <Sidebar onClose={closeSidebar}>
      {sidebarView === 'CART_VIEW' && <CartSidebarView />}
      {sidebarView === 'SHIPPING_VIEW' && <ShippingView />}
      {sidebarView === 'PAYMENT_VIEW' && <PaymentMethodView />}
      {sidebarView === 'CHECKOUT_VIEW' && <CheckoutSidebarView />}
      {sidebarView === 'MOBILE_MENU_VIEW' && <MenuSidebarView links={links} />}
    </Sidebar>
  )
}

const SidebarUI: React.FC<{ links: LinkProps[] }> = ({ links }) => {
  const { displaySidebar, closeSidebar, sidebarView } = useUI()
  return displaySidebar ? (
    <SidebarView
      links={links}
      sidebarView={sidebarView}
      closeSidebar={closeSidebar}
    />
  ) : null
}

const Layout: React.FC<Props> = ({
  children,
  pageProps: { categories = [], ...pageProps },
}) => {
  const { acceptedCookies, onAcceptCookies } = useAcceptCookies()
  const { locale = 'en-US' } = useRouter()
  const [open, setOpen] = useState(true);
  const [address, setAddress] = useRecoilState<string>(userAddress);
  const [followings, setFollowings] = useRecoilState(userCommunities);
  const userFollowingCommunitiesLoadable = useRecoilValueLoadable(UserFollowingCommunitiesSelector);
  const userLoadable = useRecoilValueLoadable(userAllInfoSelector);
  const { isAuthenticated, user: web3user } = useMoralis();

  useEffect(() => {
    if (userLoadable.state === "hasValue") {
      const userInfo = userLoadable.contents;
      console.log(userInfo);
      // First time login: go to community page.
      // if (address && userInfo && !userInfo?.regesteredUser) {
      //   router.push("/community");
      // }
    }
  }, [userLoadable.state, userLoadable.contents, address]);



  useEffect(() => {
    // initial the user's following communities
    if (userFollowingCommunitiesLoadable.state === "hasValue") {
      setFollowings(userFollowingCommunitiesLoadable.contents);
    }
  }, [
    userFollowingCommunitiesLoadable.state,
    userFollowingCommunitiesLoadable.contents,
    setFollowings
  ]);

  useEffect(() => {
    if (isAuthenticated && web3user?.get("ethAddress")) {
      setAddress(web3user.get("ethAddress"));
    }
  }, [isAuthenticated, web3user, setAddress]);

  const navBarlinks = categories.slice(0, 2).map((c) => ({
    label: c.name,
    href: `/search/${c.slug}`,
  }))

  return (
    <CommerceProvider locale={locale}>
      <div className={cn(s.root)}>
        <Hint
          open={open}
          setOpen={setOpen}
          message={"DEMO"}
          type={"warning"}
          vertical="top"
          horizontal='center'
        />
        <Navbar links={navBarlinks} />
        <main className="fit">{children}</main>
        <Footer pages={pageProps.pages} />
        <ModalUI />
        <CheckoutProvider>
          <SidebarUI links={navBarlinks} />
        </CheckoutProvider>
        {/* <FeatureBar
          title="This site uses cookies to improve your experience. By clicking, you agree to our Privacy Policy."
          hide={acceptedCookies}
          action={
            <Button className="mx-5" onClick={() => onAcceptCookies()}>
              Accept cookies
            </Button>
          }
        /> */}
      </div>
    </CommerceProvider>
  )
}

export default Layout
