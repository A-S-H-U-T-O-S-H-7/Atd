import { Calendar, Phone, Mail, User } from "lucide-react";

const ReferFriendsTableRow = ({ referral, index, startIndex, isDark }) => {
  return (
    <tr
      className={`transition-all duration-200 ${
        isDark
          ? "hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-emerald-900/20"
          : "hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50"
      } ${
        index % 2 === 0 
          ? isDark 
            ? "bg-gray-700/80" 
            : "bg-gray-50"
          : ""
      }`}
    >
      <td className={`px-6 py-5 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          {startIndex + index + 1}
        </span>
      </td>

      <td className={`px-6 py-5 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className="flex items-center space-x-3">
          <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
            {referral.referBy}
          </span>
        </div>
      </td>

      <td className={`px-6 py-5 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {referral.referenceName}
        </span>
      </td>

      <td className={`px-6 py-5 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className={`flex items-center space-x-2 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-emerald-900/50" : "bg-emerald-100"}`}>
            <Mail className={`w-3.5 h-3.5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          </div>
          <span className="break-all font-medium">{referral.referenceEmail}</span>
        </div>
      </td>

      <td className={`px-6 py-5 border-r ${isDark ? "border-gray-600/80" : "border-gray-300/90"}`}>
        <div className={`flex items-center space-x-2 text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
          <span>{referral.referenceMobile}</span>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className={`flex items-center space-x-2 text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-emerald-900/50" : "bg-emerald-100"}`}>
            <Calendar className={`w-3.5 h-3.5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          </div>
          <span>{referral.date}</span>
        </div>
      </td>
    </tr>
  );
};

export default ReferFriendsTableRow;