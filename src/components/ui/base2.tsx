// @ts-nocheck
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import cn from 'classnames';
import routes from '@/config/routes';
import ActiveLink from '@/components/ui/links/active-link2';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
// dynamic import
const Listbox = dynamic(() => import('@/components/ui/list-box'));

const baseMenu = [
  {
    name: 'Profile',
    value: routes.profileProfile,
  },
  {
    name: 'Subnames',
    value: routes.profileSubnames,
  },
  {
    name: 'Transfer',
    value: routes.profileTransfer,
  },
  {
    name: 'More',
    value: routes.profileMore,
  },
];

function ActiveNavLink({ href, title, isActive, className }: any) {
  return (
    <ActiveLink
      href={href}
      className={cn(
        'relative z-[1] inline-flex items-center text-md py-1.5 px-3',
        className
      )}
      activeClassName="font-medium text-white dark:text-white"
    >
      <span>{title}</span>
      {isActive && (
        <motion.span
          className="absolute left-0 right-0 bottom-0 -z-[2] h-full w-full rounded-lg bg-brand shadow-large"
        />
      )}
    </ActiveLink>
  );
}

export default function Base({ children }: React.PropsWithChildren<{}>) {
  const router = useRouter();
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();
  const currentPath = baseMenu.findIndex(
    (item) => item.value === router.pathname
  );
  let [selectedMenuItem, setSelectedMenuItem] = useState(baseMenu[0]);
  function handleRouteOnSelect(url: string) {
    router.push({path: url, query: { name: nameParam }});
  }
  useEffect(() => {
    setSelectedMenuItem(baseMenu[currentPath]);
  }, [currentPath]);


    let [nameParam, setNameParam] = useState('');
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        if(queryParams.get("name") !== null){
            setNameParam(queryParams.get("name"));
        }
    });

  return (
    <div className="pt-8 text-lg">
      <div className="mx-auto w-[900px] rounded-lg bg-white p-5 pt-4 shadow-card dark:bg-light-dark xs:p-6 xs:pt-5">
        <nav className="mb-5 min-h-[40px] border-b border-dashed border-gray-200 pb-4 uppercase tracking-wider dark:border-gray-700 xs:mb-6 xs:pb-5 xs:tracking-wide">
          {isMounted && ['xs'].indexOf(breakpoint) !== -1 && (
            <Listbox
              options={baseMenu}
              selectedOption={selectedMenuItem}
              onChange={setSelectedMenuItem}
              onSelect={(path) => handleRouteOnSelect(path)}
              className="w-full"
            >

            </Listbox>
          )}
          <div className="hidden items-center justify-between text-gray-600 dark:text-gray-400 sm:flex flex">
            {baseMenu.map((item) => (
              <ActiveNavLink
                key={item.name}
                href={(nameParam === '' ? item.value : item.value + '?name='+ nameParam)}
                title={item.name}
                isActive={item.value === router.pathname}
              />
            ))}
          </div>
        </nav>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            initial="exit"
            animate="enter"
            exit="exit"
            variants={fadeInBottom('easeIn', 0.25)}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
