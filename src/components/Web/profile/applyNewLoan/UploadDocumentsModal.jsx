import { useState } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, Clock, Zap, Sparkles, Building2, Receipt } from 'lucide-react';

const UploadDocumentsModal = ({ isOpen, onClose, userId }) => {
  const [uploadStatus, setUploadStatus] = useState({
    salarySlip1: { uploading: false, uploaded: false, error: null, filename: null },
    salarySlip2: { uploading: false, uploaded: false, error: null, filename: null },
    salarySlip3: { uploading: false, uploaded: false, error: null, filename: null },
    bankStatement: { uploading: false, uploaded: false, error: null, filename: null }
  });
  const [uploadQueue, setUploadQueue] = useState([]);
  const [compressingFiles, setCompressingFiles] = useState(new Set());

  const fileConfig = {
    salarySlip1: { label: 'Latest Slip', accept: 'image/*,application/pdf', maxSize: 3 },
    salarySlip2: { label: '2nd Month', accept: 'image/*,application/pdf', maxSize: 3 },
    salarySlip3: { label: '3rd Month', accept: 'image/*,application/pdf', maxSize: 3 },
    bankStatement: { label: 'Bank Statement', accept: 'application/pdf', maxSize: 5 }
  };

  if (!isOpen) return null;

  const handleFileChange = (file, fieldName) => {
    setUploadStatus(prev => ({
      ...prev,
      [fieldName]: { uploading: true, uploaded: false, error: null, filename: file.name }
    }));
    
    // Simulate upload
    setTimeout(() => {
      setUploadStatus(prev => ({
        ...prev,
        [fieldName]: { uploading: false, uploaded: true, error: null, filename: file.name }
      }));
    }, 2000);
  };

  const handleRemoveFile = (fieldName) => {
    setUploadStatus(prev => ({
      ...prev,
      [fieldName]: { uploading: false, uploaded: false, error: null, filename: null }
    }));
  };

  const FileUploadField = ({ fieldName, compact = false }) => {
    const config = fileConfig[fieldName];
    const status = uploadStatus[fieldName];
    const isCompressing = compressingFiles.has(fieldName);
    const isActive = status.uploaded || status.uploading || isCompressing;

    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-600 block">
          {config.label}
        </label>
        
        {!isActive ? (
          <div className="relative group">
            <input
              type="file"
              id={fieldName}
              accept={config.accept}
              onChange={(e) => e.target.files[0] && handleFileChange(e.target.files[0], fieldName)}
              className="hidden"
            />
            <label
              htmlFor={fieldName}
              className="flex items-center justify-center w-full h-11 bg-white border-2 border-dashed border-gray-200 rounded-xl text-xs cursor-pointer transition-all hover:border-indigo-400 hover:bg-indigo-50/50"
            >
              <Upload className="w-4 h-4 mr-2 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              <span className="text-gray-600 group-hover:text-indigo-600 font-medium">Choose File</span>
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full px-3 py-2.5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2.5 flex-1 min-w-0">
              {isCompressing ? (
                <Zap className="w-4 h-4 text-amber-500 animate-pulse flex-shrink-0" />
              ) : status.uploading ? (
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">
                  {status.uploaded ? 'Uploaded ✓' : isCompressing ? 'Compressing...' : 'Uploading...'}
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => handleRemoveFile(fieldName)}
              className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={status.uploading || isCompressing}
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        )}
        
        {status.error && (
          <p className="text-red-500 text-xs flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status.error}
          </p>
        )}
      </div>
    );
  };

  const uploadedCount = Object.values(uploadStatus).filter(s => s.uploaded).length;
  const totalFiles = 4;
  const progress = (uploadedCount / totalFiles) * 100;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[70vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header with Gradient */}
        <div className="relative bg-gradient-to-br from-blue-300 via-teal-400 to-emerald-500 px-6 py-6 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          
          <div className="relative flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Upload Documents</h2>
              </div>
              <p className="text-indigo-100 text-sm">
                Securely upload your salary slips and bank statement
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Progress Bar */}
          {uploadedCount > 0 && (
            <div className="mt-4 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-white/90">Upload Progress</span>
                <span className="text-xs font-bold text-white">{uploadedCount}/{totalFiles}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                <div 
                  className="bg-gradient-to-r from-white to-indigo-100 h-2 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          
          {/* Salary Slips Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl py-2 px-5 border border-blue-100 shadow-sm">
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg shadow-md">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800">Salary Slips</h3>
                <p className="text-xs text-gray-600">Last 3 months (Optional)</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FileUploadField fieldName="salarySlip1" />
              <FileUploadField fieldName="salarySlip2" />
              <FileUploadField fieldName="salarySlip3" />
            </div>
            
            <div className="mt-3 flex items-start space-x-2 bg-blue-100/50 rounded-lg p-2.5">
              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Images (JPG, PNG) or PDF • Max 3MB each
              </p>
            </div>
          </div>

          {/* Bank Statement Section */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl py-2 px-5 border border-emerald-100 shadow-sm">
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="p-2 bg-emerald-500 rounded-lg shadow-md">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800">Bank Statement</h3>
                <p className="text-xs text-gray-600">6 months statement (Optional)</p>
              </div>
            </div>
            
            <FileUploadField fieldName="bankStatement" />
            
            <div className="mt-3 flex items-start space-x-2 bg-emerald-100/50 rounded-lg p-2.5">
              <AlertCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-700">
                PDF format only • Max 5MB
              </p>
            </div>
          </div>

          {/* Success Message */}
          {uploadedCount === totalFiles && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">All documents uploaded!</p>
                  <p className="text-xs text-emerald-100">You're all set to proceed</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-2 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentsModal