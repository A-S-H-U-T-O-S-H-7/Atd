import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Zap, Clock } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase';

const FileUploadSection = ({ userId, onDocumentsUpdate, disabled }) => {
  const [uploadStatus, setUploadStatus] = useState({
    salarySlip1: { uploading: false, uploaded: false, error: null, filename: null },
    salarySlip2: { uploading: false, uploaded: false, error: null, filename: null },
    salarySlip3: { uploading: false, uploaded: false, error: null, filename: null },
    bankStatement: { uploading: false, uploaded: false, error: null, filename: null }
  });
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [compressingFiles, setCompressingFiles] = useState(new Set());

  const fileConfig = {
    salarySlip1: { 
      label: 'Latest Salary Slip', 
      accept: 'image/jpeg,image/jpg,image/png,application/pdf', 
      maxSize: 3,
      bucket: 'salary_slip_1'
    },
    salarySlip2: { 
      label: '2nd Salary Slip', 
      accept: 'image/jpeg,image/jpg,image/png,application/pdf', 
      maxSize: 3,
      bucket: 'salary_slip_2'
    },
    salarySlip3: { 
      label: '3rd Salary Slip', 
      accept: 'image/jpeg,image/jpg,image/png,application/pdf', 
      maxSize: 3,
      bucket: 'salary_slip_3'
    },
    bankStatement: { 
      label: 'Bank Statement', 
      accept: 'application/pdf',
      maxSize: 5,
      bucket: 'bank_statement'
    }
  };

  useEffect(() => {
    if (uploadQueue.length > 0 && !isUploading) {
      processNextUpload();
    }
  }, [uploadQueue, isUploading]);

  useEffect(() => {
    const uploadedDocs = {};
    Object.keys(uploadStatus).forEach(key => {
      if (uploadStatus[key].uploaded && uploadStatus[key].filename) {
        uploadedDocs[key] = uploadStatus[key].filename;
      }
    });
    onDocumentsUpdate(uploadedDocs);
  }, [uploadStatus, onDocumentsUpdate]);

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
    const randomString = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    return `${timestamp}-${randomString}.${ext}`;
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
      throw new Error('Image compression failed. Please try with a different image.');
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
      return { valid: false, error: `Invalid file type` };
    }

    const maxSizeBytes = isImageFile(file) ? 
      config.maxSize * 1024 * 1024 * 3 :
      config.maxSize * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      return { 
        valid: false, 
        error: `Max ${config.maxSize}MB` 
      };
    }

    return { valid: true };
  };

  const uploadFileToFirebase = async (file, fieldName) => {
    const config = fileConfig[fieldName];
    const randomFileName = generateRandomFileName(file.name);
    
    const storageRef = ref(storage, `loan_application/${userId}/${config.bucket}/${randomFileName}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return { success: true, filename: randomFileName, downloadURL };
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
          downloadURL: result.downloadURL
        }
      }));
    } catch (error) {
      setUploadStatus(prev => ({
        ...prev,
        [fieldName]: { 
          ...prev[fieldName], 
          uploading: false, 
          uploaded: false, 
          error: 'Upload failed'
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
      [fieldName]: { uploading: false, uploaded: false, error: null, filename: null }
    }));
  };

  const FileUploadField = ({ fieldName }) => {
    const config = fileConfig[fieldName];
    const status = uploadStatus[fieldName];
    const isInQueue = uploadQueue.some(item => item.fieldName === fieldName);
    const isCompressing = compressingFiles.has(fieldName);
    const isActive = status.uploaded || status.uploading || isInQueue || isCompressing;
    const hasError = status.error;

    // Determine colors based on status
    let borderColor = 'border-gray-300';
    let bgColor = 'bg-gray-50';
    let textColor = 'text-gray-700';
    let borderStyle = 'border-dashed';
    
    if (hasError) {
      borderColor = 'border-red-300';
      bgColor = 'bg-red-50';
      textColor = 'text-red-700';
      borderStyle = 'border-solid';
    } else if (status.uploaded) {
      borderColor = 'border-green-300';
      bgColor = 'bg-green-50';
      textColor = 'text-green-700';
      borderStyle = 'border-solid';
    } else if (status.uploading || isInQueue || isCompressing) {
      borderColor = 'border-blue-300';
      bgColor = 'bg-blue-50';
      textColor = 'text-blue-700';
      borderStyle = 'border-solid';
    }

    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-700">
          {config.label}
          {status.uploaded && (
            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">
              ✓ Uploaded
            </span>
          )}
        </label>
        
        {!isActive ? (
          <div className="relative">
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
              className={`flex items-center justify-center w-full h-10 ${bgColor} border ${borderStyle} ${borderColor} rounded-lg text-xs cursor-pointer transition-all group ${
                disabled || isUploading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:border-blue-400 hover:bg-blue-50 hover:border-solid'
              }`}
            >
              <Upload className="w-3.5 h-3.5 mr-1.5 text-gray-400 group-hover:text-blue-500" />
              <span className="group-hover:text-blue-700">Choose File</span>
            </label>
          </div>
        ) : (
          <div className={`flex items-center justify-between w-full px-3 py-2 ${bgColor} border ${borderColor} rounded-lg transition-all duration-300 ${borderStyle}`}>
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              {isCompressing ? (
                <div className="relative flex-shrink-0">
                  <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
                </div>
              ) : isInQueue ? (
                <Clock className="w-4 h-4 text-blue-500 flex-shrink-0 animate-pulse" />
              ) : status.uploading ? (
                <div className="relative flex-shrink-0">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-4 h-4 border-2 border-blue-200 rounded-full"></div>
                </div>
              ) : status.uploaded ? (
                <div className="relative flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
              ) : (
                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
              
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium ${textColor} truncate`}>
                  {status.uploaded ? 'Successfully uploaded!' : 
                   isCompressing ? 'Compressing...' :
                   isInQueue ? 'Queued...' :
                   'Uploading...'}
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => handleRemoveFile(fieldName)}
              className={`p-1 hover:bg-white/50 rounded transition-colors ${
                status.uploading || isCompressing || isInQueue 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-white/70'
              }`}
              disabled={status.uploading || isCompressing || isInQueue}
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        )}
        
        {status.error && (
          <p className="text-red-500 text-xs flex items-center animate-shake">
            <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
            {status.error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">📄</span>
          Salary Slips (Optional)
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((num) => (
            <FileUploadField key={`salarySlip${num}`} fieldName={`salarySlip${num}`} />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Upload last 3 months salary slips. Max 3MB each (images/PDF)
        </p>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">🏦</span>
          Bank Statement (Optional)
        </h4>
        <FileUploadField fieldName="bankStatement" />
        <p className="text-xs text-gray-500 mt-2">
          6 months bank statement. PDF only, max 5MB
        </p>
      </div>

      {(uploadQueue.length > 0 || isUploading) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-xs font-medium text-blue-800">Uploading Files</span>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
              {uploadQueue.length} in queue
            </span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-1.5 mb-1">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${(Object.values(uploadStatus).filter(s => s.uploaded).length / 4) * 100}%` 
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-blue-600">
            <span>
              {Object.values(uploadStatus).filter(s => s.uploaded).length} of 4 uploaded
            </span>
            <span>
              {Math.round((Object.values(uploadStatus).filter(s => s.uploaded).length / 4) * 100)}%
            </span>
          </div>
        </div>
      )}

      {Object.values(uploadStatus).filter(s => s.uploaded).length === 4 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 animate-fade-in">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-medium text-green-800">
              All documents uploaded successfully!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;