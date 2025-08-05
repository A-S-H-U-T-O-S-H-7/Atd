import React, { useState } from 'react';
import { User, Building2, CreditCard, Users } from 'lucide-react';

// Import the modal components
import PersonalDetailsModal from './PersonalDetailModal';
import BankLoanModal from './BankLoanModal';
import OrganizationModal from './OrganizationModal';

const UserInfoSection = ({ user }) => {
  const [activeModal, setActiveModal] = useState(null);

  // Sample data with proper fallback
  const userData = user || {
    fname: "John",
    lname: "Doe",
    email: "john.doe@example.com",
    mobile: "+91 9876543210",
    dob: "1990-05-15",
    gender: "Male",
    fathername: "Robert Doe",
    curr_address: "123 Main Street, Apartment 4B",
    curr_city: "Mumbai",
    curr_state: "Maharashtra",
    curr_pincode: "400001",
    per_address: "456 Oak Avenue",
    per_city: "Pune",
    per_state: "Maharashtra", 
    per_pincode: "411001",
    loan_amount: "500000",
    loan_tenure: "60",
    bank_name: "HDFC Bank",
    bank_branch: "Bandra West",
    ifsc_code: "HDFC0001234",
    account_number: "12345678901234",
    account_type: "Savings",
    company_name: "Tech Solutions Pvt Ltd",
    designation: "Senior Software Engineer",
    monthly_salary: "75000",
    net_salary: "68000",
    office_phone: "+91 22 12345678",
    hr_name: "Sarah Smith",
    hr_phone: "+91 9876543211",
    hr_email: "hr@techsolutions.com",
    references: [
      { name: "Alice Brown", phone: "+91 9876543213", email: "alice@example.com" },
      { name: "David Wilson", phone: "+91 9876543214", email: "david@example.com" }
    ]
  };

  const infoCards = [
    {
      id: 'personal',
      title: 'Personal Details',
      icon: User,
      bgGradient: 'bg-gradient-to-br from-blue-400 to-blue-600',
      cardGradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      hoverBorder: 'hover:border-blue-300',
      hoverShadow: 'hover:shadow-blue-200/50',
    },
    {
      id: 'bank',
      title: 'Bank & Loan Details',
      icon: CreditCard,
      bgGradient: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
      cardGradient: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      hoverBorder: 'hover:border-emerald-300',
      hoverShadow: 'hover:shadow-emerald-200/50',
    },
    {
      id: 'organization',
      title: 'Organization Details',
      icon: Building2,
      bgGradient: 'bg-gradient-to-br from-purple-400 to-purple-600',
      cardGradient: 'bg-gradient-to-br from-purple-50 to-purple-100',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      hoverBorder: 'hover:border-purple-300',
      hoverShadow: 'hover:shadow-purple-200/50',
    },
    
  ];

  const openModal = (modalId) => {
    setActiveModal(modalId);
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="bg-gradient-to-br from-cyan-100 via-emerald-50 to-teal-100 rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Information Overview</h2>
        <p className="text-sm sm:text-base text-gray-600">Click on any card to view detailed information</p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {infoCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => openModal(card.id)}
              className={`
                cursor-pointer group relative p-3 sm:p-4 rounded-xl transition-all duration-300 
                transform hover:scale-105 hover:shadow-lg ${card.hoverShadow}
                ${card.cardGradient} border-2 ${card.borderColor} ${card.hoverBorder}
              `}
            >
              <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                {/* Icon Container */}
                <div className={`
                  w-10 h-10 sm:w-12 sm:h-12 ${card.bgGradient} rounded-xl 
                  flex items-center justify-center 
                  transition-all duration-300 shadow-md 
                  group-hover:shadow-lg group-hover:scale-110
                `}>
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">
                    {card.title}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Components */}
      <PersonalDetailsModal 
        isOpen={activeModal === 'personal'} 
        onClose={closeModal} 
        user={userData} 
      />
      <BankLoanModal 
        isOpen={activeModal === 'bank'} 
        onClose={closeModal} 
        user={userData} 
      />
      <OrganizationModal 
        isOpen={activeModal === 'organization'} 
        onClose={closeModal} 
        user={userData} 
      />
      
    </div>
  );
};

export default UserInfoSection;