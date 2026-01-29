"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ContactInfo from "@/components/Web/contact/ContactInfo";
import ContactForm from "@/components/Web/contact/ContactForm";
import Image from "next/image";

// Main component split into two parts: ContactInfo and ContactForm
const ContactUs = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className=" bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center px-4 md:px-10 py-8 md:py-9">
         <div className="mb-6 relative z-10">
        <Image 
          src="/contactus.jpg" 
          alt="Contact Us Banner" 
          width={5500} 
          height={5200} 
          className="w-500 h-80 rounded-lg"
          priority
        />
      </div>
      {mounted && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-8xl bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl border border-gray-100"
        >
           
          {/* Left section - Contact Information */}
          <ContactInfo />

          {/* Right section - Contact Form */}
          <ContactForm />
        </motion.div>
      )}
    </div>
  );
};




export default ContactUs;