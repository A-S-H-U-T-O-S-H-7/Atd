'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { ArrowLeft, Download, FileText, Maximize2, Minimize2, RotateCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic';


// Cache for already loaded URLs to prevent re-fetching
const urlCache = new Map();

export default function DocumentViewer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const fileName = searchParams.get('file');
  const documentType = searchParams.get('type');
  const appId = searchParams.get('appId');
  
  const [fileUrl, setFileUrl] = useState(null);
  const [error, setError] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Folder mappings for different document types
  const folderMappings = {
    // Photo
    'selfie': 'photo',
    
    // KYC Documents
    'aadhar_proof': 'idproof',
    'pan_proof': 'pan',
    'address_proof': 'address',
    'video_kyc': 'video-kyc', 
    
    // Bank Documents
    'bank_statement': 'bank-statement',
    'second_bank_statement': 'bank-statement-2',
    
    // Salary Documents
    'salary_slip': 'first_salaryslip',
    'second_salary_slip': 'second_salaryslip',
    'third_salary_slip': 'third_salaryslip',
    
    // Reports
    'bank_verif_report': 'reports',
    'social_score_report': 'reports',
    'cibil_score_report': 'reports',
    'bank_fraud_report': 'reports',
    
    // Loan Documents
    'nach_form': 'nach-form',
    'pdc': 'pdc',
    'agreement': 'agreement',
    'sanction_letter': 'sanction-letter',
  };

  // Get folder from document type
  const getFolderFromType = useCallback((type) => {
    return folderMappings[type] || 'documents'; // Default folder
  }, []);

  // Load document
  useEffect(() => {
    const loadDocument = async () => {
      if (!fileName || !documentType) {
        setError('Missing file information');
        toast.error('Missing file information');
        return;
      }

      const cacheKey = `${documentType}_${fileName}`;
      
      // Check cache first (instant load if cached)
      if (urlCache.has(cacheKey)) {
        setFileUrl(urlCache.get(cacheKey));
        return;
      }

      try {
        const folder = getFolderFromType(documentType);
        
        if (!folder) {
          throw new Error(`Invalid document type: ${documentType}`);
        }

        const filePath = `${folder}/${fileName}`;
        const fileRef = ref(storage, filePath);
        const url = await getDownloadURL(fileRef);
        
        // Cache the URL
        urlCache.set(cacheKey, url);
        setFileUrl(url);
        
      } catch (err) {
        console.error('Error loading document:', err);
        const errorMsg = err.code === 'storage/object-not-found' 
          ? 'File not found in storage'
          : 'Failed to load document';
        
        setError(errorMsg);
        toast.error(errorMsg);
      }
    };

    loadDocument();
  }, [fileName, documentType, getFolderFromType]);

  // Handle back navigation - goes to previous page
  const handleGoBack = () => {
    router.back();
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!fullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setFullscreen(!fullscreen);
  };

  // Handle rotation
  const rotateDocument = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Determine file type
  const getFileType = (filename) => {
    if (!filename) return 'unknown';
    
    const ext = filename.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
      return 'image';
    }
    
    if (['pdf'].includes(ext)) {
      return 'pdf';
    }
    
    if (['mp4', 'webm', 'avi', 'mov', 'mkv'].includes(ext)) {
      return 'video';
    }
    
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) {
      return 'document';
    }
    
    return 'download';
  };

  const fileType = getFileType(fileName);

  if (error || (!fileUrl && !fileName)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center max-w-md mx-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <FileText className="w-10 h-10 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-100 mb-3">Document Error</h2>
            <p className="text-gray-300 mb-6">{error || 'Document not found'}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                Try Again
              </button>
              
              <button
                onClick={handleGoBack}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>
            
            {fileName && (
              <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">File details:</p>
                <p className="text-gray-300 font-mono text-sm break-all">{fileName}</p>
                <p className="text-gray-400 text-sm mt-2">Type: {documentType}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 shadow-xl">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Back button */}
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </button>
          
          {/* File name */}
          <div className="flex-1 px-4 mx-2">
            <h1 className="text-sm sm:text-base font-semibold text-white truncate text-center max-w-2xl mx-auto">
              {fileName}
            </h1>
            {appId && (
              <p className="text-xs text-gray-400 text-center">Application ID: {appId}</p>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Rotate button for images */}
            {fileType === 'image' && (
              <button
                onClick={rotateDocument}
                className="inline-flex items-center px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                title="Rotate"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            )}
            
            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="inline-flex items-center px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
              title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {fullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            
            {/* Download button */}
            <a
              href={fileUrl || '#'}
              download={fileName}
              className={`inline-flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg ${
                fileUrl 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              title={fileUrl ? "Download" : "Loading..."}
              onClick={(e) => {
                if (!fileUrl) {
                  e.preventDefault();
                  toast.error('File is still loading. Please wait...');
                }
              }}
            >
              <Download className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Document Content */}
      <div className="flex-1 overflow-hidden bg-gray-900 flex items-center justify-center p-2 sm:p-4">
        {!fileUrl ? (
          // Minimal loading state - just shows the document area
          <div className="w-full h-full flex items-center justify-center bg-gray-800/50 rounded-xl">
            <div className="text-center">
              <p className="text-gray-400 mb-4">Loading document...</p>
              <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-emerald-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${fullscreen ? 'p-0' : 'p-2 sm:p-4'}`}>
            {fileType === 'image' ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={fileUrl} 
                  alt={fileName}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              </div>
            ) : fileType === 'pdf' ? (
              <iframe
                src={fileUrl}
                className="w-full h-full rounded-xl shadow-2xl bg-white"
                title={fileName}
              />
            ) : fileType === 'video' ? (
              <div className="w-full max-w-4xl">
                <video
                  controls
                  className="w-full rounded-xl shadow-2xl bg-black"
                >
                  <source src={fileUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              // For unsupported preview types
              <div className="text-center py-12 max-w-md mx-auto">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-blue-400" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-100 mb-3">Document Preview</h3>
                  <p className="text-gray-300 mb-6">
                    Preview not available for this file type. Please download to view.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href={fileUrl}
                      download={fileName}
                      className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download File
                    </a>
                    
                    <button
                      onClick={handleGoBack}
                      className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Go Back
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer info */}
      <div className="flex-shrink-0 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50 py-2 px-4">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>Type: {documentType?.replace('_', ' ').toUpperCase()}</span>
            <span>•</span>
            <span>Format: {fileName?.split('.').pop()?.toUpperCase()}</span>
          </div>
          <div>
            <button
              onClick={() => window.location.reload()}
              className="hover:text-gray-300 transition-colors"
              title="Reload document"
            >
              <RotateCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}