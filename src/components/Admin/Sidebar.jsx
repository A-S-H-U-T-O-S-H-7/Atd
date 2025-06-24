'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX,  FiChevronRight } from 'react-icons/fi';
import { FaHome, FaSms , FaMoneyCheckAlt, FaChartLine} from 'react-icons/fa';
import { MdReviews, MdReportProblem } from "react-icons/md";
import { SiBlogger } from "react-icons/si";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { IoMdNotifications, IoMdCash } from "react-icons/io";
import { IoBarChart } from "react-icons/io5";
import { VscReferences } from "react-icons/vsc";
import { BiPlus, BiCog } from "react-icons/bi";
import { Scale, BanknoteArrowUp, ChartNoAxesCombined } from "lucide-react";
import { BsBank2 } from "react-icons/bs";
import { GiExpense } from "react-icons/gi";




import { useAdminAuth } from '@/lib/AdminAuthContext';

const menuList = [
  { name: 'Dashboard', link: '/crm/dashboard', icon: <FaHome /> },
  {
    name: 'Cash/Cheque Deposit',
    icon: <FaMoneyCheckAlt />    ,
    isDropdown: true,
    subItems: [
      { name: 'Cheque Management', link: '/crm/cheque-management', icon: <BanknoteArrowUp size={16} />},
      { name: 'Cash Management', link: '/crm/cash-management', icon: <IoMdCash /> },
    ]
  },
  {
    name: 'Profit/Loss Deposit',
    icon: <IoBarChart />    ,
    isDropdown: true,
    subItems: [
      { name: 'Manage Expenses', link: '/crm/manage-expenses', icon: <GiExpense />      },
      { name: 'Track Profit/Loss', link: '/crm/tarscmkn', icon: <ChartNoAxesCombined size={16} /> },
    ]
  },
  { name: 'Bank Ledger', link: '/crm/bank-ledger', icon: < BsBank2 /> },
  { name: 'Reviews', link: '/crm/reviews', icon: <MdReviews /> },
  { name: 'Blogs', link: '/crm/blogs', icon: <SiBlogger /> },
  { name: 'Send SMS', link: '/crm/send-sms', icon: <FaSms /> },
  {
    name: 'Complaints',
    icon: <MdReportProblem />    ,
    isDropdown: true,
    subItems: [
      { name: 'Add Complaints', link: '/crm/complaints/add-complaint', icon: <BiPlus /> },
      { name: 'Manage Complaints', link: '/crm/complaints/manage-complaints', icon: <BiCog /> },
    ]
  },
  { name: 'Create MSB Account', link: '/crm/create-msb', icon: <RiAccountPinBoxFill /> },
  { name: 'Notifications', link: '/crm/notifications', icon: <IoMdNotifications /> },
  { name: 'References', link: '/crm/references', icon: <VscReferences /> },
  { name: 'Legal Case', link: '/crm/legal', icon: <Scale /> },
  



];

export default function Sidebar() {
  const pathname = usePathname();
  const { isDark } = useAdminAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Toggle dropdown
  const toggleDropdown = (itemName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  // Check if any sub-item is active
  const isParentActive = (subItems) => {
    return subItems?.some(subItem => pathname === subItem.link);
  };

  // Auto-expand dropdown if sub-item is active
  useEffect(() => {
    menuList.forEach(item => {
      if (item.isDropdown && isParentActive(item.subItems)) {
        setOpenDropdowns(prev => ({
          ...prev,
          [item.name]: true
        }));
      }
    });
  }, [pathname]);

  if (!isMounted) return null;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`fixed top-3 left-4 z-[50] lg:hidden p-3 rounded-xl shadow-lg transition-all duration-300 ${
          isDark 
            ? 'bg-gray-800/90 hover:bg-gray-700/90 text-emerald-400 border border-gray-600' 
            : 'bg-white/90 hover:bg-emerald-50/90 text-emerald-600 border border-emerald-200'
        } backdrop-blur-sm`}
      >
        {isMobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full shadow-xl z-50 transition-all duration-300 ease-in-out ${
          isDark 
            ? 'bg-gray-900/95 text-white border-r border-gray-700' 
            : 'bg-white/98 text-gray-900 border-r border-emerald-200'
        } backdrop-blur-md ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'
        } lg:translate-x-0 ${
          isExpanded ? 'lg:w-74' : 'lg:w-20'
        } flex flex-col overflow-hidden`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo Section */}
        <div className={`flex items-center justify-between px-4 py-6 border-b transition-all duration-200 ${
          isDark ? 'border-gray-700' : 'border-emerald-100'
        }`}>
          <Link 
            href="/crm/dashboard" 
            className="flex items-center hover:opacity-80 transition-opacity duration-200"
            onClick={() => setIsMobileOpen(false)}
          >
            <img src="/atdlogo.png" alt="Logo" className="w-10 h-10" />
            {(isExpanded || isMobileOpen) && (
              <div className="ml-3 overflow-hidden">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  ATD 
                </span>
              </div>
            )}
          </Link>
          
          {isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-emerald-50 text-gray-600 hover:text-emerald-600'
              }`}
            >
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="flex flex-col px-3 space-y-2">
            {menuList.map((item, index) => (
              <div key={index}>
                {/* Main menu item */}
                {item.isDropdown ? (
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`group cursor-pointer flex items-center justify-between w-full gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                      isParentActive(item.subItems)
                        ? isDark
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg'
                          : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                        : isDark
                        ? 'hover:bg-gray-800 text-gray-300 hover:text-emerald-400'
                        : 'hover:bg-emerald-50 text-gray-700 hover:text-emerald-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-xl flex-shrink-0 transition-colors duration-200 ${
                        isParentActive(item.subItems) 
                          ? 'text-white' 
                          : 'group-hover:scale-110'
                      }`}>
                        {item.icon}
                      </div>
                      {(isExpanded || isMobileOpen) && (
                        <span className="text-base whitespace-nowrap transition-all duration-200">
                          {item.name}
                        </span>
                      )}
                    </div>
                    {(isExpanded || isMobileOpen) && (
                      <div className={`transition-transform duration-200 ${
                        openDropdowns[item.name] ? 'rotate-90' : ''
                      }`}>
                        <FiChevronRight size={16} />
                      </div>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.link}
                    className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                      pathname === item.link
                        ? isDark
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg'
                          : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                        : isDark
                        ? 'hover:bg-gray-800 text-gray-300 hover:text-emerald-400'
                        : 'hover:bg-emerald-50 text-gray-700 hover:text-emerald-600'
                    }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <div className={`text-xl flex-shrink-0 transition-colors duration-200 ${
                      pathname === item.link 
                        ? 'text-white' 
                        : 'group-hover:scale-110'
                    }`}>
                      {item.icon}
                    </div>
                    {(isExpanded || isMobileOpen) && (
                      <span className="text-base whitespace-nowrap transition-all duration-200">
                        {item.name}
                      </span>
                    )}
                  </Link>
                )}

                {/* Sub-menu items */}
                {item.isDropdown && openDropdowns[item.name] && (isExpanded || isMobileOpen) && (
                  <div className="mt-2 ml-4 space-y-1">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.link}
                        className={`group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                          pathname === subItem.link
                            ? isDark
                              ? 'bg-emerald-600/80 text-white shadow-md'
                              : 'bg-emerald-500/80 text-white shadow-md'
                            : isDark
                            ? 'hover:bg-gray-800/80 text-gray-400 hover:text-emerald-300'
                            : 'hover:bg-emerald-50/80 text-gray-600 hover:text-emerald-600'
                        }`}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <div className={`text-lg flex-shrink-0 transition-colors duration-200 ${
                          pathname === subItem.link 
                            ? 'text-white' 
                            : 'group-hover:scale-110'
                        }`}>
                          {subItem.icon}
                        </div>
                        <span className="whitespace-nowrap">
                          {subItem.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}