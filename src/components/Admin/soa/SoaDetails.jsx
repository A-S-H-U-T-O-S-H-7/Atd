import React from "react";
import { 
  CreditCard, 
  Calendar, 
  User, 
  DollarSign, 
  Percent, 
  Clock,
  Hash,
  FileText,
  Tag,
  Receipt,
  ShieldCheck,
  CalendarCheck,
  Calculator
} from "lucide-react";

const SoaDetails = ({ data, isDark }) => {
  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-2">
        <Icon className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
        <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {label}
        </span>
      </div>
      <span className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
        {value || "N/A"}
      </span>
    </div>
  );

  return (
    <div className={`rounded-2xl shadow-lg border-2 p-6 mb-6 ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-blue-900/20"
        : "bg-white border-emerald-300 shadow-blue-500/10"
    }`}>
      <div className={`mb-4 pb-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <h2 className={`text-xl font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
          Loan Details
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Application ID */}
        <DetailItem
          icon={Hash}
          label="Application ID :"
          value={data.application_id}
        />
        
        {/* Status */}
        <DetailItem
          icon={ShieldCheck}
          label="Status :"
          value={data.status}
        />
        
        {/* Loan No */}
        <DetailItem
          icon={CreditCard}
          label="Loan No :"
          value={data.loan_no}
        />
        
        {/* CRN No */}
        <DetailItem
          icon={Tag}
          label="CRN No :"
          value={data.crnno}
        />
        
        {/* Full Name */}
        <DetailItem
          icon={User}
          label="Full Name :"
          value={data.fullname}
        />
        
        {/* Tenure */}
        <DetailItem
          icon={Clock}
          label="Tenure :"
          value={data.tenure ? `${data.tenure} Days` : "N/A"}
        />
        
        {/* ROI */}
        <DetailItem
          icon={Percent}
          label="ROI :"
          value={data.roi}
        />
        
        {/* Sanction Date */}
        <DetailItem
          icon={Calendar}
          label="Sanction Date :"
          value={data.sanction_date}
        />
        
        {/* Sanction Amount */}
        <DetailItem
          icon={DollarSign}
          label="Sanction Amount :"
          value={data.sanction_amount ? `₹${data.sanction_amount}` : ""}
        />
        
        {/* Process Percent */}
        <DetailItem
          icon={Percent}
          label="Process Percent :"
          value={data.process_percent}
        />
        
        {/* Process Fee */}
        <DetailItem
          icon={Receipt}
          label="Process Fee :"
          value={data.process_fee ? `₹${data.process_fee}` : ""}
        />
        
        {/* GST */}
        <DetailItem
          icon={Calculator}
          label="GST :"
          value={data.gst ? `₹${data.gst}` : ""}
        />
        
        {/* Disburse Date */}
        <DetailItem
          icon={Calendar}
          label="Disburse Date :"
          value={data.disburse_date}
        />
        
        {/* Transaction Date */}
        <DetailItem
          icon={CalendarCheck}
          label="Transaction Date :"
          value={data.transaction_date}
        />
        
        {/* Due Date */}
        <DetailItem
          icon={CalendarCheck}
          label="Due Date :"
          value={data.due_date}
        />
        
        {/* Disburse Amount */}
        <DetailItem
          icon={DollarSign}
          label="Disburse Amount :"
          value={data.disburse_amount ? `₹${data.disburse_amount}` : ""}
        />
        
        {/* Ledger Balance */}
        <DetailItem
          icon={DollarSign}
          label="Ledger Balance :"
          value={data.ledger_balance ? `₹${data.ledger_balance}` : ""}
        />
        
        {/* Closed Date */}
        <DetailItem
          icon={FileText}
          label="Closed Date :"
          value={data.closed_date}
        />
      </div>
    </div>
  );
};

export default SoaDetails;