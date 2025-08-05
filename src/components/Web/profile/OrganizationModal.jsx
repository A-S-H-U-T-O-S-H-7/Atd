import React from 'react';
import { Building2, X, Briefcase, Phone, Mail, User, Users, DollarSign, IndianRupee } from 'lucide-react';

const OrganizationModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed mt-20 inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Organization Details</h2>
                <p className="text-purple-100 text-xs">Professional information</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Information */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-800 border-b pb-2 flex items-center">
                  <Briefcase className="w-4 h-4 text-purple-500 mr-2" />
                  Company Information
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Company Name', value: user?.organisation_name },
                    { label: 'Designation', value: user?.designation },
                    { label: 'Company Address', value: user?.organisation_address },
                    { label: 'Website', value: user?.website },
                    { label: 'Working Since', value: `${user?.work_since_mm || ''}/${user?.work_since_yy || ''}` }
                  ].map((item, index) => (
                    <div key={index} className="p-2.5 bg-purple-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                      <p className="font-medium text-sm text-gray-800">{item.value || 'Not provided'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact & HR Details */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-800 border-b pb-2 flex items-center">
                  <Phone className="w-4 h-4 text-purple-500 mr-2" />
                  Contact Details
                </h3>
                <div className="space-y-2">
                  {[
                    { icon: Phone, label: 'Office Phone', value: user?.office_phone },
                    { icon: Mail, label: 'Official Email', value: user?.official_email }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2.5 bg-purple-50 rounded-lg">
                      <item.icon className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                        <p className="font-medium text-sm text-gray-800">{item.value || 'Not provided'}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-base font-semibold text-gray-800 border-b pb-2 mt-4 flex items-center">
                  <Users className="w-4 h-4 text-purple-500 mr-2" />
                  HR Details
                </h3>
                <div className="space-y-2">
                  {[
                    { icon: User, label: 'HR Name', value: user?.contact_person },
                    { icon: Phone, label: 'HR Phone', value: user?.mobile_no },
                    { icon: Mail, label: 'HR Email', value: user?.hr_mail }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2.5 bg-purple-50 rounded-lg">
                      <item.icon className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                        <p className="font-medium text-sm text-gray-800">{item.value || 'Not provided'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Salary Information */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100">
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                <IndianRupee className="w-4 h-4 text-purple-500 mr-2" />
                Salary Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { label: 'Monthly Salary', value: user?.gross_monthly_salary },
                  { label: 'Net Salary', value: user?.net_monthly_salary},
                  { label: 'Family Income', value: user?.net_house_hold_income }
                ].map((item, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className="font-bold text-lg text-purple-600">₹{Number(item.value || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Existing EMI</p>
                <p className="font-medium text-sm text-gray-800">₹{user?.existing_emi || 'No existing EMI'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationModal;