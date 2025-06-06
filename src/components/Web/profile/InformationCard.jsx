import { User, Calendar, FileText, CreditCard, Hash } from 'lucide-react';

const InfoItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-100 hover:shadow-md transition-all duration-200">
    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200 shadow-sm">
      <Icon className="w-5 h-5 text-slate-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-600 mb-1">{label}</p>
      <p className="text-slate-800 font-medium break-words">{value || 'Not provided'}</p>
    </div>
  </div>
);

export default function InformationCards({ user }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-10 md:mt-0 md:gap-6">
      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-md border-2 border-dashed border-blue-400 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <InfoItem label="Full Name" value={`${user.fname} ${user.lname}`} icon={User} />
            <InfoItem label="Date of Birth" value={user.dob} icon={Calendar} />
            <InfoItem label="Gender" value={user.gender} icon={User} />
            <InfoItem label="Father's Name" value={user.fathername} icon={User} />
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white rounded-2xl shadow-md border-2 border-dashed border-green-300 overflow-hidden">
        <div className="bg-gradient-to-r from-green-100 to-green-200 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Account Details</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <InfoItem label="CRN Number" value={user.crnno || 'Not provided'} icon={Hash} />
            <InfoItem label="Account Number" value={user.accountId || 'Not provided'} icon={CreditCard} />
            <InfoItem label="Aadhar Number" value={user.aadhar_no || 'Not provided'} icon={CreditCard} />
            <InfoItem label="PAN Number" value={user.pan_no || 'Not provided'} icon={FileText} />
          </div>
        </div>
      </div>
    </div>
  );
}