"use client";
import React, { useState, useEffect } from 'react'
import { Formik, Form, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { DocumentUploadSchema } from '../validations/UserRegistrationValidations';
import { useUser } from '@/lib/UserRegistrationContext';
import { Upload, FileText, ChevronLeft, ChevronRight, CheckCircle, X, AlertCircle } from 'lucide-react';

function DocumentUpload() {
    const {
        documentData,
        setDocumentData,
        step,
        setStep,
        phoneData,
        loader,
        setLoader,
        errorMessage,
        setErrorMessage
    } = useUser();

    const [uploadStatus, setUploadStatus] = useState({});
    const [uploadingFiles, setUploadingFiles] = useState(new Set());
    // NEW: Track uploaded files with their hash/name and field mapping
    const [uploadedFiles, setUploadedFiles] = useState(new Map());

    // Document configuration mapping
    const documentConfig = {
        photo: { label: 'Passport Photo', accept: 'image/*', maxSize: 1, apiValue: 'selfie' },
        aadharFront: { label: 'Aadhar Card (Front)', accept: 'image/*,.pdf', maxSize: 2, apiValue: 'idproof' },
        aadharBack: { label: 'Aadhar Card (Back)', accept: 'image/*,.pdf', maxSize: 2, apiValue: 'addressproof' },
        panCard: { label: 'PAN Card', accept: 'image/*,.pdf', maxSize: 2, apiValue: 'pancard' },
        salarySlip1: { label: 'Latest Salary Slip', accept: '.pdf', maxSize: 2, apiValue: 'firstsalaryslip' },
        salarySlip2: { label: '2nd Month Salary Slip', accept: '.pdf', maxSize: 2, apiValue: 'secondsalaryslip' },
        salarySlip3: { label: '3rd Month Salary Slip', accept: '.pdf', maxSize: 2, apiValue: 'thirdsalaryslip' },
        bankStatement: { label: '6 Month Bank Statement', accept: '.pdf', maxSize: 5, apiValue: 'statement' }
    };

    // NEW: Generate file hash for duplicate detection
    const generateFileHash = async (file) => {
        // Simple approach: use file name, size, and lastModified as identifier
        const identifier = `${file.name}_${file.size}_${file.lastModified}`;
        return identifier;
    };

    // NEW: Check if file is already uploaded in another field
    const checkForDuplicateFile = async (file, currentFieldName) => {
        const fileHash = await generateFileHash(file);
        
        // Check if this file hash exists in uploaded files
        if (uploadedFiles.has(fileHash)) {
            const existingField = uploadedFiles.get(fileHash);
            if (existingField !== currentFieldName) {
                return {
                    isDuplicate: true,
                    existingField: existingField,
                    existingFieldLabel: documentConfig[existingField]?.label
                };
            }
        }
        
        return { isDuplicate: false };
    };

    // NEW: Add file to uploaded files tracking
    const addToUploadedFiles = async (file, fieldName) => {
        const fileHash = await generateFileHash(file);
        setUploadedFiles(prev => new Map(prev.set(fileHash, fieldName)));
    };

    // NEW: Remove file from uploaded files tracking
    const removeFromUploadedFiles = async (file) => {
        if (file) {
            const fileHash = await generateFileHash(file);
            setUploadedFiles(prev => {
                const newMap = new Map(prev);
                newMap.delete(fileHash);
                return newMap;
            });
        }
    };

    // Generate unique filename
    const generateUniqueFilename = (originalName, fieldName) => {
        const timestamp = Date.now();
        const extension = originalName.split('.').pop();
        return `${fieldName}_${phoneData?.userid || 'user'}_${timestamp}.${extension}`;
    };

    // Upload file to API
    const uploadFileToAPI = async (file, fieldName) => {
        const config = documentConfig[fieldName];
        const uniqueFilename = generateUniqueFilename(file.name, fieldName);
        
        setUploadingFiles(prev => new Set([...prev, fieldName]));
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/user/form`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    step: 10,
                    provider: 1,
                    userid: phoneData?.userid,
                    upload: config.apiValue,
                    filename: uniqueFilename
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setUploadStatus(prev => ({
                    ...prev,
                    [fieldName]: { status: 'success', filename: uniqueFilename }
                }));
                // NEW: Add to uploaded files tracking
                await addToUploadedFiles(file, fieldName);
                return { success: true, filename: uniqueFilename };
            } else {
                setUploadStatus(prev => ({
                    ...prev,
                    [fieldName]: { status: 'error', error: result.message || 'Upload failed' }
                }));
                return { success: false, error: result.message || 'Upload failed' };
            }
        } catch (error) {
            setUploadStatus(prev => ({
                ...prev,
                [fieldName]: { status: 'error', error: error.message }
            }));
            return { success: false, error: error.message };
        } finally {
            setUploadingFiles(prev => {
                const newSet = new Set(prev);
                newSet.delete(fieldName);
                return newSet;
            });
        }
    };

    // MODIFIED: Handle file selection with duplicate check
    const handleFileChange = async (file, fieldName, setFieldValue, currentFile = null) => {
        if (!file) return;

        const config = documentConfig[fieldName];
        
        // NEW: Check for duplicate file
        const duplicateCheck = await checkForDuplicateFile(file, fieldName);
        if (duplicateCheck.isDuplicate) {
            setErrorMessage(
                `This file "${file.name}" is already uploaded for ${duplicateCheck.existingFieldLabel}. Please select a different file for ${config.label}.`
            );
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        // Validate file type
        const allowedTypes = config.accept === 'image/*' 
            ? ['image/jpeg', 'image/jpg', 'image/png']
            : config.accept === '.pdf'
            ? ['application/pdf']
            : ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

        if (!allowedTypes.includes(file.type)) {
            setErrorMessage(`Invalid file type for ${config.label}. Please select a valid file.`);
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        // Validate file size
        const maxSizeBytes = config.maxSize * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            setErrorMessage(`File size exceeds ${config.maxSize}MB for ${config.label}`);
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        // NEW: If replacing a file, remove the old one from tracking
        if (currentFile) {
            await removeFromUploadedFiles(currentFile);
        }

        // Set file in form and upload
        setFieldValue(fieldName, file);
        const uploadResult = await uploadFileToAPI(file, fieldName);
        
        if (!uploadResult.success) {
            setErrorMessage(`Failed to upload ${config.label}: ${uploadResult.error}`);
            setTimeout(() => setErrorMessage(''), 5000);
            // NEW: If upload failed, don't keep it in tracking
            await removeFromUploadedFiles(file);
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle form submission
    const handleSubmit = async (values) => {
        setLoader(true);
        setErrorMessage("");
        
        // Check if all files are uploaded successfully
        const requiredFields = Object.keys(documentConfig);
        const allUploaded = requiredFields.every(field => 
            values[field] && uploadStatus[field]?.status === 'success'
        );
        
        if (!allUploaded) {
            setErrorMessage("Please ensure all documents are uploaded successfully before proceeding.");
            setLoader(false);
            return;
        }
        
        setDocumentData({ ...values });
        setLoader(false);
        setStep(step + 1);
    };

    // File upload component
    const FileUploadField = ({ fieldName, setFieldValue, values }) => {
        const config = documentConfig[fieldName];
        const file = values[fieldName];
        const status = uploadStatus[fieldName];
        const isUploading = uploadingFiles.has(fieldName);

        return (
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                    {config.label}
                    <span className="text-red-500 ml-1">*</span>
                </label>
                
                {!file ? (
                    <div className="relative">
                        <input
                            type="file"
                            id={fieldName}
                            accept={config.accept}
                            onChange={(e) => {
                                const selectedFile = e.target.files[0];
                                if (selectedFile) {
                                    handleFileChange(selectedFile, fieldName, setFieldValue);
                                }
                            }}
                            className="hidden"
                        />
                        <label
                            htmlFor={fieldName}
                            className="flex flex-col items-center justify-center w-full h-32 bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-xl transition-all duration-200 hover:border-teal-400 hover:bg-teal-50/30 cursor-pointer group"
                        >
                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-teal-500 mb-2" />
                            <span className="text-sm text-gray-600 group-hover:text-teal-600 font-medium">
                                Choose {config.label}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                                Max {config.maxSize}MB
                            </span>
                        </label>
                    </div>
                ) : (
                    <div className="flex items-center justify-between w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {isUploading ? (
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <BeatLoader color="#14b8a6" size={4} />
                                </div>
                            ) : status?.status === 'success' ? (
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : status?.status === 'error' ? (
                                <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                            ) : (
                                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                            
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatFileSize(file.size)}
                                    {status?.status === 'success' && (
                                        <span className="text-green-600 ml-2">✓ Uploaded</span>
                                    )}
                                    {status?.status === 'error' && (
                                        <span className="text-red-600 ml-2">✗ Failed</span>
                                    )}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <input
                                type="file"
                                id={`${fieldName}_replace`}
                                accept={config.accept}
                                onChange={(e) => {
                                    const selectedFile = e.target.files[0];
                                    if (selectedFile) {
                                        // MODIFIED: Pass current file for replacement tracking
                                        handleFileChange(selectedFile, fieldName, setFieldValue, file);
                                    }
                                }}
                                className="hidden"
                            />
                            <label
                                htmlFor={`${fieldName}_replace`}
                                className="px-3 py-1 text-xs bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 cursor-pointer transition-colors"
                            >
                                Replace
                            </label>
                        </div>
                    </div>
                )}
                
                <ErrorMessage name={fieldName} component="p" className="text-red-500 text-sm" />
                
                {status?.status === 'error' && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {status.error}
                    </p>
                )}
            </div>
        );
    };

    // Document sections
    const documentSections = [
        {
            title: "Identity Documents",
            fields: ['photo', 'aadharFront', 'aadharBack', 'panCard']
        },
        {
            title: "Financial Documents",
            fields: ['salarySlip1', 'salarySlip2', 'salarySlip3', 'bankStatement']
        }
    ];

    return (
        <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
                        <Upload className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Document Upload
                    </h1>
                    <p className="text-gray-600">
                        Upload your documents to complete the verification process
                    </p>
                </div>

                <Formik
                    initialValues={documentData}
                    validationSchema={DocumentUploadSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isValid, setFieldValue, values }) => (
                        <Form className="space-y-6">
                            {errorMessage && (
                                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                        <p className='text-red-600 font-medium'>{errorMessage}</p>
                                    </div>
                                </div>
                            )}
                            
                            {documentSections.map((section, index) => (
                                <div key={index} className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                            {index === 0 ? (
                                                <FileText className="w-4 h-4 text-white" />
                                            ) : (
                                                <Upload className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {section.fields.map((fieldName) => (
                                            <FileUploadField
                                                key={fieldName}
                                                fieldName={fieldName}
                                                setFieldValue={setFieldValue}
                                                values={values}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Guidelines */}
                            <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-blue-600 text-sm font-bold">i</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-blue-800 mb-2">
                                            Important Guidelines
                                        </h3>
                                        <ul className="text-sm text-blue-700 space-y-1">
                                            <li>• Documents should be clear and readable</li>
                                            <li>• Salary slips must be from the last 3 consecutive months</li>
                                            <li>• Bank statement should cover the last 6 months</li>
                                            <li>• Files are uploaded automatically when selected</li>
                                            <li>• Each document must be unique - same file cannot be used for multiple fields</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors duration-200"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                
                                <button 
                                    disabled={loader || !isValid} 
                                    type='submit' 
                                    className="inline-flex cursor-pointer items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loader ? (
                                        <BeatLoader color="#fff" size={6} />
                                    ) : (
                                        <>
                                            Next
                                            <ChevronRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default DocumentUpload;