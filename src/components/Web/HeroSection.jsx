import React from "react";
import Image from "next/image";
import Link from "next/link";

function HeroSection() {
  return <div className=" px-4 md:px-10 flex flex-col md:flex-row justify-between items-center bg-gradient-to-b from-teal-50 to-[#f5e3df] py-5 md:py-10">
      <section className="max-w-4xl flex flex-col gap-0 md:gap-4">
        <div>
        <h1 className="text-3xl md:text-5xl font-bold text-black leading-tight mb-2">
        Empower your goals with the right
        </h1>
        <h1 className="text-3xl md:text-5xl font-bold text-orange-400 leading-tight mb-6">
          Personal Loan
        </h1>
        </div>
        <h3 className="text-lg md:text-2xl font-normal text-gray-800 mb-8">
        Loans in minutes — only with ATD Money
        </h3>

        <div className="flex flex-wrap md:flex-row gap-4 md:gap-3 mb-4">
          <span className="text-gray-700">Fast Online Instant Approvals |</span>

          <span className="text-gray-700">Flexible payments |</span>

          <span className="text-gray-700"> No Prepayment Fees |</span>
          <span className="text-gray-700">
            One-time application for multiple loans
          </span>
        </div>


        <div className="flex flex-col md:flex-row  gap-4 w-full md:w-auto">
          <Link href ="/user_signup" >
          <button className="bg-teal-500 border cursor-pointer shadow-lg shadow-teal-400 animate-bounce text-white font-medium py-4 px-8 rounded-md hover:bg-teal-600 transition-colors duration-300">
            Get Your Loan Now
          </button>
          </Link>
        </div>
      </section>

      <section className="mt-10 md:mt-0">
        <Image src="/heroimage7.png" alt="Person with financial icons" width={500} height={500} className="object-contain" priority />
      </section>
    </div>;
}

export default HeroSection;