import React from 'react';
import { formatAmount } from '@/components/utils/formatutils';

const FinancialSummary = ({ values, availableIncome }) => {
  if (!values.netMonthlySalary) return null;

  return (
    <div className="bg-gradient-to-r from-teal-50/80 to-emerald-50/80 backdrop-blur-sm border border-teal-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Financial Summary
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Net Salary</p>
          <p className="text-xl font-bold text-teal-600">
            ₹{formatAmount(values.netMonthlySalary)}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">Existing EMI</p>
          <p className="text-xl font-bold text-red-600">
            ₹{formatAmount(values.existingEmi || "0")}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">Available Income</p>
          <p className="text-xl font-bold text-emerald-600">
            ₹{formatAmount(availableIncome.toString())}
          </p>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Recommended EMI Limit:{" "}
          <span className="font-semibold text-teal-600">
            ₹{formatAmount((availableIncome * 0.6).toFixed(0))}
          </span>
          <span className="text-xs ml-1">
            (60% of available income)
          </span>
        </p>
      </div>
    </div>
  );
};

export default FinancialSummary;