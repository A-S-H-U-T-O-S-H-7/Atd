'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { exportToExcel } from '@/components/utils/exportutil';

// You need to import or define these in your main component or pass as props
const categories = [
  { value: '', label: '--Select Category--' },
  { value: 'in_process', label: 'In Process Enquiries' },
  { value: 'followup', label: 'FollowUp Enquiries' },
  { value: 'completed', label: 'Completed Enquiries' },
  { value: 'pending', label: 'Pending Enquiries' },
  { value: 'rejected', label: 'Rejected Enquiries' },
  { value: 'closed', label: 'Closed Enquiries' },
  { value: 'refer_friends', label: 'Refer Friends' }
];

const mockMobileNumbers = {
  in_process: ['9876543210', '9876543211', '9876543212'],
  followup: ['9876543213', '9876543214', '9876543215'],
  completed: ['9876543216', '9876543217', '9876543218'],
  pending: ['9876543219', '9876543220', '9876543221'],
  rejected: ['9876543222', '9876543223', '9876543224'],
  closed: ['9876543225', '9876543226', '9876543227'],
  refer_friends: ['9876543228', '9876543229', '9876543230']
};

const ExportMobileCard = ({ isDark }) => {
  const [exportCategory, setExportCategory] = useState('');

  const handleExport = () => {
    if (!exportCategory) {
      alert('Please select a category to export');
      return;
    }
    
    // Get mobile numbers for selected category
    const mobileNumbers = mockMobileNumbers[exportCategory] || [];
    
    if (mobileNumbers.length === 0) {
      alert('No mobile numbers found for this category');
      return;
    }

    // Prepare data for export
    const exportData = [
      ['Mobile Number'], // Header
      ...mobileNumbers.map(number => [number]) // Data rows
    ];

    // Generate filename
    const categoryLabel = categories.find(cat => cat.value === exportCategory)?.label || exportCategory;
    const filename = `${categoryLabel.replace(/\s+/g, '_')}_mobile_numbers.csv`;

    // Export to Excel/CSV
    exportToExcel(exportData, filename);
    
    console.log('Exported mobile numbers for category:', exportCategory);
  };

  return (
    <div
      className={`rounded-2xl shadow-lg border-2 overflow-hidden h-fit ${
        isDark
          ? 'bg-gray-800 border-emerald-600/50 shadow-emerald-900/20'
          : 'bg-white border-emerald-300 shadow-emerald-500/10'
      }`}
    >
      <div
        className={`px-6 py-3 border-b-2 ${
          isDark
            ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-emerald-600/50'
            : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg ${
              isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'
            }`}
          >
            <Download
              className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}
            />
          </div>
          <h2
            className={`text-lg font-bold ${
              isDark ? 'text-gray-100' : 'text-gray-700'
            }`}
          >
            Export Mobile No
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label
            className={`block text-sm font-semibold mb-2 ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            Select Category :
          </label>
          <select
            value={exportCategory}
            onChange={(e) => setExportCategory(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
              isDark
                ? 'bg-gray-700 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400'
                : 'bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500'
            } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleExport}
          className={`w-full cursor-pointer py-3 px-6 rounded-xl font-bold text-white transition-all duration-200  hover:shadow-lg flex items-center justify-center space-x-2 ${
            isDark
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
          }`}
        >
          <Download className="w-5 h-5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default ExportMobileCard;