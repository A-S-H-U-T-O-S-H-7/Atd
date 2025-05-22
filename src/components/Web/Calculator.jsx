"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Calculator() {
  const [amount, setAmount] = useState(3000);
  const [days, setDays] = useState(91);
  const interest = amount * 0.073 / 91 * days;
  const total = amount + interest;

  const steps = [
    {
      title: "Check your rates",
      desc: "It takes just a few minutes to provide us with your information."
    },
    {
      title: "Sign your contract online",
      desc: "Use our secure application to e-sign your contract if approved."
    },
    {
      title: "Funds as soon as tomorrow",
      desc: "Money can be directly deposited into your bank account."
    }
  ];

  return (
    <div className=" py-10 px-4 md:px-20 bg-[#f8fffb]">
      <div className="text-center pb-10">
        <h3 className="text-2xl md:text-3xl font-semibold pb-3 ">Loan Calculator</h3>
        <p className="text-gray-700 text-base text-center md:text-lg">Get a Clear View of Your Loan Costs</p>
      </div>
      <div className="p-2 border border-teal-500 rounded-lg flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-gray-50 via-white to-teal-50 ">
        {/* Left: Steps */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className=" space-y-6 "
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-center py-6">
            Simple Application Process
          </h2>
          <div className="relative pl-6">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-teal-500/30" />

            {steps.map((step, idx) =>
              <div key={idx} className="relative mb-5 md:mb-19 pl-6">
                {/* Milestone Point */}
                <motion.div
                  className="absolute -left-3 top-0 z-10"
                  initial={{ scale: 0.6, opacity: 0.7 }}
                  animate={{
                    scale: [0.6, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                    transition: {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop"
                    }
                  }}
                >
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                </motion.div>

                <div className="pl-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {step.desc}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right: Calculator */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2  p-4 md:p-8 mt-8 md:mt-0 md:ml-6 bg-white shadow-sm rounded-xl space-y-6 border border-gray-100"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-teal-600 text-center mb-6">
            Calculate Your Rate
          </h2>

          {/* Loan Amount Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-600">
                Loan Amount
              </label>
              <span className="text-teal-600 border px-2 py-1 rounded-md font-semibold">
                ₹{amount}
              </span>
            </div>
            <input
              type="range"
              min="3000"
              max="50000"
              value={amount}
              step="100"
              onChange={e => setAmount(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-transparent
             [&::-webkit-slider-thumb]:appearance-none 
  [&::-webkit-slider-thumb]:w-4 
  [&::-webkit-slider-thumb]:h-4 
  [&::-webkit-slider-thumb]:bg-teal-600 
  [&::-webkit-slider-thumb]:rounded-full
  [&::-moz-range-thumb]:appearance-none
  [&::-moz-range-thumb]:w-4
  [&::-moz-range-thumb]:h-4
  [&::-moz-range-thumb]:bg-teal-600
  [&::-moz-range-thumb]:rounded-full"
              style={{
                background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${(amount -
                  3000) /
                  (50000 - 3000) *
                  100}%, #e5e7eb ${(amount - 3000) /
                  (50000 - 3000) *
                  100}%, #e5e7eb 100%)`
              }}
            />

            <div className="flex text-gray-500 justify-between items-center mt-2">
              <p>3k</p>
              <p>50k</p>
            </div>
          </div>

          {/* Days Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-600">
                Duration
              </label>
              <span className="text-teal-600 border px-2 py-1 rounded-md font-semibold">
                {days} Days
              </span>
            </div>
            <input
              type="range"
              min="91"
              max="365"
              value={days}
              step="1"
              onChange={e => setDays(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-transparent
              [&::-webkit-slider-thumb]:appearance-none 
  [&::-webkit-slider-thumb]:w-4 
  [&::-webkit-slider-thumb]:h-4 
  [&::-webkit-slider-thumb]:bg-teal-600 
  [&::-webkit-slider-thumb]:rounded-full
  [&::-moz-range-thumb]:appearance-none
  [&::-moz-range-thumb]:w-4
  [&::-moz-range-thumb]:h-4
  [&::-moz-range-thumb]:bg-teal-600
  [&::-moz-range-thumb]:rounded-full"
              style={{
                background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${(days -
                  91) /
                  (365 - 91) *
                  100}%, #e5e7eb ${(days - 91) /
                  (365 - 91) *
                  100}%, #e5e7eb 100%)`
              }}
            />

            <div className="flex text-gray-500 justify-between items-center mt-2">
              <p>91 days</p>
              <p>365 days</p>
            </div>
          </div>

          {/* Result Display */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Borrowing:</span>
              <span className="font-semibold">
                ₹{amount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Interest to pay:</span>
              <span className="font-semibold">
                ₹{interest.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 border-gray-200">
              <span className="text-gray-800 font-medium">
                Total you will pay:
              </span>
              <span className="text-teal-600 font-bold">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <Link href="/signup">
          <button className="w-full bg-teal-600 hover:bg-teal-700 transition-all text-white font-medium py-3 px-4 rounded-lg mt-6 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50">
            Apply Now
          </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
