import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Zap, Clock, Receipt, Building2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';
import { TokenManager } from '@/utils/tokenManager';

const FileUploadSection = ({ userId, onDocumentsUpdate, onDocumentIdsUpdate, disabled }) => {
  const [uploadStatus, setUploadStatus] = useState({
    salarySlip1: { uploading: false, uploaded: false, error: null, filename: null, documentId: null },
    salarySlip2: { uploading: false, uploaded: false, error: null, filename: null, documentId: null },
    salarySlip3: { uploading: false, uploaded: false, error: null, filename: null, documentId: null },
    bankStatement: { uploading: false, uploaded: false, error: null, filename: null, documentId: null }
  });
  
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [compressingFiles, setCompressingFiles] = useState(new Set());

  const fileConfig = {
    salarySlip1: { 
      label: 'Latest Slip', 
      accept: 'image/jpeg,image/jpg,image/png,application/pdf', 
      maxSize: 3,
      uploadType: 'firstsalaryslip'
    },
    salarySlip2: { 
      label: '2nd Month', 
      accept: 'image/jpeg,image/jpg,image/png,application/pdf', 
      maxSize: 3,
      uploadType: 'secondsalaryslip'
    },
    salarySlip3: { 
      label: '3rd Month', 
      accept: 'image/jpeg,image/jpg,image/png,application/pdf', 
      maxSize: 3,
      uploadType: 'thirdsalaryslip'
    },
    bankStatement: { 
      label: 'Bank Statement', 
      accept: 'application/pdf',
      maxSize: 5,
      uploadType: 'statement'
    }
  };

  // Process upload queue
  useEffect(() => {
    if (uploadQueue.length > 0 && !isUploading) {
      processNextUpload();
    }
  }, [uploadQueue, isUploading]);

  // Update parent component
  useEffect(() => {
    const uploadedDocs = {};
    const documentIds = {};
    
    Object.keys(uploadStatus).forEach(key => {
      if (uploadStatus[key].uploaded && uploadStatus[key].filename) {
        uploadedDocs[key] = uploadStatus[key].filename;
        if (uploadStatus[key].documentId) {
          documentIds[key] = uploadStatus[key].documentId;
        }
      }
    });
    
    onDocumentsUpdate(uploadedDocs);
    if (onDocumentIdsUpdate) {
      onDocumentIdsUpdate(documentIds);
    }
  }, [uploadStatus, onDocumentsUpdate, onDocumentIdsUpdate]);

  const processNextUpload = async () => {
    if (uploadQueue.length === 0 || isUploading) return;
    
    const nextUpload = uploadQueue[0];
    setIsUploading(true);
    
    try {
      await handleSingleUpload(nextUpload.file, nextUpload.fieldName);
    } finally {
      setUploadQueue(prev => prev.slice(1));
      setIsUploading(false);
    }
  };

  const generateRandomFileName = (originalName) => {
    const ext = originalName.split('.').pop();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${timestamp}_${randomString}.${ext}`;
  };

  const isImageFile = (file) => file.type.startsWith('image/');

  const compressImage = async (file, fieldName) => {
    setCompressingFiles(prev => new Set([...prev, fieldName]));
    
    try {
      const options = {
        maxSizeMB: 2.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8,
      };
      
      const compressedFile = await imageCompression(file, options);
      return new File([compressedFile], file.name, {
        type: compressedFile.type,
        lastModified: Date.now(),
      });
    } catch (error) {
      throw new Error('Failed to compress image. Please try with a different file.');
    } finally {
      setCompressingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
    }
  };

  const validateFile = (file, config) => {
    const allowedTypes = config.accept.split(',');
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: `File type not allowed` };
    }

    const maxSizeBytes = config.maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { valid: false, error: `File must be under ${config.maxSize}MB` };
    }

    return { valid: true };
  };

  const uploadToBackendAPI = async (filename, uploadType) => {
    const tokenData = TokenManager.getToken();
    if (!tokenData?.token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch('https://api.atdmoney.in/api/user/uploads', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${tokenData.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          upload: uploadType,
          filename: filename
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Server upload failed');
      }

      return result.data;
    } catch (error) {
      throw new Error('Failed to connect to server');
    }
  };

  const uploadFileToFirebase = async (file, fieldName) => {
    const config = fileConfig[fieldName];
    const randomFileName = generateRandomFileName(file.name);
    
    const firebasePathMapping = {
      salarySlip1: 'first_salaryslip',
      salarySlip2: 'second_salaryslip',
      salarySlip3: 'third_salaryslip',
      bankStatement: 'bank-statement'
    };
    
    const storagePath = `${firebasePathMapping[fieldName]}/${randomFileName}`;
    const storageRef = ref(storage, storagePath);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    const backendResult = await uploadToBackendAPI(randomFileName, config.uploadType);
    
    return { 
      filename: randomFileName, 
      downloadURL,
      documentId: backendResult.document_id
    };
  };

  const handleSingleUpload = async (file, fieldName) => {
    const config = fileConfig[fieldName];
    const validation = validateFile(file, config);
    
    if (!validation.valid) {
      setUploadStatus(prev => ({
        ...prev,
        [fieldName]: { 
          ...prev[fieldName], 
          uploading: false, 
          uploaded: false, 
          error: validation.error 
        }
      }));
      return;
    }

    let processedFile = file;

    try {
      if (isImageFile(file) && file.size > (config.maxSize * 1024 * 1024)) {
        processedFile = await compressImage(file, fieldName);
      }

      const result = await uploadFileToFirebase(processedFile, fieldName);
      
      setUploadStatus(prev => ({
        ...prev,
        [fieldName]: { 
          uploading: false, 
          uploaded: true, 
          error: null,
          filename: result.filename,
          documentId: result.documentId,
          downloadURL: result.downloadURL
        }
      }));
    } catch (error) {
      setUploadStatus(prev => ({
        ...prev,
        [fieldName]: { 
          uploading: false, 
          uploaded: false, 
          error: error.message || 'Upload failed'
        }
      }));
    }
  };

  const handleFileChange = (file, fieldName) => {
    const config = fileConfig[fieldName];
    const validation = validateFile(file, config);
    
    if (!validation.valid) {
      setUploadStatus(prev => ({
        ...prev,
        [fieldName]: { 
          ...prev[fieldName], 
          error: validation.error 
        }
      }));
      return;
    }

    setUploadStatus(prev => ({
      ...prev,
      [fieldName]: { 
        ...prev[fieldName], 
        uploading: true, 
        uploaded: false, 
        error: null 
      }
    }));

    setUploadQueue(prev => [...prev, { file, fieldName }]);
  };

  const handleRemoveFile = (fieldName) => {
    setUploadStatus(prev => ({
      ...prev,
      [fieldName]: { 
        uploading: false, 
        uploaded: false, 
        error: null, 
        filename: null,
        documentId: null 
      }
    }));
  };

  const FileUploadField = ({ fieldName }) => {
    const config = fileConfig[fieldName];
    const status = uploadStatus[fieldName];
    const isInQueue = uploadQueue.some(item => item.fieldName === fieldName);
    const isCompressing = compressingFiles.has(fieldName);
    const isActive = status.uploaded || status.uploading || isInQueue || isCompressing;
    const hasError = status.error;

    const getStatusStyles = () => {
      if (hasError) {
        return 'border-red-200 bg-red-50 text-red-700';
      } else if (status.uploaded) {
        return 'border-emerald-200 bg-gradient-to-br from-white to-emerald-50';
      } else if (status.uploading || isInQueue || isCompressing) {
        return 'border-indigo-200 bg-gradient-to-br from-white to-indigo-50';
      }
      return 'border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50';
    };

    const styles = getStatusStyles();

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
              disabled={disabled || isUploading}
            />
            <label
              htmlFor={fieldName}
              className={`flex items-center justify-center w-full h-11 border-2 border-dashed rounded-xl text-xs cursor-pointer transition-all ${styles} ${
                disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="w-4 h-4 mr-2 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              <span className="text-gray-600 group-hover:text-indigo-600 font-medium">Choose File</span>
            </label>
          </div>
        ) : (
          <div className={`flex items-center justify-between w-full px-3 py-2.5 border rounded-xl shadow-sm ${styles}`}>
            <div className="flex items-center space-x-2.5 flex-1 min-w-0">
              {isCompressing ? (
                <Zap className="w-4 h-4 text-amber-500 animate-pulse flex-shrink-0" />
              ) : isInQueue ? (
                <Clock className="w-4 h-4 text-blue-500 animate-pulse flex-shrink-0" />
              ) : status.uploading ? (
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
              ) : status.uploaded ? (
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              ) : (
                <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">
                  {status.uploaded ? 'Uploaded ✓' : 
                   isCompressing ? 'Compressing...' :
                   isInQueue ? 'Queued...' :
                   'Uploading...'}
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => handleRemoveFile(fieldName)}
              className={`p-1 hover:bg-gray-200 rounded-lg transition-colors ${
                status.uploading || isCompressing || isInQueue ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={status.uploading || isCompressing || isInQueue}
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        )}
        
        {status.error && (
          <p className="text-red-500 text-xs flex items-center mt-1">
            <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
            {status.error}
          </p>
        )}
      </div>
    );
  };

  const uploadedCount = Object.values(uploadStatus).filter(s => s.uploaded).length;
  const totalCount = Object.keys(uploadStatus).length;

  return (
    <div className="space-y-5">
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

      {/* Upload Progress Indicator */}
      {uploadQueue.length > 0 && (
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2" />
              <span className="text-sm font-medium text-blue-800">Upload Progress</span>
            </div>
            <span className="text-xs font-medium text-blue-700 bg-white/70 px-2.5 py-1 rounded-full">
              {uploadQueue.length} in queue
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="w-full bg-white/70 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${(uploadedCount / totalCount) * 100}%` 
                }}
              />
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-blue-700">Progress</span>
              <span className="font-medium text-blue-800">
                {uploadedCount}/{totalCount} • {Math.round((uploadedCount / totalCount) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {uploadedCount === totalCount && (
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
  );
};

export default FileUploadSection;