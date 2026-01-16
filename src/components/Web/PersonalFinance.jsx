"use client"
import { useState } from 'react';
import { ChevronRight, Shield, DollarSign, CheckCircle, Clock, IndianRupee } from 'lucide-react';

export default function PersonalFinanceComponent() {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  
  const features = [
    {
      id: 1,
      number: "1",
      title: "Checking your rates won't affect your credit score",
      icon: <CheckCircle className="text-white" size={20} />
    },
    {
      id: 2,
      number: "2",
      title: "Our rates are often lower than the banks",
      icon: <IndianRupee  className="text-white" size={20} />
    },
    {
      id: 3,
      number: "3",
      title: "We have simple online application",
      icon: <Clock className="text-white" size={20} />
    },
    {
      id: 4,
      number: "4",
      title: "No early repayment fees, no hidden charges",
      icon: <Shield className="text-white" size={20} />
    }
  ];

  return (
    <div className="w-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white overflow-hidden">
      <div className=" px-4 md:px-10 py-14 md:py-24 flex flex-col md:flex-row items-center">
        {/* Left content */}
        <div className="w-full md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-8">
          <h3 className="text-xl md:text-2xl font-light mb-6 text-yellow-300">
            Personal finance that fits you
          </h3>
          <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-8 leading-tight">
            We've built a secure & personalized experience
          </h2>
          
        </div>
        
        {/* Right content */}
        <div className="w-full md:w-1/2">
          <div className="rounded-xl bg-emerald-600/30 backdrop-blur-sm px-0 py-6 md:p-8 shadow-xl border border-white/10">
            {features.map((feature) => (
              <div 
                key={feature.id}
                className={`flex items-center mb-6 last:mb-0 p-4 rounded-lg transition-all duration-300 ${
                  hoveredFeature === feature.id ? 'bg-white/10' : ''
                }`}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center mr-4 shadow-md">
                  {feature.icon}
                </div>
                <div>
                  <p className="text-base md:text-lg font-medium">{feature.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}