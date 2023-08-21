import { useState } from 'react';
import cn from 'classnames';
import { useWindowScroll } from '@/lib/hooks/use-window-scroll';
import Hamburger from '@/components/ui/hamburger';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useDrawer } from '@/components/drawer-views/context';
import Sidebar from '@/layouts/dashboard/_sidebar';
import React, { FC, useMemo } from 'react';
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';

require('@demox-labs/aleo-wallet-adapter-reactui/dist/styles.css');

function HeaderRightArea() {
  return (
    <div className="relative order-last flex shrink-0 items-center rounded-lg bg-soft-lavender scale-110 gap-3 sm:gap-6 lg:gap-8 ">
      <WalletMultiButton className="bg-soft-lavender" />
    </div>
  );
}

export function Header() {
  const { openDrawer } = useDrawer();
  const isMounted = useIsMounted();
  let windowScroll = useWindowScroll();
  let [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 z-30 w-full transition-all duration-300 ltr:right-0 rtl:left-0 ltr:xl:pl-72 rtl:xl:pr-72 ltr:2xl:pl-80 rtl:2xl:pr-80 ${
        isMounted && windowScroll.y > 10
          ? 'h-16 bg-gradient-to-b from-white to-white/80 shadow-card backdrop-blur dark:from-dark dark:to-dark/80 sm:h-20'
          : 'h-16 sm:h-24'
      }`}
    >
      <div className="flex h-full items-center">
        <div className="flex items-center ">
            <div className="block absolute left-7 top-7 scale-125">
                <Hamburger
                isOpen={isOpen}
                onClick={() => openDrawer('DASHBOARD_SIDEBAR')}
                variant="transparent"
                className="dark:text-white"
                />
            </div>
        </div>
        <div className="absolute right-7 top-7">
            <HeaderRightArea />
        </div>
      </div>
    </nav>
  );
}

interface DashboardLayoutProps {
  contentClassName?: string;
}

export default function Layout({
    children,
    contentClassName,
  }: React.PropsWithChildren<DashboardLayoutProps>) {
    return (
      <div className="">
        <Header />
        <Sidebar className="hidden" />
        <main
          className={cn(
            'min-h-[100vh] px-4 pt-24 pb-16 sm:px-6 sm:pb-20 lg:px-8 xl:px-10 xl:pb-24 3xl:px-12',
            contentClassName
          )}
        >
          {children}
        </main>
      </div>
    );
  }
