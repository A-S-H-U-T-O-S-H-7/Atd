import React from 'react';
import { User, X, Calendar, Phone, Mail, MapPin, Users } from 'lucide-react';

const PersonalDetailsModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
<div className="fixed inset-0 mt-20 bg-black/20 backdrop-blur-md flex items-center justify-center z-[9999] p-4" style={{zIndex: 10000}}>
     <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Personal Details</h2>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-800 border-b pb-2 flex items-center">
                  <User className="w-4 h-4 text-blue-500 mr-2" />
                  Basic Information
                </h3>
                <div className="space-y-2">
                  {[
                    { icon: User, label: 'Full Name', value: `${user?.fname || ''} ${user?.lname || ''}` },
                    { icon: Calendar, label: 'Date of Birth', value: user?.dob },
                    { icon: User, label: 'Gender', value: user?.gender },
                    { icon: User, label: "Father's Name", value: user?.fathername },
                    { icon: User, label: "Aadhar No.", value: user?.aadhar_no }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2.5 bg-blue-50 rounded-lg">
                      <item.icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                        <p className="font-medium text-sm text-gray-800">{item.value || 'Not provided'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-800 border-b pb-2 flex items-center">
                  <Phone className="w-4 h-4 text-blue-500 mr-2" />
                  Contact Information
                </h3>
                <div className="space-y-2">
                  {[
                    { icon: Mail, label: 'Email', value: user?.email },
                    { icon: Mail, label: 'Alternative Email', value: user?.alt_email },
                    { icon: Phone, label: 'Phone Number', value: user?.mobile || user?.phone },
                    { icon: User, label: "Pan No.", value: user?.pan_no }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2.5 bg-blue-50 rounded-lg">
                      <item.icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                        <p className="font-medium text-sm text-gray-800">{item.value || 'Not provided'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 text-blue-500 mr-2" />
                  Current Address
                </h3>
                <div className="space-y-1.5">
                  <p className="text-xs"><span className="font-medium text-gray-600">House No:</span> <span className="text-gray-800">{user?.current_house_no || 'Not provided'}</span></p>
                  <p className="text-xs"><span className="font-medium text-gray-600">Street:</span> <span className="text-gray-800">{user?.current_address || 'Not provided'}</span></p>
                  <p className="text-xs"><span className="font-medium text-gray-600">City:</span> <span className="text-gray-800">{user?.current_city || 'Not provided'}</span></p>
                  <p className="text-xs"><span className="font-medium text-gray-600">State:</span> <span className="text-gray-800">{user?.current_state || 'Not provided'}</span></p>
                  <p className="text-xs"><span className="font-medium text-gray-600">Pincode:</span> <span className="text-gray-800">{user?.current_pincode || 'Not provided'}</span></p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 text-indigo-500 mr-2" />
                  Permanent Address
                </h3>
                <div className="space-y-1.5">
                  <p className="text-xs"><span className="font-medium text-gray-600">House No:</span>
                   <span className="text-gray-800">{user?.house_no || 'Not provided'}</span></p>

                  <p className="text-xs"><span className="font-medium text-gray-600">Street:</span>
                   <span className="text-gray-800">{user?.address || 'Not provided'}</span></p>

                  <p className="text-xs"><span className="font-medium text-gray-600">City:</span>
                   <span className="text-gray-800">{user?.city || 'Not provided'}</span></p>

                  <p className="text-xs"><span className="font-medium text-gray-600">State:</span>
                   <span className="text-gray-800">{user?.state || 'Not provided'}</span></p>

                  <p className="text-xs"><span className="font-medium text-gray-600">Pincode:</span>
                   <span className="text-gray-800">{user?.pincode || 'Not provided'}</span></p>
                </div>
              </div>
            </div>

            {/* Family Reference */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                <Users className="w-4 h-4 text-blue-500 mr-2" />
                Family Reference
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <p className="text-xs"><span className="font-medium text-gray-600">Name:</span> <span className="text-gray-800">{user?.ref_name || 'Not provided'}</span></p>
                  <p className="text-xs"><span className="font-medium text-gray-600">Relation:</span> <span className="text-gray-800">{user?.ref_relation || 'Not provided'}</span></p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs"><span className="font-medium text-gray-600">Mobile:</span> <span className="text-gray-800">{user?.ref_mobile || 'Not provided'}</span></p>
                  <p className="text-xs"><span className="font-medium text-gray-600">Email:</span> <span className="text-gray-800">{user?.ref_email || 'Not provided'}</span></p>
                </div>
              </div>
              <p className="text-xs mt-2"><span className="font-medium text-gray-600">Address:</span> <span className="text-gray-800">{user?.ref_address || 'Not provided'}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsModal;