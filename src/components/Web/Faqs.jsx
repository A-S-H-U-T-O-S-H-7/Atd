"use client"

import { useState } from "react";
import Image from "next/image";
import { FaAngleDown } from "react-icons/fa";

export default function FAQs() {
  const [activeIndex, setActiveIndex] = useState(null);

  
const faqData = [
     {
      question: "I have tried to open the Atd Money loan link, but it's not running, what should I do?",
      answer: "» Re-open the link\n» Try a different browser\n» Check the internet connection\n» Please click on www.atdmoney.com/loan. If the issue still persists, write to us at info@atdmoney.com",
    },
    {
      question: "What are the fundamentals or essentials to avail a Atd Money loan?",
      answer: "» The customer should be a Citizen of India.\n» Should have valid e-mail address and a mobile number.\n» A functional webcam with Internet connection.\n» Valid Aadhaar card with Authenticated details.\n» Personal Bank account details and Net Banking details.",
    },
    {
      question: "Which documents are required to be eligible for a Atd Money loan?",
      answer: "» Aadhaar card\n» Address Proof (if different from Aadhaar)\n» PAN Card\n» Salary Slip\n» Photo\n» PDC\n» Loan agreement\n» NACH Form",
    },
    
    {
        question: "Can I apply for a Atd Money through my mobile phone?",
        answer: "Yes, you can apply through mobile."
      },
      {
        question: "Is ATD Money Loan website compatible with all types of mobile phones?",
        answer: "Yes, it is compartible"
      },
      {
        question: "What is the least and max limit of Atd Money loan amount?",
        answer: "Rs.3000 to Rs.50000/-"
      },
      {
        question: "What is the interest rate for ATD Money Loan?",
        answer: ".067% per day."
      },
      {
        question: "How many EMIs would be needed to repay Atd Money loan?",
        answer: "Only for one time payment of principal alongwith interest ."
      },
      {
        question: "How much time it takes to approve a Atd Money loan?",
        answer: "8 hrs to 24 hrs"
      },
      {
        question: "How much time it takes in money disbursement?",
        answer: "After completion of formalities, it takes 30 minutes to disburse the loan amount. All loans transferred online to your given account."
      },
      {
        question: "Can an existing customer of ATD GROUP can apply for a Atd Money loan?",
        answer: "Yes, all atd group customers,associates can apply for the loan."
      },
      {
        question: "On the basis of which address (Current/Permanent), the Atd Money loan will be approved?",
        answer: "Loan will be approved on the basis of Currernt Address."
      },
      {
        question: "Which browsers are compatible for ATD Money website?",
        answer: "Our website can be accessed by the latest version of Microsoft Edge, Google Chrome and Firefox."
      },
      {
        question: "I'm unemployed right now, am I eligible to apply for a Atd Money loan?",
        answer: "In order to apply for a Atd Money loan, it is important that the customer is salaried."
      },
      {
        question: "Will I receive different OTP on mobile and e-mail?",
        answer: "Yes, you will receive different otp for mobile and email."
      },
      {
        question: "What would happen if I do not get an OTP on my email or mobile phone?",
        answer: "It is advisable to wait for at least 5-7 minutes, if you still don't receive it then click on re-send button."
      },
      {
        question: "My current address is not similar as mentioned in my Aadhar card. What I am supposed to do?",
        answer: "In such case, it is important that customer fills in the current address and upload an address proof as per the document list to confirm the address details."
      },
      {
        question: "Can I modify my loan amount information?",
        answer: "The loan amount can be edited at the amount selection stage."
      },
      {
        question: "I am receiving a note \"your loan application couldn't be submitted\", what I am supposed to do?",
        answer: "Please check your internet connectivity and try again. If it still doesn't work, please write to us on info@atdmoney.com"
      },
      {
        question: "Why my Atd Money loan application has been rejected?",
        answer: "The customer's loan application can be rejected if any of the submitted field is not correct or not meeting our loan policy. The customer can however re apply after 30 days."
      },
      {
        question: "My mobile number is not linked with Aadhaar card, can I continue with the Atd Money loan application?",
        answer: "In order to complete the loan formalities, it is necessary that customer's mobile number is linked with Aadhaar card."
      },
      {
        question: "What is the time limit for getting OTP for Aadhaar card verification, email id and mobile number?",
        answer: "For mobile and e-mail ID, OTP will be sent in 1 minute."
      },
      {
        question: "I am not using net-banking through my bank account, am I still eligible to apply for the ATD Money loan?",
        answer: "No, in order to apply for a loan online, net banking is important"
      },
      {
        question: "Is this possible that I can use someone else's bank account.",
        answer: "No, Only the borrower's account can be entertained"
      },
      {
        question: "My system got shut down while I was filling the ATD Money loan application",
        answer: "You can re-login and complete your saved application with same credentials."
      },
      {
        question: "How much time it will take for credit the specific amount into my account?",
        answer: "The loan amount approval time is 8-24 hrs. The amount will be disbursed twice a day at 11 am and 5.30 pm for documents received at 10 am and 4.30 pm respectively."
      },
      {
        question: "Do you guys pay out an instant Atd Money loan in 7 days a week?",
        answer: "We disburse loan 365 days irrespective of holidays,Sundays etc."
      },
      {
        question: "Can I exclude my loan prior to the tenure?",
        answer: "Yes. Foreclose will be available with interest for the full period opted at the time of loan application and sanctioned."
      },
      {
        question: "Is free-look alternative is available in ATD Money loan?",
        answer: "No."
      },
      {
        question: "What is final agreement?",
        answer: "The final agreement includes the customer's loan summary, his application form and ATD FINANCE terms and conditions to which the customer has agreed upon while applying for a loan."
      },
      {
        question: "When can I apply again for the ATD Money loan after first approved disbursal?",
        answer: "Immediately after closer of last loan."
      },
      {
        question: "I have successfully completed all the steps, although I didn't receive any clue or hint concerning loan approvals and disbursal.",
        answer: "Please log in to your account and proceed."
      },
      {
        question: "What if the amount is not paid out within the specified time limit?",
        answer: "Please write to us info@atdmoney.com"
      },

  ];
  

  const toggle = (index) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  return <div className="min-h-screen text-gray-800">
      <div className=" mx-4 mt-6 md:mx-10 border border-emerald-400 
                bg-gradient-to-br from-emerald-50 to-cyan-50
                shadow-lg shadow-emerald-100
                rounded-xl
                p-4 md:p-6">
        <div >
          <Image src="/FAQs.jpg" alt="Blog Banner" width={4500} height={4200} className="w-500 h-60 rounded-xl" priority />
        </div>
      </div>

      <section className="px-4 md:px-10 py-12">
        <h1 className="text-2xl md:text-4xl font-bold text-center pb-10 text-teal-500">
          Frequently Asked Questions
        </h1>

        {faqData.map((item, index) =>
          <div
            key={index}
            className="bg-white shadow-md rounded-xl mb-4 border border-gray-200 transition-all"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center p-5 text-left text-base md:text-lg font-semibold"
            >
              <span className="pr-4  text-left flex-1">
                {item.question}
              </span>
              <FaAngleDown
                className={`min-w-[20px] min-h-[20px] text-xl transition-transform duration-300 ${activeIndex ===
                index
                  ? "rotate-180 text-teal-600"
                  : ""}`}
              />
            </button>
            {activeIndex === index &&
              <div className="px-5 pb-5 whitespace-pre-line text-gray-600 transition-all duration-300">
                {item.answer}
              </div>}
          </div>
        )}
      </section>
    </div>;
}