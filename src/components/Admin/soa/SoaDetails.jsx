import React from "react";
import { 
  CreditCard, 
  Calendar, 
  User, 
  IndianRupee, 
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
import { getStatusName } from "@/utils/applicationStatus"; 

const SoaDetails = ({ data, isDark }) => {
  const DetailItem = ({ icon: Icon, label, value, isAmount = false, isStatus = false }) => (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Icon className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
        <span className={`text-xs font-medium ${isDark ? "text-gray-200" : "text-gray-600"}`}>
          {label}
        </span>
      </div>
      <div className={`px-3 py-2 rounded-lg border ${
        isDark 
          ? "bg-gray-700/50 border-gray-600 text-gray-100" 
          : "bg-gray-50 border-gray-200 text-gray-900"
      }`}>
        <span className={`text-sm font-semibold ${
          isAmount && isDark ? "text-emerald-400" : 
          isAmount ? "text-emerald-600" : 
          isStatus && data.status === 13 ? "text-green-600" : 
          isStatus && data.status === 18 ? "text-blue-600" : 
          isStatus ? "text-amber-600" : "" 
        }`}>
          {value || "N/A"}
        </span>
      </div>
    </div>
  );

  // Get status name from status ID
  const statusName = getStatusName(data.status);

  return (
    <div className={`rounded-2xl shadow-lg border-2 p-6 mb-6 ${
      isDark
        ? "bg-gray-800 border-emerald-600/50 shadow-emerald-900/20"
        : "bg-white border-emerald-300 shadow-emerald-500/10"
    }`}>
      <div className={`mb-6 pb-4 border-b-2 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <h2 className={`text-2xl font-bold flex items-center space-x-2 ${
          isDark ? "text-emerald-400" : "text-emerald-600"
        }`}>
          <FileText className="w-6 h-6" />
          <span>Loan Details</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-6 gap-6">
        {/* Application ID */}
        <DetailItem
          icon={Hash}
          label="Application ID"
          value={data.application_id}
        />
        
        {/* Status */}
        <DetailItem
          icon={ShieldCheck}
          label="Status"
          value={statusName}
          isStatus={true}
        />
        
        {/* Loan No */}
        <DetailItem
          icon={CreditCard}
          label="Loan No"
          value={data.loan_no}
        />
        
        {/* CRN No */}
        <DetailItem
          icon={Tag}
          label="CRN No"
          value={data.crnno}
        />
        
        {/* Full Name */}
        <DetailItem
          icon={User}
          label="Customer Name"
          value={data.fullname}
        />
        
        {/* Tenure */}
        <DetailItem
          icon={Clock}
          label="Tenure"
          value={data.tenure ? `${data.tenure} Days` : "N/A"}
        />
        
        {/* ROI */}
        <DetailItem
          icon={Percent}
          label="Rate of Interest"
          value={data.roi}
        />
        
        {/* Sanction Date */}
        <DetailItem
          icon={Calendar}
          label="Sanction Date"
          value={data.sanction_date}
        />
        
        {/* Sanction Amount */}
        <DetailItem
          icon={IndianRupee}
          label="Sanction Amount"
          value={data.sanction_amount ? `₹${data.sanction_amount}` : ""}
          isAmount={true}
        />
        
        {/* Process Percent */}
        <DetailItem
          icon={Percent}
          label="Processing Fee"
          value={data.process_percent}
        />
        
        {/* Process Fee */}
        <DetailItem
          icon={Receipt}
          label="Processing Fee"
          value={data.process_fee ? `₹${data.process_fee}` : ""}
          isAmount={true}
        />
        
        {/* GST */}
        <DetailItem
          icon={Calculator}
          label="GST"
          value={data.gst ? `₹${data.gst}` : ""}
          isAmount={true}
        />
        
        {/* Disburse Date */}
        <DetailItem
          icon={Calendar}
          label="Disbursement Date"
          value={data.disburse_date}
        />
        
        {/* Transaction Date */}
        <DetailItem
          icon={CalendarCheck}
          label="Transaction Date"
          value={data.transaction_date}
        />
        
        {/* Due Date */}
        <DetailItem
          icon={CalendarCheck}
          label="Due Date"
          value={data.due_date}
        />
        
        {/* Disburse Amount */}
        <DetailItem
          icon={IndianRupee}
          label="Disbursed Amount"
          value={data.disburse_amount ? `₹${data.disburse_amount}` : ""}
          isAmount={true}
        />
        
        {/* Ledger Balance */}
        <DetailItem
          icon={IndianRupee}
          label="Ledger Balance"
          value={data.ledger_balance ? `₹${data.ledger_balance}` : ""}
          isAmount={true}
        />
        
        {/* Closed Date */}
        <DetailItem
          icon={FileText}
          label="Closed Date"
          value={data.closed_date}
        />
      </div>
    </div>
  );
};

export default SoaDetails;