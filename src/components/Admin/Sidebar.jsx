'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiChevronRight } from 'react-icons/fi';
import {
  FaHome, FaSms, FaFileExport, FaMoneyCheckAlt, FaBook, FaHandHoldingUsd, FaMobileAlt,
  FaEnvelopeOpenText, FaHourglassHalf, FaBriefcase, FaUserTie, FaShieldAlt
} from 'react-icons/fa';
import {
  MdReviews, MdReportProblem, MdOutlineAccessTimeFilled, MdFlashAuto, MdOutlineQrCode2,
  MdAssignmentTurnedIn, MdCreditScore, MdPendingActions, MdDoneAll, MdCancel, MdMenuBook,
  MdDownload, MdSupportAgent, MdAttachMoney, MdOutlineHistoryEdu, MdSettings, MdAccountBalance,
  MdOutlineSwapHorizontalCircle,
  MdOutlineDescription,
  MdOutlineSettings
} from "react-icons/md";
import { SiBlogger } from "react-icons/si";
import { RiAccountPinBoxFill, RiAdminFill } from "react-icons/ri";
import { IoMdNotifications, IoMdCash } from "react-icons/io";
import { IoBarChart } from "react-icons/io5";
import { VscReferences } from "react-icons/vsc";
import { BiPlus, BiCog } from "react-icons/bi";
import {
  Scale, BanknoteArrowUp, ChartNoAxesCombined, Codesandbox, Boxes,
  ReceiptIndianRupee, BadgeCheck, Stamp,
} from "lucide-react";
import { BsBank2 } from "react-icons/bs";
import { GiExpense, GiWallet, GiMoneyStack } from "react-icons/gi";
import { TbMessageCircleFilled } from "react-icons/tb";
import { FaHourglassEnd } from "react-icons/fa6";
import { BsCreditCard2FrontFill } from "react-icons/bs";
import { BiSpreadsheet } from "react-icons/bi";
import { useAdminAuthStore } from '@/lib/store/authAdminStore';
import { useThemeStore } from '@/lib/store/useThemeStore';

// Menu items with permission keys mapped from API
const allMenuItems = [
  { 
    name: 'Dashboard', 
    link: '/crm/dashboard', 
    icon: <FaHome />,
    permissionKey: 'dashboard'
  },
  {
    name: 'Manage Enquiries',
    icon: <Codesandbox />,
    isDropdown: true,
    subItems: [
      { 
        name: 'Manage Application', 
        link: '/crm/manage-application', 
        icon: <Boxes size={16} />,
        permissionKey: 'manage_application'
      },
      { 
        name: 'Disburse Application', 
        link: '/crm/disburse-application', 
        icon: <MdAssignmentTurnedIn />,
        permissionKey: 'disburse_application'
      },
      { 
        name: 'Credit Approval', 
        link: '/crm/credit-approval', 
        icon: <MdCreditScore />,
        permissionKey: 'credit_approval'
      },
      { 
        name: 'Sanction Application', 
        link: '/crm/sanction-application', 
        icon: <Stamp />,
        permissionKey: 'sanction_application'
      },
      { 
        name: 'Inprocess Application', 
        link: '/crm/inprogress-application', 
        icon: <MdPendingActions />,
        permissionKey: 'inprocess_application'
      },
      { 
        name: 'Followup Application', 
        link: '/crm/followup-application', 
        icon: <FaEnvelopeOpenText />,
        permissionKey: 'followup_application'
      },
      { 
        name: 'Completed Application', 
        link: '/crm/completed-application', 
        icon: <MdDoneAll />,
        permissionKey: 'complete_application'
      },
      { 
        name: 'Pending Application', 
        link: '/crm/pending-application', 
        icon: <FaHourglassHalf />,
        permissionKey: 'pending_application'
      },
      { 
        name: 'Rejected Application', 
        link: '/crm/rejected-application', 
        icon: <MdCancel />,
        permissionKey: 'rejected_application'
      },
    ]
  },
  { 
    name: 'All Enquiries', 
    link: '/crm/all-enquiries', 
    icon: <TbMessageCircleFilled />,
    permissionKey: 'all_enquiries'
  },
  { 
    name: 'Disburse Reporting', 
    link: '/crm/disburse-reporting', 
    icon: <FaHandHoldingUsd />,
    permissionKey: 'disburse_reporting'
  },
  { 
    name: 'Collection Reporting', 
    link: '/crm/collection-reporting', 
    icon: <GiWallet />,
    permissionKey: 'collection_reporting'
  },
  {
    name: 'Auto Collection',
    icon: <MdFlashAuto />,
    isDropdown: true,
    subItems: [
      { 
        name: 'E-Collection', 
        link: '/crm/e-collection', 
        icon: <BsCreditCard2FrontFill />,
        permissionKey: 'auto_collection'
      },
      { 
        name: 'UPI Collection', 
        link: '/crm/upi-collection', 
        icon: <MdOutlineQrCode2 />,
        permissionKey: 'auto_collection'
      },
    ]
  },
  { 
    name: 'Ledger', 
    link: '/crm/ledger', 
    icon: <BiSpreadsheet />,
    permissionKey: 'ledger'
  },
  { 
    name: 'Bank Ledger', 
    link: '/crm/bank-ledger', 
    icon: <BsBank2 />,
    permissionKey: 'bank_ledger'
  },
  { 
    name: 'Cibil Report', 
    link: '/crm/cibil-report', 
    icon: <BadgeCheck />,
    permissionKey: 'cibil_report'
  },
  { 
    name: 'Tally Ledger', 
    link: '/crm/tally-ledger', 
    icon: <FaBook />,
    permissionKey: 'tally_ledger'
  },
  { 
    name: 'Tally Export', 
    link: '/crm/tally-export', 
    icon: <FaFileExport />,
    permissionKey: 'tally_export'
  },
  { 
    name: 'Overdue Applicants', 
    link: '/crm/overdue-applicant-list', 
    icon: <FaHourglassEnd />,
    permissionKey: 'overdue_applicants'
  },
  { 
    name: 'Payment Receipt', 
    link: '/crm/payment-receipt', 
    icon: <ReceiptIndianRupee />,
    permissionKey: 'payment_receipt'
  },
  {
    name: 'Profit/Loss Deposit',
    icon: <IoBarChart />,
    isDropdown: true,
    subItems: [
      { 
        name: 'Manage Expenses', 
        link: '/crm/manage-expenses', 
        icon: <GiExpense />,
        permissionKey: 'profit_and_loss'
      },
      { 
        name: 'Track Profit/Loss', 
        link: '/crm/profit-loss', 
        icon: <ChartNoAxesCombined size={16} />,
        permissionKey: 'profit_and_loss'
      },
    ]
  },
  {
    name: 'Master Settings',
    icon: <MdSettings />,
    isDropdown: true,
    subItems: [
      { 
        name: 'Manage Advocate', 
        link: '/crm/manage-advocate', 
        icon: <FaUserTie/>,
        permissionKey: 'manage_advocate'
      },
      { 
        name: 'Manage Banks', 
        link: '/crm/manage-bank', 
        icon: <MdAccountBalance />,
        permissionKey: 'manage_bank'
      },
      { 
        name: 'Manage Admin', 
        link: '/crm/manage-admin', 
        icon: <RiAdminFill />,
        permissionKey: 'manage_admin'
      },
    ]
  },
  // {
  //   name: 'Migration Settings',
  //   icon: <MdOutlineSettings />,
  //   isDropdown: true,
  //   subItems: [
  //     { 
  //       name: 'Users Migration', 
  //       link: '/crm/users-migration', 
  //       icon: <MdOutlineSwapHorizontalCircle/>,
        
  //     },
  //     { 
  //       name: 'Application', 
  //       link: '/crm/application', 
  //       icon: <MdOutlineDescription />,
        
  //     },
      
  //   ]
  // },
  {
    name: 'Cash/Cheque Deposit',
    icon: <FaMoneyCheckAlt />,
    isDropdown: true,
    subItems: [
      { 
        name: 'Cheque Management', 
        link: '/crm/cheque-management', 
        icon: <BanknoteArrowUp size={16} />,
        permissionKey: 'cheque_deposit'
      },
      { 
        name: 'Cash Management', 
        link: '/crm/cash-management', 
        icon: <IoMdCash />,
        permissionKey: 'cash_deposit'
      },
      { 
        name: 'E-Mandate Management', 
        link: '/crm/e-mandate-management', 
        icon: <FaShieldAlt/>,
        permissionKey: 'emandate_deposit'
      },
    ]
  },
  { 
    name: 'Legal Case', 
    link: '/crm/legal', 
    icon: <Scale />,
    permissionKey: 'legal'
  },
  {
    name: 'Complaints',
    icon: <MdReportProblem />,
    isDropdown: true,
    subItems: [
      { 
        name: 'Add Complaints', 
        link: '/crm/complaints/add-complaint', 
        icon: <BiPlus />,
        permissionKey: 'complaints'
      },
      { 
        name: 'Manage Complaints', 
        link: '/crm/complaints/manage-complaints', 
        icon: <BiCog />,
        permissionKey: 'complaints'
      },
    ]
  },
  { 
    name: 'RBI Guidelines Management', 
    link: '/crm/rbi-guidelines', 
    icon: <MdMenuBook />,
    permissionKey: 'rbi_guidelines'
  },
  { 
    name: 'Client History', 
    link: '/crm/client-history', 
    icon: <MdOutlineHistoryEdu />,
    permissionKey: 'clients_history'
  },
  
  { 
    name: 'Notifications', 
    link: '/crm/notifications', 
    icon: <IoMdNotifications />,
    permissionKey: 'notification'
  },
  { 
    name: 'References', 
    link: '/crm/references', 
    icon: <VscReferences />,
    permissionKey: 'references'
  },
  { 
    name: 'Help Ticket', 
    link: '/crm/help-ticket', 
    icon: <MdSupportAgent />,
    permissionKey: 'help_ticket'
  },
  { 
    name: 'Blogs', 
    link: '/crm/blogs', 
    icon: <SiBlogger />,
    permissionKey: 'blogs'
  },
  { 
    name: 'Reviews', 
    link: '/crm/reviews', 
    icon: <MdReviews />,
    permissionKey: 'reviews'
  },
  { 
    name: 'Send SMS', 
    link: '/crm/send-sms', 
    icon: <FaSms />,
    permissionKey: 'send_sms'
  },
  // { 
  //   name: 'Create MSB Account', 
  //   link: '/crm/create-msb', 
  //   icon: <RiAccountPinBoxFill />,
  //   permissionKey: 'create_myastro_account'
  // },
  { 
    name: 'Registered From App', 
    link: '/crm/registered-from-app', 
    icon: <FaMobileAlt />,
    permissionKey: 'register_from_app'
  },
  { 
    name: 'Download App', 
    link: '/crm/download-app', 
    icon: <MdDownload />,
    permissionKey: 'download_app'
  },
  
  // {
  //   name: 'Business Loan Enquiry',
  //   icon: <FaMoneyCheckAlt />,
  //   isDropdown: true,
  //   subItems: [
  //     { 
  //       name: 'Upto 5 lacs', 
  //       link: '/crm/businessloan-upto-5l', 
  //       icon: <FaBriefcase />,
  //       permissionKey: 'business_loan_enquiry'
  //     },
  //     { 
  //       name: 'Between 5L-1.5cr', 
  //       link: '/crm/businessloan-above-5l', 
  //       icon: <MdAttachMoney />,
  //       permissionKey: 'business_loan_enquiry'
  //     },
  //   ]
  // },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme } = useThemeStore();
  const { hasPermission } = useAdminAuthStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter menu based on user permissions
  const filteredMenu = useMemo(() => {
    return allMenuItems
      .map(item => {
        // Handle dropdown items
        if (item.isDropdown && item.subItems) {
          const filteredSubItems = item.subItems.filter(subItem => {
            if (!subItem.permissionKey) return true;
            return hasPermission(subItem.permissionKey);
          });
          
          // Only show dropdown if it has visible sub-items
          if (filteredSubItems.length > 0) {
            return { ...item, subItems: filteredSubItems };
          }
          return null;
        }
        
        // Handle regular menu items
        if (!item.permissionKey) return item;
        return hasPermission(item.permissionKey) ? item : null;
      })
      .filter(Boolean);
  }, [hasPermission]);

  const toggleDropdown = (itemName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const isParentActive = (subItems) => {
    return subItems?.some(subItem => pathname === subItem.link);
  };

  useEffect(() => {
    filteredMenu.forEach(item => {
      if (item.isDropdown && isParentActive(item.subItems)) {
        setOpenDropdowns(prev => ({ ...prev, [item.name]: true }));
      }
    });
  }, [pathname, filteredMenu]);

  if (!isMounted) return null;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`fixed top-3 left-4 z-[50] lg:hidden p-3 rounded-xl shadow-lg transition-all duration-300 ${theme === "dark"
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
        className={`fixed top-0 left-0 h-full shadow-xl z-50 transition-all duration-300 ease-in-out ${theme === "dark"
          ? 'bg-gray-900/95 text-white border-r border-gray-700'
          : 'bg-white/98 text-gray-900 border-r border-emerald-200'
          } backdrop-blur-md ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'
          } lg:translate-x-0 ${isExpanded ? 'lg:w-74' : 'lg:w-20'
          } flex flex-col overflow-hidden`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo Section */}
        <div className={`flex items-center justify-between px-4 py-6 border-b transition-all duration-200 ${theme === "dark" ? 'border-gray-700' : 'border-emerald-100'}`}>
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
              className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${theme === "dark"
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-emerald-50 text-gray-600 hover:text-emerald-600'
                }`}
            >
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* Navigation with filtered menu */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <nav className="flex flex-col px-3 space-y-2">
            {filteredMenu.map((item, index) => (
              <div key={index}>
                {item.isDropdown ? (
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`group cursor-pointer flex items-center justify-between w-full gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isParentActive(item.subItems)
                      ? theme === "dark"
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                      : theme === "dark"
                        ? 'hover:bg-gray-800 text-gray-300 hover:text-emerald-400'
                        : 'hover:bg-emerald-50 text-gray-700 hover:text-emerald-600'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-xl flex-shrink-0 transition-colors duration-200 ${isParentActive(item.subItems)
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
                      <div className={`transition-transform duration-200 ${openDropdowns[item.name] ? 'rotate-90' : ''}`}>
                        <FiChevronRight size={16} />
                      </div>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.link}
                    className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${pathname === item.link
                      ? theme === "dark"
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                      : theme === "dark"
                        ? 'hover:bg-gray-800 text-gray-300 hover:text-emerald-400'
                        : 'hover:bg-emerald-50 text-gray-700 hover:text-emerald-600'
                      }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <div className={`text-xl flex-shrink-0 transition-colors duration-200 ${pathname === item.link
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

                {item.isDropdown && openDropdowns[item.name] && (isExpanded || isMobileOpen) && (
                  <div className="mt-2 ml-4 space-y-1">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.link}
                        className={`group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${pathname === subItem.link
                          ? theme === "dark"
                            ? 'bg-emerald-600/80 text-white shadow-md'
                            : 'bg-emerald-500/80 text-white shadow-md'
                          : theme === "dark"
                            ? 'hover:bg-gray-800/80 text-gray-400 hover:text-emerald-300'
                            : 'hover:bg-emerald-50/80 text-gray-600 hover:text-emerald-600'
                          }`}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <div className={`text-lg flex-shrink-0 transition-colors duration-200 ${pathname === subItem.link
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