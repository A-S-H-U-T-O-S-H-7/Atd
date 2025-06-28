"use client";
import React from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const ProfitLossSummary = ({ data, isDark }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const isProfit = data.profitLoss > 0;

  return (
    <div className={`p-8 rounded-2xl border-2 ${
      isDark 
        ? "bg-gray-800/50 border-emerald-600/30 shadow-xl shadow-black/20" 
        : "bg-white border-emerald-200 shadow-lg"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${
          isDark ? "text-white" : "text-gray-800"
        }`}>
          Profit & Loss Summary
        </h2>
        <div className={`p-3 rounded-xl ${
          isProfit 
            ? (isDark ? "bg-green-900/30" : "bg-green-50")
            : (isDark ? "bg-red-900/30" : "bg-red-50")
        }`}>
          {isProfit ? (
            <TrendingUp className={`w-8 h-8 ${
              isDark ? "text-green-400" : "text-green-600"
            }`} />
          ) : (
            <TrendingDown className={`w-8 h-8 ${
              isDark ? "text-red-400" : "text-red-600"
            }`} />
          )}
        </div>
      </div>

      {/* Income Section */}
      <div className="mb-8">
        <h3 className={`text-lg font-semibold mb-4 flex items-center ${
          isDark ? "text-green-400" : "text-green-600"
        }`}>
          <DollarSign className="w-5 h-5 mr-2" />
          Income Breakdown
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Process Fee Card */}
          <div className={`p-5 rounded-xl border-2 ${
            isDark ? "bg-blue-900/20 border-blue-600/30" : "bg-blue-50 border-blue-200"
          }`}>
            <h4 className={`text-lg font-semibold mb-3 ${
              isDark ? "text-blue-400" : "text-blue-600"
            }`}>
              Process Fee
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Actual PF:
                </span>
                <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {formatCurrency(data.processFee.actual)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Total PF:
                </span>
                <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {formatCurrency(data.processFee.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  GST:
                </span>
                <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {formatCurrency(data.processFee.gst)}
                </span>
              </div>
            </div>
          </div>

          {/* Penalty Card */}
          <div className={`p-5 rounded-xl border-2 ${
            isDark ? "bg-orange-900/20 border-orange-600/30" : "bg-orange-50 border-orange-200"
          }`}>
            <h4 className={`text-lg font-semibold mb-3 ${
              isDark ? "text-orange-400" : "text-orange-600"
            }`}>
              Penalty
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Actual Penalty:
                </span>
                <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {formatCurrency(data.penalty.actual)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Total Penalty:
                </span>
                <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {formatCurrency(data.penalty.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  GST:
                </span>
                <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {formatCurrency(data.penalty.gst)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Other Income Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl ${
            isDark ? "bg-green-900/20" : "bg-green-50"
          }`}>
            <p className={`text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>
              Interest
            </p>
            <p className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              {formatCurrency(data.interest)}
            </p>
          </div>
          
          <div className={`p-4 rounded-xl ${
            isDark ? "bg-green-900/20" : "bg-green-50"
          }`}>
            <p className={`text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>
              Penal Interest
            </p>
            <p className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              {formatCurrency(data.penalInterest)}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Totals */}
      <div className={`border-t-2 pt-6 ${
        isDark ? "border-gray-700" : "border-gray-200"
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`text-center p-4 rounded-xl ${
            isDark ? "bg-blue-900/20" : "bg-blue-50"
          }`}>
            <p className={`text-sm font-medium mb-2 ${
              isDark ? "text-blue-400" : "text-blue-600"
            }`}>
              Total Income
            </p>
            <p className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              {formatCurrency(data.totalIncome)}
            </p>
          </div>

          <div className={`text-center p-4 rounded-xl ${
            isDark ? "bg-red-900/20" : "bg-red-50"
          }`}>
            <p className={`text-sm font-medium mb-2 ${
              isDark ? "text-red-400" : "text-red-600"
            }`}>
              Total Expenses
            </p>
            <p className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              {formatCurrency(data.totalExpenses)}
            </p>
          </div>

          <div className={`text-center p-4 rounded-xl ${
            isProfit 
              ? (isDark ? "bg-green-900/20" : "bg-green-50")
              : (isDark ? "bg-red-900/20" : "bg-red-50")
          }`}>
            <p className={`text-sm font-medium mb-2 ${
              isProfit 
                ? (isDark ? "text-green-400" : "text-green-600")
                : (isDark ? "text-red-400" : "text-red-600")
            }`}>
              {isProfit ? "Net Profit" : "Net Loss"}
            </p>
            <p className={`text-3xl font-bold ${
              isProfit 
                ? (isDark ? "text-green-400" : "text-green-600")
                : (isDark ? "text-red-400" : "text-red-600")
            }`}>
              {formatCurrency(Math.abs(data.profitLoss))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossSummary;