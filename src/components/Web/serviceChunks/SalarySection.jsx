import React from 'react';
import { DollarSign } from 'lucide-react';
import { Field, ErrorMessage } from 'formik';
import SectionCard from './SectionCard';
import CurrencyField from './CurrencyField';
import FinancialSummary from './FinancialSummary';

const SalarySection = ({ values, availableIncome }) => {
  return (
    <SectionCard icon={DollarSign} title="Salary Details">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrencyField
            name="monthlySalary"
            label="Monthly Salary (₹)"
            placeholder="Enter gross monthly salary"
            helpText="Gross salary before deductions"
            required
          />

          <CurrencyField
            name="netMonthlySalary"
            label="Net Monthly Salary (₹)"
            placeholder="Enter net monthly salary"
            helpText="Salary after all deductions"
            required
          />
        </div>

        <CurrencyField
          name="existingEmi"
          label="Existing EMI (₹)"
          placeholder="Enter existing EMI amount (0 if none)"
          helpText="Total monthly EMI for all existing loans"
          required
        />

        <CurrencyField
          name="familyIncome"
          label="Family Income (₹)"
          placeholder="Enter total family income"
          helpText="Total monthly income of all family members"
          required
        />

        <FinancialSummary 
          values={values} 
          availableIncome={availableIncome} 
        />
      </div>
    </SectionCard>
  );
};

export default SalarySection;