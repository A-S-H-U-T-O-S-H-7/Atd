import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import FileUploadSection from './FileUploadSection';

const UploadDocumentsModal = ({ isOpen, onClose, userId }) => {
  const [documents, setDocuments] = useState({});
  const [documentIds, setDocumentIds] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (Object.keys(documents).length === 0) {
      alert('Please upload at least one document');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here you can call your backend API to save documents
      console.log('Documents to save:', documents);
      console.log('Document IDs:', documentIds);
      
      // Show success message
      alert('Documents uploaded successfully!');
      
      // Close modal after successful upload
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save documents. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadedCount = Object.keys(documents).length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 py-2 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[70vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Upload Documents</h2>
                <p className="text-blue-100 text-sm mt-1">Upload your salary slips and bank statement</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Progress Indicator */}
          {uploadedCount > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-white/90">Upload Progress</span>
                <span className="text-xs font-bold text-white">{uploadedCount}/4</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5">
                <div 
                  className="bg-white h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(uploadedCount / 4) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-2 px-3">
          <FileUploadSection
            userId={userId}
            onDocumentsUpdate={setDocuments}
            onDocumentIdsUpdate={setDocumentIds}
            disabled={isSubmitting}
          />
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentsModal;