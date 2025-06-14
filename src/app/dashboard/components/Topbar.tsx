'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Topbar() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/register');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white text-black border-b border-gray-200">
      {/* Logo / Title */}
      <div>
        <h4 className="text-lg font-semibold">LeadOS CRM</h4>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-6 relative">
        {/* Notification Icon */}
        <button className="relative text-gray-700 hover:text-gray-900">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">3</span>
        </button>

        {/* Profile Picture with Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-300 focus:outline-none"
          >
            <Image
              src="/image/download.jpg"
              alt="Profile"
              width={36}
              height={36}
              className="object-cover"
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-2 z-50 border border-gray-200">
              <button
                onClick={() => {
                  router.push('/profile-settings');
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Profile Settings
              </button>
              <button
                onClick={() => {
                  router.push('/change-password');
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Change Password
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
              >
                <div className="flex items-center gap-1">
                  <LogOut className="w-4 h-4" />
                  Logout
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
