import React from 'react';
import { AlertCircle } from 'lucide-react';

const ImportantGuidelines = () => (
  <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-2xl p-6">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <AlertCircle className="w-6 h-6 text-amber-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-amber-800 mb-2">
          Important Guidelines
        </h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Please ensure all contact information is accurate and up-to-date</li>
          <li>• References should be people who know you personally or professionally</li>
          <li>• Each phone number and email must be unique across all references</li>
          <li>• We may contact these references during the verification process</li>
        </ul>
      </div>
    </div>
  </div>
);

export default ImportantGuidelines;