'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Activity,
  List,
  User,
  Users,
  Folder,
Power,
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear(); // or remove just the token if needed
    router.push('/register');
  };

  const menu = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', color: 'text-yellow-400' },
    { name: 'Inbound OS', icon: Activity, href: '/inbound', color: 'text-green-500', badge: 'New', badgeColor: 'bg-green-500' },
    { name: 'Lead Lists', icon: List, href: '/leadlist', color: 'text-blue-500', badge: 'New', badgeColor: 'bg-blue-500' },
    { name: 'Lead Dashboard', icon: Users, href: '/leaddashboard', color: 'text-blue-600' },
    { name: 'Properties', icon: Folder, href: '/properties', color: 'text-blue-800' },
    { name: 'My Profile', icon: User, href: '/profile', color: 'text-yellow-500' },
    // { name: 'All Settings', icon: LayoutDashboard, href: '/settings' },
  ];

  return (
    <>
      {/* Hamburger - visible only on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-900 text-white md:hidden"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-56 bg-[#0c111d] p-4 border-r border-gray-800
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex-shrink-0
          flex flex-col overflow-y-auto
        `}
      >
        <div className="text-xl font-bold text-white mb-8 flex items-center gap-2 select-none">
          <span className="text-yellow-400 text-2xl">📂</span> LANDOS
        </div>

        <nav className="flex flex-col gap-1">
          {menu.map(({ name, icon: Icon, href, badge, badgeColor, color }) => (
            <Link
              key={name}
              href={href}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-md text-white hover:bg-gray-800 text-xs group transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${color || 'text-white'}`} />
                <span>{name}</span>
              </div>
              {badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold text-white ${badgeColor}`}>
                  {badge}
                </span>
              )}
            </Link>
          ))}
          <button
  onClick={() => {
    handleLogout();
    setIsOpen(false);
  }}
  className="flex items-center w-30 px-4 py-2 bg-red-400 text-white mt-4 text-sm hover:bg-red-500 hover:text-white rounded-md transition-all"
>
   <Power className="w-5 h-5 mr-2" />
  <span className="font-medium">Logout</span>
</button>




        </nav>
      </aside>

      {/* Overlay behind sidebar when open on mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
