import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const ChartCard = ({
  title,
  data,
  icon: Icon,
  chartColor = "#10b981",
  isDark,
  formatValue = (val) => val,
  type = "bar",
  showDate = true,
  isMonthly = false,
  showCount = false,
  count = 0,
  countLabel = "Applications"
}) => {
  const calculateTrend = () => {
    if (data.length < 2) return { direction: "neutral", value: "0%" };
    
    if (isMonthly && data.length < 2) {
      return { direction: "neutral", value: "0%" };
    }
    
    const lastValue = data[data.length - 1]?.total || 0;
    const prevValue = data[data.length - 2]?.total || 0;
    
    if (prevValue === 0) return { direction: "up", value: "100%" };
    
    const change = lastValue - prevValue;
    const percentage = (change / prevValue) * 100;
    
    return {
      direction: change >= 0 ? "up" : "down",
      value: `${Math.abs(percentage.toFixed(1))}%`,
    };
  };

  const trend = calculateTrend();
  const total = data.reduce((sum, item) => sum + (item.total || 0), 0);
  const maxValue = Math.max(...data.map(d => d.total || 0), 1);

  return (
    <div className={`rounded-2xl p-6 ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"} shadow-xl`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <p className={`text-xl font-bold mt-1 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
              Total: {formatValue(total)}
            </p>
            {showCount && count > 0 && (
              <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                ({count} {countLabel})
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
            <Icon className="w-5 h-5 text-emerald-600" />
          </div>
          
        </div>
      </div>

      <div className="space-y-4">
        {type === "bar" && (
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {data.slice(-7).map((item, index) => {
              const barHeight = maxValue > 0 ? ((item.total || 0) / maxValue) * 100 : 0;
              
              return (
                <div key={index} className="flex flex-col items-center flex-1 group">
                  <div className="relative w-full flex flex-col items-center justify-end h-40">
                    <div 
                      className="relative w-full rounded-t-lg transition-all duration-300 hover:opacity-90 cursor-pointer"
                      style={{ 
                        height: `${Math.max(10, barHeight)}%`,
                        backgroundColor: chartColor,
                        opacity: 0.8
                      }}
                    >
                      <div className={`absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isDark ? "bg-gray-700" : "bg-gray-900"} px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap z-10 min-w-[120px] text-center shadow-lg`}>
                        <div className={`font-semibold ${isDark ? "text-white" : "text-white"}`}>
                          Amount: {formatValue(item.total || 0)}
                        </div>
                        {item.count !== undefined && item.count > 0 && (
                          <div className={`mt-1 ${isDark ? "text-gray-300" : "text-gray-300"}`}>
                            Count: {item.count} {countLabel}
                          </div>
                        )}
                        <div className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-400"}`}>
                          {isMonthly 
                            ? `Month ${item.month || 'N/A'}` 
                            : item.date 
                              ? new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                              : `Day ${index + 1}`
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-[10px] font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {isMonthly 
                        ? item.month || `Month ${index + 1}`
                        : item.date 
                          ? new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                          : `Day ${index + 1}`
                      }
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {type === "list" && (
          <div className="space-y-3">
            {data.slice(0, 5).map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    }`}>
                      <span className={`text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                        {item.state || item.date?.split('-').pop() || item.month}
                      </p>
                      {showDate && item.date && (
                        <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className={`font-bold text-lg ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                    {item.total}
                  </p>
                  <div 
                    className="mt-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
                    style={{ width: '80px' }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${maxValue > 0 ? (item.total / maxValue) * 100 : 0}%`,
                        backgroundColor: chartColor
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartCard;