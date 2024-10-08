import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider.tsx';
import paths from '../../assets/svg_paths.js';
import useClickOutside from '../../hooks/useClickOutside.ts';
import User_Menu from './User_Menu.tsx';

const menuItemStyle = `block px-4 py-3 text-sm font-sans hover:bg-slate-100`;

function Header_Hosting() {
  const navigate = useNavigate();
  const { userContext } = useAuth();
  if (userContext === null) {
    navigate('/');
    return null;
  }
  const [isShrinking, setIsShrinking] = useState(false);
  // TODO: Set object with menus and conditionally render menu.
  // Listen to window size to set rendered Menu to null
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);
  const [isHamMenuCollapsed, setIsHamMenuCollapsed] = useState(true);

  const menuRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(menuRef, () => setIsMenuCollapsed(true));
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1120) {
        setIsMenuCollapsed(true);
      } else {
        setIsHamMenuCollapsed(true);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
      <nav
        id="header"
        className="z-[2000] border-b border-neutral-200 bg-white h-[69px] w-full max-[1120px]:sticky top-0 [1120px]:relative [1120px]:static "
      >
        <div className="flex flex-row h-full justify-between">
          {/* Header logo */}
          <div className="flex justify-start w-full">
            <Link
              to={'/hosting'}
              className="flex flex-row items-center gap-1 cursor-pointer m-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="2.3em"
                id="airbnb-logo"
                viewBox="0 0 448 512"
              >
                <path d={paths.LOGO_BLACK} />
              </svg>
            </Link>
          </div>
          {/* Header tabs */}
          <div className="flex h-full w-[400px] max-[1120px]:hidden items-center">
            {tabs.map((tab) => (
              <Link
                key={'Tab-' + tab.name}
                to={tab.path}
                className={`px-4 py-[10px] text-sm font-poppins relative text-center font-semibold leading-[1.125rem] rounded-full hover:bg-slate-100 ${
                  isActive(tab.path)
                    ? 'text-black focused-tab'
                    : 'text-gray-500'
                }`}
              >
                {tab.name}
              </Link>
            ))}
            <div
              className={`px-4 py-[10px] rounded-full hover:bg-slate-100 hover:text-black relative  ${
                isMenuCollapsed
                  ? 'text-gray-500'
                  : 'text-black border-2 bg-slate-100 border-black'
              }`}
              onMouseDown={() => setIsShrinking(true)}
              onMouseUp={() => setIsShrinking(false)}
              onMouseLeave={() => setIsShrinking(false)} // Reset animation if mouse leaves the tab
              onTouchStart={() => setIsShrinking(true)} // Handle touch start
              onTouchEnd={() => setIsShrinking(false)} // Handle touch end
              onClick={() => setIsMenuCollapsed((prev) => !prev)}
              aria-expanded={!isMenuCollapsed}
            >
              <button
                className={`text-sm  font-poppins text-center font-semibold leading-[1.125rem] flex flex-row ${
                  isShrinking ? 'shrink' : 'expand'
                }`}
              >
                <span>Menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  id="bell-icon"
                  height="1em"
                  aria-hidden="true"
                  focusable="false"
                  className={`block pl-2 fill-none self-center stroke-current stroke-[4] overflow-visible `}
                >
                  <path
                    fill="none"
                    d="M28 12 16.7 23.3a1 1 0 0 1-1.4 0L4 12"
                  ></path>
                </svg>
              </button>
              {!isMenuCollapsed && (
                <div
                  id="menu-dropdown"
                  ref={menuRef}
                  className="w-60 absolute left-0 top-1/2 mt-[34px] bg-white menu-shadow py-4 rounded-lg"
                >
                  <div className="w-full text-start">
                    <Link to={''} className={menuItemStyle}>
                      Get Early Access{' '}
                      <span className="font-inter text-white rounded text-xs font-bold px-[3px] leading-3 bg-primary">
                        NEW
                      </span>
                    </Link>
                  </div>
                  <div className="border-b border-gray-200 my-1 w-full"></div>
                  <div className="w-full text-start">
                    <Link to={''} className={menuItemStyle}>
                      Reservation
                    </Link>
                    <Link to={''} className={menuItemStyle}>
                      Earnings
                    </Link>
                    <Link to={''} className={menuItemStyle}>
                      Insights
                    </Link>
                    <Link to={''} className={menuItemStyle}>
                      Create a new listing
                    </Link>
                  </div>
                  <div className="border-b border-gray-200 my-1 w-full"></div>

                  <div className="w-full text-start">
                    <Link to={''} className={menuItemStyle}>
                      Guidebooks
                    </Link>
                    <Link to={''} className={menuItemStyle}>
                      Explore hosting resources
                    </Link>
                    <Link to={''} className={menuItemStyle}>
                      Connect with Hosts near you
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full max-[1120px]:hidden">
            <div className=" flex justify-end w-full h-full align-middle items-center">
              <button className="border border-gray-300 rounded-full flex justify-center items-center w-10 h-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  id="bell-icon"
                  height="1em"
                  aria-hidden="true"
                  focusable="false"
                  className="block fill-none w- stroke-current stroke-[3] overflow-visible"
                >
                  <path d={paths.BELL}></path>
                </svg>
              </button>
              {/* USER MENU */}
              <div className="ml-4 mr-6">
                <User_Menu />
              </div>
            </div>
          </div>
          {/* Hamburger icon */}
          <div className="hidden justify-end w-full h-full max-[1120px]:flex mr-4 align-middle items-center">
            <button
              className="border border-gray-300 hover:border-none rounded-full flex justify-center items-center w-10 h-10"
              onClick={() => setIsHamMenuCollapsed((prev) => !prev)}
            >
              {isHamMenuCollapsed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  className="block fill-none stroke-current stroke-[4] w-4 h-4 overflow-visible"
                >
                  <g fill="none">
                    <path d="M2 16h28M2 24h28M2 8h28"></path>
                  </g>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  className="block fill-none stroke-current stroke-[4] w-4 h-4 overflow-visible"
                >
                  <path d="m6 6 20 20M26 6 6 26"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>
      {/* sm:SLIDE DOWN MENU */}
      <div
        className={` ${
          isHamMenuCollapsed ? 'menu-out' : 'menu-in hidden max-[1120px]:block'
        } absolute left-0 w-full h-full  bg-white`}
      >
        <div className="p-6">
          <div className="pb-10 font-medium text-base pl-2 font-sans border-b-2 border-neutral-200">
            Get Early Access{' '}
            <span className="font-inter text-white rounded text-xs font-bold px-[5px] py-[1px] leading-3 bg-primary">
              NEW
            </span>
          </div>
          <div className="py-7">
            {dropdownMenu.map((section) => (
              <div key={section.title}>
                <div className="py-3 font-poppins font-semibold text-sm text-neutral-500">
                  {section.title}
                </div>
                {section.options.map((option, optionIndex) => (
                  <Link
                    to={
                      option.name === 'Your profile'
                        ? option.path + userContext?.id
                        : option.path
                    }
                    key={optionIndex}
                    className="flex flex-row py-2"
                  >
                    <div className="pr-2 self-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                        role="presentation"
                        focusable="false"
                        className="block fill-current w-6 h-6 "
                      >
                        <path d={option.svg_path}></path>
                      </svg>
                    </div>
                    <div
                      className={`flex-1 text-start justify-self-center font-medium ${
                        option.description && 'flex flex-col'
                      }`}
                    >
                      {option.name}
                      {option.description && (
                        <span className="text-xs font-medium text-neutral-500">
                          {option.description}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
                <div className="border-b-2 my-10 border-gray-200 w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header_Hosting;

const tabs = [
  { name: 'Today', path: '/hosting' },
  { name: 'Calendar', path: '/hosting/multi-calendar' },
  { name: 'Listings', path: '/hosting/listings' },
  { name: 'Inbox', path: '/hosting/messages' }
];

const dropdownMenu = [
  {
    title: 'MENU',
    options: [
      {
        name: 'Today',
        svg_path: paths.HOSTING_HOME,
        path: '/hosting'
      },
      {
        name: 'Calendar',
        svg_path: paths.CALENDAR,
        path: '/calendar'
      },
      {
        name: 'Listings',
        svg_path: paths.LISTINGS,
        path: '/hosting/listings'
      },
      {
        name: 'Inbox',
        svg_path: paths.CHAT_BUBBLE,
        path: '/hosting/messages'
      },
      {
        name: 'Reservations',
        svg_path: paths.RESERVATIONS,
        path: '/hosting/reservations'
      },
      {
        name: 'Earnings',
        svg_path: paths.EARNINGS,
        path: '/users/transaction-history'
      },
      {
        name: 'Insights',
        svg_path: paths.INSIGHTS,
        path: 'progress/opportunity-hub'
      },
      {
        name: 'Guidebooks',
        svg_path: paths.GUIDEBOOK,
        path: 'manage-guidebook?s=host_profile_menu'
      }
    ]
  },
  {
    title: 'ACCOUNT',
    options: [
      {
        name: 'Your profile',
        svg_path: paths.PROFILE,
        path: `users/show/`
      },
      {
        name: 'Account settings',
        svg_path: paths.SETTINGS,
        path: '/account-settings'
      },
      {
        name: 'Notifications',
        svg_path: paths.NOTIFICATION,
        path: '/hosting/notifications'
      },
      {
        name: 'Refer a Host',
        svg_path: paths.REFERAL,
        path: '/refer',
        description: 'Earn $1,680 MXN for each host you refer.'
      },
      {
        name: 'Create a new listing',
        svg_path: paths.ADD_LISTING,
        path: '/become-a-host'
      }
    ]
  },
  {
    title: 'RESOURCES & SUPPORT',
    options: [
      {
        name: 'Connect with Hosts near you',
        svg_path: paths.CHAT_BUBBLE,
        path: '#'
      },
      {
        name: 'Explore hosting resources',
        svg_path: paths.RESOURCES,
        path: '/resourcees/hosting-homes'
      },
      {
        name: 'Visit the Help Center',
        svg_path: paths.HELP_CENTER,
        path: '/help/hosting'
      },
      {
        name: 'Get help with a safety issue',
        svg_path: paths.RED_CROSS_SHIELD,
        path: '/help/contact-us?entry=MEN_TAB_SAFETY&role=host'
      }
    ]
  },
  {
    title: 'SETTINGS',
    options: [
      {
        name: 'Language and translation',
        svg_path: paths.LINE_GLOBE,
        path: '#'
      },
      {
        name: '$ MXN',
        svg_path: paths.CASH,
        path: '#'
      }
    ]
  }
];
