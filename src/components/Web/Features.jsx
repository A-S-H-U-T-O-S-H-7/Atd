import React from 'react';
import { Image } from 'lucide-react';

// Card component (defined before it's used)
function FeatureCard({ image, title, subtitle }) {
  return (
    <div className="w-full transition-all rounded-xl duration-300 hover:shadow-lg">
      <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-white border border-gray-200 rounded-xl shadow-sm h-48 md:h-56">
        <div className="mb-3 bg-amber-50 p-1 rounded-full">
          <img src={image} alt={title} className="w-16 h-10 md:w-18 md:h-16 object-contain" />
        </div>
        <h3 className="text-sm md:text-xl text-center font-semibold text-gray-800 mb-1 md:mb-2">{title}</h3>
        <p className="text-xs md:text-base text-gray-600 text-center">{subtitle}</p>
      </div>
    </div>
  );
}

function Features() {
    const featureData = [
        {
          image: "/payment.png",
          title: "Zero Fees for Early Repayment",
          subtitle: "Repay your loan early and save on interest — no penalties, ever."
        },
        {
          image: "/check-list.png",
          title: "Quick Loans, Less Paperwork",
          subtitle: "Get your loan approved fast with a simple, hassle-free process."
        },
        {
          image: "/coin.png",
          title: "Your Good Credit Pays Off",
          subtitle: "Enjoy better rates and exclusive benefits for strong credit profiles."
        },
        {
          image: "/approved.png",
          title: "Instant Online Loan Approvals",
          subtitle: "Apply anytime and get cash loans approved in minutes — tailored to you."
        }
      ];
      

  return (
    <div className="px-4 md:px-10 py-8 md:py-16 bg-amber-50">
      <div className=" mb-10 text-center">
        <h2 className=" text-2xl md:text-3xl font-semibold text-gray-900 mb-4">Know What You're Paying For</h2>
        <p className="text-base md:text-lg text-gray-700">
          From zero hidden fees to instant approvals — we keep it easy and honest.
        </p>
      </div>
       
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-full mx-auto">
        {featureData.map((feature, index) => (
          <FeatureCard 
            key={index}
            image={feature.image}
            title={feature.title}
            subtitle={feature.subtitle}
          />
        ))}
      </div>
    </div>
  );
}

export default Features;