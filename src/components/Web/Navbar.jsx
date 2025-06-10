"use client";
import Link from "next/link";
import Image from "next/image";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { GrAppleAppStore } from "react-icons/gr";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { FaArrowRightLong } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
  const [isLearnDropdownOpen, setIsLearnDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);


  const navigationLinks = [
    { name: "Loans", href: "/user_signup" },
    { name: "About us", href: "/aboutus" },
    { name: "Contact us", href: "/contactus" },
    
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" }
    }
  };

  const sidebarVariants = {
    closed: { x: "100%", opacity: 0 },
    open: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: { 
        ease: "easeInOut",
        duration: 0.3
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full">
<nav className=" flex justify-between items-center bg-gradient-to-r from-teal-50 to-cyan-50 backdrop-blur-md border-b border-teal-100 shadow-sm">
<div className="flex justify-between w-full py-4 px-4 md:px-10">
  <Link href="/">
          <div className="flex items-center">
            <Image
              src="/atdlogo.png"
              alt="logo"
              width={280}
              height={280}
              className="w-12 md:w-19 hover:scale-105 transition-transform duration-300"
            />
          </div>
          </Link>

          <div className="flex items-center">
            <ul className="hidden lg:flex items-center space-x-6">
              {navigationLinks.map((link, index) => (
                <li
                  key={index}
                  className="px-2 py-[4px] leading-6 font-medium text-lg text-gray-700 transition-all duration-300"
                >
                  <Link className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-teal-500 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300" href={link.href}>
                    {link.name}
                  </Link>
                </li>
              ))}

              <li
                className="relative flex font-medium text-lg items-center text-gray-700 px-2 py-[4px] cursor-pointer"
                onMouseEnter={() => setIsLearnDropdownOpen(true)}
                onMouseLeave={() => setIsLearnDropdownOpen(false)}
              >
                <span className="flex items-center">
                  Learn
                  <ChevronDown 
                    size={20} 
                    className={`ml-1 transition-transform duration-300 ${isLearnDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </span>

                <AnimatePresence>
                  {isLearnDropdownOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      className="absolute top-12 right-0 bg-white rounded-lg shadow-lg p-4 min-w-48 border border-teal-100"
                    >
                      
                      <div className="flex flex-col text-sm gap-1">
                      <Link 
                          href="/blogs" 
                          className="flex gap-2 items-center text-gray-800 hover:bg-teal-100  px-2 py-1 rounded-md transition-colors duration-300"
                        >
                      <div className="flex gap-1 items-center transition-colors duration-300 px-2 py-2 rounded-md  hover:bg-teal-100 ">
                      <img src="/blog.png" alt="blog" className="w-5 h-5" />
                        
                          <span className="font-medium">Blogs</span>
                          
                        
                        <FaArrowRightLong className="ml-2" />
                        </div>
                        </Link>

                        <Link 
                          href="/reviews" 
                          className="flex  gap-2 items-center text-gray-800 hover:bg-teal-100 px-2 py-1 rounded-md  transition-colors duration-300"
                        >
                        <div className="flex gap-1 items-center transition-colors duration-300 px-2 py-2 rounded-md  hover:bg-teal-100 ">
                        <img src="/review.png" alt="review" className="w-5 h-5" />
                        
                          <span className="font-medium">Reviews</span>
                          
                        
                        <FaArrowRightLong className="ml-2" />
                        </div>
                        </Link>

                        <Link 
                          href="/faqs" 
                          className="flex  gap-2 items-center text-gray-800 hover:bg-teal-100 px-2 py-1 rounded-md  transition-colors duration-300"
                        >
                        <div className="flex gap-1 items-center transition-colors duration-300 px-2 py-2 rounded-md  hover:bg-teal-100 ">
                        <img src="/faq.png" alt="review" className="w-5 h-5" />
                        
                          <span className="font-medium">FAQs</span>
                          
                        
                        <FaArrowRightLong className="ml-2" />
                        </div>
                        </Link>

                        
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              <li
                className="relative flex font-medium text-lg items-center text-gray-700 px-2 py-[4px] cursor-pointer"
                onMouseEnter={() => setIsDownloadDropdownOpen(true)}
                onMouseLeave={() => setIsDownloadDropdownOpen(false)}
              >
                <span className="flex items-center">
                  Download
                  <ChevronDown 
                    size={20} 
                    className={`ml-1 transition-transform duration-300 ${isDownloadDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </span>

                <AnimatePresence>
                  {isDownloadDropdownOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      className="absolute top-12 right-0 bg-white rounded-lg shadow-lg p-3 min-w-68 border border-teal-100"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Image
                          src="/atdlogo.png"
                          alt="app logo"
                          width={380}
                          height={380}
                          className="w-32 mb-2"
                        />
                        <Link
                          href="/download/app-store"
                          className="flex items-center bg-black gap-2 text-sm text-gray-50 hover:text-teal-600 border hover:border-teal-600 transition-colors duration-300 w-full px-4 py-2 rounded-md hover:bg-teal-50"
                        >
                          <GrAppleAppStore className="text-xl  hover:text-teal-600" />
                          <span className="font-medium">Download from App Store</span>
                        </Link>
                        <Link
                          href="/download/play-store"
                          className="flex items-center bg-black gap-2 text-sm text-gray-50 hover:text-teal-600 border hover:border-teal-600 transition-colors duration-300 w-full px-4 py-2 rounded-md hover:bg-teal-50"
                        >
                          <IoLogoGooglePlaystore className="text-xl  hover:text-teal-600" />
                          <span className="font-medium">Download from Play Store</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              <li>
                <Link 
                  href="/user_signup" 
                  className="px-5 py-2 font-semibold border-2 rounded-md border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 flex items-center justify-center"
                >
                  Sign Up
                </Link>
              </li>
              <li>
              <Link href="/userlogin">
                <button className="px-8 py-2 bg-teal-500 font-bold text-white rounded-md">
                  Login
                </button>
              </Link>
              </li>
   
            </ul>
            
            <div className="lg:hidden text-2xl flex gap-4 items-center justify-center">
              <p className="text-lg font-medium text-gray-700">Get App</p>
              <GrAppleAppStore className="text-xl cursor-pointer hover:scale-110 transition-transform" />
              <IoLogoGooglePlaystore className="text-xl cursor-pointer hover:scale-110 transition-transform" />
              <button 
                className="relative z-50 ml-2 p-1 rounded-md hover:bg-gray-100 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <RxCross1 className="text-2xl text-gray-700" />
                ) : (
                  <RxHamburgerMenu className="text-2xl text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={backdropVariants}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div
              initial="closed"
              animate="open"
              exit="exit"
              variants={sidebarVariants}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-50 shadow-xl lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col p-6 h-full">
                <div className="flex justify-between items-center mb-8 mt-2">
                  <Image
                    src="/atdlogo.png"
                    alt="logo"
                    width={80}
                    height={80}
                    className="w-14"
                  />
                  <span className="font-bold text-[17px] text-teal-700">ATD MONEY</span>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Close menu"
                  >
                    <RxCross1 className="text-xl text-gray-700" />
                  </button>
                </div>
                
                <div className="flex flex-col gap-5">
                  {navigationLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="text-lg font-medium text-gray-700 hover:text-teal-600 transition-colors duration-300 border-b border-gray-100 pb-3"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  <div className="border-b border-gray-100 pb-3">
                    <button
                      className="flex justify-between items-center w-full text-lg font-medium text-gray-700"
                      onClick={() => setIsLearnDropdownOpen(!isLearnDropdownOpen)}
                    >
                      <span>Learn</span>
                      <ChevronDown 
                        size={20} 
                        className={`transition-transform duration-300 ${isLearnDropdownOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {isLearnDropdownOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-3 pl-4 mt-4">
                            <Link
                              href="/blogs"
                              className="text-gray-600 hover:text-teal-600 transition-colors duration-300 py-1"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Blogs
                            </Link>
                            <Link
                              href="/reviews"
                              className="text-gray-600 hover:text-teal-600 transition-colors duration-300 py-1"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Reviews
                            </Link>
                            <Link
                              href="/faqs"
                              className="text-gray-600 hover:text-teal-600 transition-colors duration-300 py-1"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              FAQs
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-3">
                    <button
                      className="flex justify-between items-center w-full text-lg font-medium text-gray-700"
                      onClick={() => setIsDownloadDropdownOpen(!isDownloadDropdownOpen)}
                    >
                      <span>Download</span>
                      <ChevronDown 
                        size={20} 
                        className={`transition-transform duration-300 ${isDownloadDropdownOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {isDownloadDropdownOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-4 pl-4 mt-4">
                            <Link
                              href="/download/app-store"
                              className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors duration-300 py-1"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <GrAppleAppStore className="text-xl" />
                              <span>App Store</span>
                            </Link>
                            <Link
                              href="/download/play-store"
                              className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors duration-300 py-1"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <IoLogoGooglePlaystore className="text-xl" />
                              <span>Play Store</span>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="mt-auto mb-6 pt-6">
                  <Link
                    href="/user_signup"
                    className="w-full py-3 flex justify-center font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 transition-colors duration-300 shadow-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link href="/userlogin">
                <button className="px-8 mt-3 w-full py-3 bg-white font-semibold text-teal-600 border border-teal-600 transition-colors duration-300 shadow-md rounded-md">
                  Login
                </button>
              </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Navbar;