import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  iconColor = "text-emerald-600",
  bgColor = "bg-white",
  isDark,
  subtitle = null
}) => {
  return (
    <div className={`rounded-2xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
      isDark 
        ? "bg-gray-800 border border-gray-700" 
        : `${bgColor} border border-gray-200`
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {title}
          </p>
          
          {/* Handle both string/number and React element values */}
          {typeof value === 'string' || typeof value === 'number' ? (
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {typeof value === 'string' && value.includes('₹') ? value : value.toLocaleString()}
              </h3>
              {subtitle && (
                <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {subtitle}
                </span>
              )}
            </div>
          ) : (
            // If value is a React element, render it directly
            <div className="mt-2">
              {value}
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl ${isDark ? "bg-gray-700" : "bg-white shadow-sm"} ml-4`}>
          <Icon className={`w-6 h-6 ${isDark ? "text-emerald-400" : iconColor}`} />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center mt-4">
          <span className={`text-sm font-medium flex items-center ${
            trend === "up" 
              ? isDark ? "text-green-400" : "text-green-600"
              : isDark ? "text-red-400" : "text-red-600"
          }`}>
            {trend === "up" ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            {trendValue}
          </span>
          <span className={`text-sm ml-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            from last period
          </span>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;