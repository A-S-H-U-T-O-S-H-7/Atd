import React from "react";
import { CreditCard, Calendar, User, DollarSign, Percent, Clock } from "lucide-react";

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
          Details
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <DetailItem
          icon={CreditCard}
          label="CRN No :"
          value={data.crnNo}
        />
        <DetailItem
          icon={User}
          label="Name :"
          value={data.name}
        />
        <DetailItem
          icon={DollarSign}
          label="Sanctioned Amt :"
          value={data.sanctionedAmt ? `₹${parseInt(data.sanctionedAmt).toLocaleString()}` : ""}
        />
        <DetailItem
          icon={Calendar}
          label="Sanctioned Date :"
          value={data.sanctionedDate}
        />
        <DetailItem
          icon={DollarSign}
          label="Disburse Amt :"
          value={data.disburseAmt ? `₹${parseInt(data.disburseAmt).toLocaleString()}` : ""}
        />
        <DetailItem
          icon={Calendar}
          label="Disburse Date :"
          value={data.disburseDate}
        />
        <DetailItem
          icon={Percent}
          label="ROI :"
          value={data.roi ? `${data.roi}%` : ""}
        />
        <DetailItem
          icon={Clock}
          label="Tenure :"
          value={data.tenure ? `${data.tenure} Days` : ""}
        />
        <DetailItem
          icon={CreditCard}
          label="Loan No :"
          value={data.loanNo}
        />
        <DetailItem
          icon={DollarSign}
          label="Ledger O/S Amt :"
          value={data.ledgerOsAmt ? `₹${parseInt(data.ledgerOsAmt).toLocaleString()}` : ""}
        />
      </div>
    </div>
  );
};

export default SoaDetails;