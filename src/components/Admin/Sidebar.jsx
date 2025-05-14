'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import { FaHome } from 'react-icons/fa';

const menuList = [
  { name: 'Dashboard', link: '/crm/dashboard', icon: <FaHome /> },
  { name: 'Product', link: '/crm/product', icon: <FaHome /> },

];

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-[#f4f4f5]  text-[#333] shadow-lg z-50 transition-all duration-500 
      ${isExpanded ? 'w-64' : 'w-[60px] md:w-[90px]'} flex flex-col overflow-hidden`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Link href="/" className="flex items-center px-4 py-5 border-b border-gray-300 ">
        <img src="/flame1.png" alt="Logo" className="w-10 h-10" />
        {isExpanded && <span className="ml-3 text-lg font-bold text-[#1E2B2A]">ATD</span>}
      </Link>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <nav className="flex flex-col py-4">
          {menuList.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all font-medium
              ${pathname === item.link 
                ? 'bg-[#03AA98] text-white' 
                : 'hover:bg-[#d0faf5]  text-[#03AA98] '}`}
            >
              <div className="text-xl ">{item.icon}</div>
              {isExpanded && <span className="text-base ">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="px-2 py-3 border-t border-gray-100">
        <button
          className={`flex items-center ${isExpanded ? 'justify-start' : 'justify-center'} gap-3 w-full text-red-500 hover:bg-red-50 px-3 py-3 rounded-lg mx-2`}
        >
          <FiLogOut className="text-xl" />
          {isExpanded && <span className="text-base">Logout</span>}
        </button>
      </div>
    </div>
  );
}
