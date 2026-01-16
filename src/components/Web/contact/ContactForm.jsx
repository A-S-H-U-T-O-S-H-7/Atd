import {
  FaPaperPlane,
  FaCheckCircle,
  FaIdCard,
  FaFileInvoiceDollar,
  FaExclamationTriangle
} from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    loanNumber: "",
    crnId: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState({
    sending: false,
    success: false,
    error: false,
    errorMessage: ""
  });

  const formItemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setFormStatus({
        sending: false,
        success: false,
        error: true,
        errorMessage: "Please fill in all required fields."
      });
      return;
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      setFormStatus({
        sending: false,
        success: false,
        error: true,
        errorMessage: "Please enter a valid 10-digit phone number."
      });
      return;
    }

    setFormStatus({
      sending: true,
      success: false,
      error: false,
      errorMessage: ""
    });

    try {
      // Prepare the request payload according to API specification
      const requestPayload = {
        provider_id: 1, 
        name: formData.name,
        email: formData.email,
        mobile: parseInt(formData.phone), 
        message: formData.message
      };

      // Add optional fields only if they have values
      if (formData.loanNumber.trim()) {
        requestPayload.loan_no = formData.loanNumber;
      }
      if (formData.crnId.trim()) {
        requestPayload.crnno = formData.crnId;
      }

      const response = await fetch('https://api.atdmoney.in/api/contact-us', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      });

      const responseData = await response.json();

      if (response.ok) {
        // Reset form data
        setFormData({ 
          name: "", 
          email: "", 
          phone: "", 
          loanNumber: "", 
          crnId: "", 
          message: "" 
        });

        // Set success status
        setFormStatus({
          sending: false,
          success: true,
          error: false,
          errorMessage: ""
        });

        // Hide success message after 5 seconds
        setTimeout(() => {
          setFormStatus({
            sending: false,
            success: false,
            error: false,
            errorMessage: ""
          });
        }, 5000);
      } else {
        // Handle API error response
        setFormStatus({
          sending: false,
          success: false,
          error: true,
          errorMessage: responseData.message || "Failed to send message. Please try again."
        });
      }
    } catch (error) {
      // Handle network or other errors
      setFormStatus({
        sending: false,
        success: false,
        error: true,
        errorMessage: "Network error. Please check your connection and try again."
      });
    }
  };

  return (
    <div className="w-full md:w-3/5 px-4 py-6 sm:py-8 sm:px-4  lg:p-10 bg-gray-50 relative">
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30 z-0 overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0H100V100H0V0Z"
            fill="url(#paint0_radial)"
            fillOpacity="0.1"
          />
          <defs>
            <radialGradient
              id="paint0_radial"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(50 50) rotate(90) scale(50)"
            >
              <stop stopColor="#4F46E5" />
              <stop offset="1" stopColor="#4F46E5" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10">
        <motion.h2
          variants={formItemVariants}
          className="text-2xl sm:text-3xl font-heading font-bold text-gray-800 mb-2"
        >
          Message Us
        </motion.h2>

        <motion.p
          variants={formItemVariants}
          className="text-gray-500 mb-6"
        >
          We'll respond to your inquiry within 24 hours
        </motion.p>

        {/* Success message */}
        {formStatus.success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-green-50 p-6 rounded-lg border border-green-100 flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <FaCheckCircle className="text-3xl text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Message Sent Successfully!
            </h3>
            <p className="text-gray-600">
              Your feedback has been saved. We'll get back to you soon.
            </p>
          </motion.div>
        )}

        {/* Error message */}
        {formStatus.error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 p-4 mb-6 rounded-lg flex items-start space-x-3"
          >
            <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-red-800 font-medium">Error</h4>
              <p className="text-red-700 text-sm">
                {formStatus.errorMessage}
              </p>
            </div>
          </motion.div>
        )}

        {!formStatus.success && (
          <div className="space-y-5 sm:space-y-6">
            {/* Name field */}
            <motion.div variants={formItemVariants}>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full p-3 sm:p-4 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm sm:text-base transition duration-200"
                required
              />
            </motion.div>

            {/* Two column layout for email and phone */}
            <motion.div variants={formItemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Email field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-3 sm:p-4 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm sm:text-base transition duration-200"
                  required
                />
              </div>

              {/* Phone field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full p-3 sm:p-4 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm sm:text-base transition duration-200"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
              </div>
            </motion.div>

            {/* Two column layout for loan number and CRN ID */}
            <motion.div variants={formItemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Loan Number field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  <FaFileInvoiceDollar className="inline-block mr-1" /> Loan Number
                  <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="loanNumber"
                  value={formData.loanNumber}
                  onChange={handleChange}
                  placeholder="Enter your loan number"
                  className="w-full p-3 sm:p-4 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm sm:text-base transition duration-200"
                />
              </div>

              {/* CRN ID field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  <FaIdCard className="inline-block mr-1" /> CRN ID
                  <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="crnId"
                  value={formData.crnId}
                  onChange={handleChange}
                  placeholder="Enter your CRN ID"
                  className="w-full p-3 sm:p-4 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm sm:text-base transition duration-200"
                />
              </div>
            </motion.div>

            {/* Message field */}
            <motion.div variants={formItemVariants}>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Enter your message or inquiry"
                className="w-full p-3 sm:p-4 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm sm:text-base transition duration-200 resize-vertical"
                required
              />
            </motion.div>

            {/* Submit button */}
            <motion.button
              variants={formItemVariants}
              type="button"
              onClick={handleSubmit}
              disabled={formStatus.sending}
              className={`
                w-full p-3 sm:p-4 rounded-xl text-sm sm:text-base font-semibold transition duration-300
                ${formStatus.sending
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg transform hover:translate-y-px"}
                flex items-center justify-center space-x-2
              `}
              whileHover={{ scale: formStatus.sending ? 1 : 1.02 }}
              whileTap={{ scale: formStatus.sending ? 1 : 0.98 }}
            >
              {formStatus.sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <FaPaperPlane className="ml-2" />
                </>
              )}
            </motion.button>
          </div>
        )}

        {/* Reset button after successful submission */}
        {formStatus.success && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => {
              setFormStatus({
                sending: false,
                success: false,
                error: false,
                errorMessage: ""
              });
              setFormData({
                name: "",
                email: "",
                phone: "",
                loanNumber: "",
                crnId: "",
                message: ""
              });
            }}
            className="mt-6 p-3 w-full sm:w-auto bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-200 font-medium flex items-center justify-center"
          >
            Send Another Message
          </motion.button>
        )}
      </div>
    </div>
  );
};