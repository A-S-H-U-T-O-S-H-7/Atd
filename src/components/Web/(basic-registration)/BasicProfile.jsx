import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { User, Mail, Phone, Calendar, CreditCard, FileText, Wallet, Shield, Clock, Zap, Users, Gift } from 'lucide-react';

function BasicProfile() {
  const user = {
    name: 'Ashutosh Mohanty',
    email: 'ashutosh@example.com',
    phone: '+91-9876543210',
    dob: '01/01/1990',
    aadhar: 'XXXX-XXXX-1234',
    pan: 'ABCDE1234F',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 overflow-hidden">
      {/* Simple Abstract Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-teal-100/30 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col p-6">
        {/* Clean Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <Image src="/atdlogo.png" alt="ATD Money" width={100} height={32} />
          </div>
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Main Content - Single Row */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 px-10 mx-auto w-full">
          
          {/* Profile Card - Compact */}
          <div className="bg-white border border-emerald-400 rounded-2xl p-6 shadow-lg shadow-teal-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-slate-800">Profile</h2>
                <p className="text-sm text-slate-500">User Information</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { icon: User, label: 'Name', value: user.name },
                { icon: Mail, label: 'Email', value: user.email },
                { icon: Phone, label: 'Mobile', value: user.phone },
                { icon: Calendar, label: 'DOB', value: user.dob },
                { icon: CreditCard, label: 'Aadhar', value: user.aadhar },
                { icon: FileText, label: 'PAN', value: user.pan },
              ].map((item, index) => (
                <div key={index} className="flex items-center text-sm">
                  <item.icon className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                  <span className="text-slate-600 w-16 flex-shrink-0">{item.label}:</span>
                  <span className="text-slate-800 font-medium truncate">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Loan Card - Clean */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            
            <div className="flex items-center mb-4">
              <Wallet className="w-8 h-8 mr-3" />
              <div>
                <h3 className="text-xl font-semibold">Personal Loan</h3>
                <p className="text-emerald-100 text-sm">Quick & Easy</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-3xl font-bold mb-2">Up to ₹50,000</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center text-sm">
                <Shield className="w-4 h-4 mr-2" />
                <span>No collateral</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2" />
                <span>30-45 mins</span>
              </div>
              <div className="flex items-center text-sm">
                <Zap className="w-4 h-4 mr-2" />
                <span>Instant</span>
              </div>
              <div className="flex items-center text-sm">
                <FileText className="w-4 h-4 mr-2" />
                <span>Paperless</span>
              </div>
            </div>
            
            <Link href="/loan-registration">
              <button className="w-full bg-white text-emerald-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors">
                Apply Now
              </button>
            </Link>
          </div>

          {/* Referral Card - Simple */}
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>
            
            <div className="flex items-center mb-4">
              <Gift className="w-8 h-8 mr-3" />
              <div>
                <h3 className="text-xl font-semibold">Earn ₹100</h3>
                <p className="text-cyan-100 text-sm">Instant Reward</p>
              </div>
            </div>
            
            <p className="text-cyan-100 mb-6 text-sm">
              Refer a friend and get rewarded instantly
            </p>
            
            <button className="w-full bg-white text-cyan-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center">
              <Users className="w-4 h-4 mr-2" />
              Refer Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicProfile;