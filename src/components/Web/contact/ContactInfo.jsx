import { FaXTwitter } from "react-icons/fa6";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
   FaInfoCircle,
  FaPinterest
  } from "react-icons/fa";
import { motion } from "framer-motion";
import { IoLogoYoutube } from "react-icons/io";
import Image from "next/image";

export default function ContactInfo() {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const socialLinks = [
    {
      Icon: FaFacebook,
      color: "text-blue-600 hover:text-blue-700",
      bgColor: "hover:bg-blue-50",
      link: "https://www.facebook.com/profile.php?id=100088690347026"
    },
    {
      Icon: FaXTwitter,
      color: "text-gray-700 hover:text-gray-900",
      bgColor: "hover:bg-gray-100",
      link: "https://x.com/MoneyAtd"
    },
    {
      Icon: FaInstagram,
      color: "text-pink-600 hover:text-pink-700",
      bgColor: "hover:bg-pink-50",
      link: "https://www.instagram.com/atdmoneyindia/"
    },
    {
      Icon: FaLinkedin,
      color: "text-blue-700 hover:text-blue-800",
      bgColor: "hover:bg-blue-50",
      link: "https://www.linkedin.com/company/atdmoney2/?viewAsMember=true"
    },
   
    {
        Icon: IoLogoYoutube,
        color: "text-red-600 hover:text-red-700",
        bgColor: "hover:bg-red-50",
        link: "https://www.youtube.com/channel/UCclz8GoGt6S4vCHsDTCTLlQ"
      },
      {
        Icon: FaPinterest,
        color: "text-red-600 hover:text-red-700",
        bgColor: "hover:bg-red-50",
        link: "https://in.pinterest.com/atdmoney/"
      }
  ];

  return <div className="w-full md:w-2/5 py-6 px-4 sm:p-8 lg:p-10 bg-white relative">
    
      {/* Decorative elements */}
      <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-50 z-0" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-indigo-50 z-0" />

      <div className="relative z-10 space-y-6">
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-800 mb-4">
            Get in Touch
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4" />
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Have questions about our financial services? We're here to help.
            Reach out using the form or contact us directly.
          </p>
        </motion.div>

        <div className="space-y-4 mt-6">
          {/* Phone - Updated with tel links */}
          <motion.div variants={itemVariants} className="flex items-center space-x-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition duration-300">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600">
              <FaPhone className="text-xl" />
            </div>
            <div className="flex-col md:flex gap-3 justify-center items-center space-y-2">
              <a href="tel:01204348458" className="flex items-center gap-3 group text-sm sm:text-base text-gray-700 hover:text-blue-600 transition duration-300">
                <span>01204348458</span>
                <span> , </span>
              </a>
              <a href="tel:+919999589229" className="flex items-center gap-3 group text-sm sm:text-base text-gray-700 hover:text-blue-600 transition duration-300">
                <span>+91 9999589229</span>
              </a>
            </div>
          </motion.div>

          {/* Email - Updated with mailto link */}
          <motion.div variants={itemVariants} className="flex items-center space-x-4 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition duration-300">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-600">
              <FaEnvelope className="text-xl" />
            </div>
            <a href="mailto:info@atdmoney.com" className="text-sm sm:text-base text-gray-700 hover:text-indigo-600 transition duration-300">
              info@atdmoney.com
            </a>
          </motion.div>

          {/* Address - Fixed layout for better space */}
          <motion.div variants={itemVariants} className="flex p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition duration-300">
            <div className="w-10 h-10 rounded-full bg-white flex-shrink-0 flex items-center justify-center shadow-sm text-emerald-600 mt-1">
              <FaMapMarkerAlt className="text-xl" />
            </div>
            <span className="text-sm sm:text-base text-gray-700 ml-4">
              <strong className="mb-2">
                ATD Financial Services Pvt. Ltd.
              </strong>,<br /> 1ST FLOOR, C 316, B AND C, SECTOR 10, NOIDA, Gautam Buddha Nagar, UP, 201301
            </span>
          </motion.div>
        </div>

        {/* Grievance Officer Details - Updated with InfoCircle icon */}
        <motion.div variants={itemVariants} className="mt-8 bg-red-50 px-6 py-5 rounded-xl border border-red-600 shadow-sm">
          <div className="flex gap-4 items-center mb-3">
        <Image src="/officer.png" alt="ATD Money Logo" width={240} height={240} className="object-contain w-10 md:w-12" priority />
            <h3 className=" text-base md:text-lg font-heading font-bold text-gray-800">
              GRIEVANCE OFFICER DETAILS
            </h3>
          </div>
          <div className="space-y-2 pl-2 border-l-2 border-red-200">
            <p className="flex items-center text-gray-700">
              <span className="font-medium mr-2">Name:</span> Kisan Sahoo
            </p>
            <p className="flex items-center text-gray-700">
              <span className="font-medium mr-2">MOB.:</span>
              <a href="tel:+919999589201" className="hover:text-red-600 transition duration-300">
                9999589201
              </a>
            </p>
            <p className="flex flex-wrap items-center text-gray-700">
              <span className="font-medium mr-2">Email:</span>
              <a href="mailto:grievance@atdmoney.com" className="hover:text-red-600 transition duration-300">
                grievance@atdmoney.com
              </a>
            </p>
          </div>
        </motion.div>

        {/* RBI Sachet Portal Link - Updated with InfoCircle icon */}
        <motion.div variants={itemVariants} className="mt-6 bg-blue-50 px-6 py-5 rounded-xl border border-blue-600 shadow-sm">
          <div className="flex gap-4 items-center mb-3">
            <Image src="/complain.png" alt="ATD Money Logo" width={240} height={240} className="object-contain w-8 md:w-10" priority />
            <h3 className= " text-base md:text-lg font-heading font-bold text-gray-800">
              SACHET PORTAL / RBI COMPLAIN PORTAL
            </h3>
          </div>
          <a href="https://sachet.rbi.org.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-3 bg-white text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition duration-300 shadow-sm">
            <FaInfoCircle className="mr-2" />
            https://sachet.rbi.org.in
          </a>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-6 mt-2 border-t border-gray-100">
          <h3 className="text-base sm:text-lg font-heading font-semibold text-gray-700 mb-4">
            Follow Us
          </h3>
          <div className="flex flex-wrap space-x-4 space-y-2 sm:space-x-5">
            {socialLinks.map(({ Icon, color, bgColor, link }, index) =>
              <a
                key={index}
                href={link} target="_blank"
                className={`p-3 rounded-full ${color} ${bgColor} border border-gray-100 transition transform hover:scale-110 hover:shadow-sm`}
              >
                <Icon />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>;
}