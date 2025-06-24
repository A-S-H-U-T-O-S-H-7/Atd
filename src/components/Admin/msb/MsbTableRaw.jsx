import { Calendar, MapPin } from "lucide-react";


const AccountTableRow = ({ account, index, startIndex, isDark, onCreateAccount }) => {
    return (
      <tr
        className={`transition-all duration-200 ${
          isDark
            ? "hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-emerald-900/20"
            : "hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50"
        }`}
      >
        <td className="px-6 py-5">
          <span className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {startIndex + index + 1}
          </span>
        </td>
        
        <td className="px-6 py-5">
          <button
            onClick={() => onCreateAccount(account)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white"
                : "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white"
            } shadow-lg hover:shadow-xl`}
          >
            Create MSB Account
          </button>
        </td>
  
        <td className="px-6 py-5">
          <div className={`flex items-center space-x-2 text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
        
            <span>{account.enquirySource}</span>
          </div>
        </td>
  
        <td className="px-6 py-5">
          <span className={`px-3 py-1 text-sm font-bold rounded-md border-2 ${
            account.crnNo
              ? isDark
                ? "bg-gradient-to-r from-blue-900/50 to-indigo-900/50 text-blue-300 border-blue-600/50"
                : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-300"
              : isDark
                ? "bg-gray-700 text-gray-400 border-gray-600"
                : "bg-gray-100 text-gray-500 border-gray-300"
          }`}>
            {account.crnNo || "-"}
          </span>
        </td>
  
        <td className="px-6 py-5">
          <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {account.accountId || "-"}
          </span>
        </td>
  
        <td className="px-6 py-5">
          <div className={`flex items-center space-x-2 text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            <div className={`p-1.5 rounded-lg ${isDark ? "bg-emerald-900/50" : "bg-emerald-100"}`}>
              <Calendar className={`w-3.5 h-3.5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
            </div>
            <span>{account.enquiryDate}</span>
          </div>
        </td>
  
        <td className="px-6 py-5">
          <div className={`flex items-center space-x-2 text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            
            <span>{account.enquiryTime}</span>
          </div>
        </td>
  
        <td className="px-6 py-5">
          <div className="flex items-center space-x-3">
            
            <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              {account.name}
            </span>
          </div>
        </td>
  
        <td className="px-6 py-5">
          <div className="max-w-xs">
            <div className={`flex items-start space-x-2 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <div className={`p-1.5 rounded-lg mt-0.5 ${isDark ? "bg-emerald-900/50" : "bg-emerald-100"}`}>
                <MapPin className={`w-3.5 h-3.5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              </div>
              <span className="break-words">{account.address || "-"}</span>
            </div>
          </div>
        </td>
  
        <td className="px-6 py-5">
          <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {account.state}
          </span>
        </td>
  
        <td className="px-6 py-5">
          <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {account.city}
          </span>
        </td>
  
        <td className="px-6 py-5">
          <div className={`flex items-center space-x-2 text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
            
            <span>{account.phoneNo}</span>
          </div>
        </td>
  
        <td className="px-6 py-5">
          <div className={`flex items-center space-x-2 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            
            <span className="break-all font-medium">{account.email}</span>
          </div>
        </td>
      </tr>
    );
  };
  
  export default AccountTableRow