"use client";
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from 'react-spinners';
import { DocumentUploadSchema } from '../validations/UserRegistrationValidations';
import { useUser } from '@/lib/UserRegistrationContext';
import { Upload, FileText, ChevronLeft, ChevronRight, CheckCircle, X } from 'lucide-react';
import References from './References';

function DocumentUpload() {
    const {
        documentData,
        setDocumentData,
        step,
        setStep,
        loader,
        setLoader,
        errorMessage,
        setErrorMessage
    } = useUser();

    const [uploadingFiles, setUploadingFiles] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState({});

    // File size formatter
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Upload file to database immediately
    const uploadFileToDb = async (file, fieldName) => {
        setUploadingFiles(prev => ({ ...prev, [fieldName]: true }));
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fieldName', fieldName);
            
            const response = await fetch(`${ENV.API_URL}/upload-document`, {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setUploadedFiles(prev => ({ 
                    ...prev, 
                    [fieldName]: { 
                        file, 
                        uploadedUrl: result.url || result.filePath,
                        status: 'success' 
                    } 
                }));
                return true;
            } else {
                setUploadedFiles(prev => ({ 
                    ...prev, 
                    [fieldName]: { file, status: 'error', error: result.message } 
                }));
                return false;
            }
        } catch (error) {
            setUploadedFiles(prev => ({ 
                ...prev, 
                [fieldName]: { file, status: 'error', error: error.message } 
            }));
            return false;
        } finally {
            setUploadingFiles(prev => ({ ...prev, [fieldName]: false }));
        }
    };

    // Handle file selection and immediate upload
    const handleFileChange = async (file, fieldName, setFieldValue) => {
        if (file) {
            const validation = validateFile(file, getDocumentConfig(fieldName));
            if (validation.isValid) {
                setFieldValue(fieldName, file);
                await uploadFileToDb(file, fieldName);
            } else {
                setErrorMessage(validation.error);
                setTimeout(() => setErrorMessage(''), 3000);
            }
        }
    };

    // Validate file type and size
    const validateFile = (file, config) => {
        if (!file) return { isValid: false, error: "File is required" };
        
        if (!config.allowedTypes.includes(file.type)) {
            return { isValid: false, error: `Invalid file type for ${config.label}` };
        }
        
        if (file.size > config.maxSize) {
            return { isValid: false, error: `File size exceeds ${formatFileSize(config.maxSize)} for ${config.label}` };
        }
        
        return { isValid: true, error: null };
    };

    // Get document configuration by field name
    const getDocumentConfig = (fieldName) => {
        const configs = {
            aadharFront: { allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'], maxSize: 2 * 1024 * 1024, label: 'Aadhar Front' },
            aadharBack: { allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'], maxSize: 2 * 1024 * 1024, label: 'Aadhar Back' },
            panCard: { allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'], maxSize: 2 * 1024 * 1024, label: 'PAN Card' },
            photo: { allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'], maxSize: 1 * 1024 * 1024, label: 'Photo' },
            salarySlip1: { allowedTypes: ['application/pdf'], maxSize: 2 * 1024 * 1024, label: 'Salary Slip 1' },
            salarySlip2: { allowedTypes: ['application/pdf'], maxSize: 2 * 1024 * 1024, label: 'Salary Slip 2' },
            salarySlip3: { allowedTypes: ['application/pdf'], maxSize: 2 * 1024 * 1024, label: 'Salary Slip 3' },
            bankStatement: { allowedTypes: ['application/pdf'], maxSize: 5 * 1024 * 1024, label: 'Bank Statement' }
        };
        return configs[fieldName] || {};
    };

    // Handle form submission
    const handleDocumentUpload = async (values) => {
        setLoader(true);
        setErrorMessage("");
        
        // Check if all files are uploaded successfully
        const allFilesUploaded = Object.keys(values).every(key => 
            uploadedFiles[key] && uploadedFiles[key].status === 'success'
        );
        
        if (!allFilesUploaded) {
            setErrorMessage("Please ensure all documents are uploaded successfully before proceeding.");
            setLoader(false);
            return;
        }
        
        setDocumentData({ ...values });
        setLoader(false);
        setStep(step + 1);
    };

    // Document configuration
    const documentSections = [
        {
            title: "Identity Documents",
            fields: [
                { name: 'aadharFront', label: 'Aadhar Card (Front)', accept: 'image/*,.pdf' },
                { name: 'aadharBack', label: 'Aadhar Card (Back)', accept: 'image/*,.pdf' },
                { name: 'panCard', label: 'PAN Card', accept: 'image/*,.pdf' },
                { name: 'photo', label: 'Passport Photo', accept: 'image/*' }
            ]
        },
        {
            title: "Financial Documents",
            fields: [
                { name: 'salarySlip1', label: 'Latest Salary Slip', accept: '.pdf' },
                { name: 'salarySlip2', label: '2nd Month Salary Slip', accept: '.pdf' },
                { name: 'salarySlip3', label: '3rd Month Salary Slip', accept: '.pdf' },
                { name: 'bankStatement', label: '6 Month Bank Statement', accept: '.pdf' }
            ]
        }
    ];

    // File upload field component
    const FileUploadField = ({ field, setFieldValue, values }) => {
        const currentFile = values[field.name];
        const isUploading = uploadingFiles[field.name];
        const uploadedFile = uploadedFiles[field.name];
        const hasFile = currentFile || uploadedFile;

        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    {field.label}<span className="text-red-500 ml-1">*</span>
                </label>
                
                <div className="w-full">
                    {!hasFile ? (
                        <div className="relative">
                            <input
                                type="file"
                                id={field.name}
                                accept={field.accept}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        handleFileChange(file, field.name, setFieldValue);
                                    }
                                }}
                                className="hidden"
                            />
                            <label
                                htmlFor={field.name}
                                className="flex items-center justify-center w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-xl transition-all duration-200 hover:border-teal-400 hover:bg-teal-50/30 cursor-pointer group"
                            >
                                <Upload className="w-5 h-5 text-gray-400 group-hover:text-teal-500 mr-2" />
                                <span className="text-sm text-gray-600 group-hover:text-teal-600">
                                    Choose file
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
                                ) : uploadedFile?.status === 'success' ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                ) : uploadedFile?.status === 'error' ? (
                                    <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                                ) : (
                                    <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                )}
                                
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                        {currentFile?.name || uploadedFile?.file?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(currentFile?.size || uploadedFile?.file?.size || 0)}
                                        {uploadedFile?.status === 'success' && (
                                            <span className="text-green-600 ml-2">✓ Uploaded</span>
                                        )}
                                        {uploadedFile?.status === 'error' && (
                                            <span className="text-red-600 ml-2">✗ Upload failed</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <input
                                    type="file"
                                    id={`${field.name}_replace`}
                                    accept={field.accept}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            handleFileChange(file, field.name, setFieldValue);
                                        }
                                    }}
                                    className="hidden"
                                />
                                <label
                                    htmlFor={`${field.name}_replace`}
                                    className="px-3 py-1 text-xs bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 cursor-pointer transition-colors"
                                >
                                    Replace
                                </label>
                            </div>
                        </div>
                    )}
                </div>
                
                <ErrorMessage name={field.name} component="p" className="text-red-500 text-sm" />
                
                {uploadedFile?.status === 'error' && (
                    <p className="text-red-500 text-xs">{uploadedFile.error}</p>
                )}
            </div>
        );
    };

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
                    onSubmit={(values) => { handleDocumentUpload(values); }}
                    enableReinitialize
                >
                    {({ isValid, touched, setFieldValue, values }) => (
                        <Form className="space-y-8">
                            {errorMessage && (
                                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4">
                                    <p className='text-red-600 text-center font-medium'>{errorMessage}</p>
                                </div>
                            )}
                            
                            {documentSections.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                            {sectionIndex === 0 ? (
                                                <FileText className="w-4 h-4 text-white" />
                                            ) : (
                                                <Upload className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {section.fields.map((field) => (
                                            <FileUploadField
                                                key={field.name}
                                                field={field}
                                                setFieldValue={setFieldValue}
                                                values={values}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Important Guidelines */}
                            <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-2xl p-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-amber-600 text-sm font-bold">!</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-amber-800 mb-2">
                                            Important Guidelines
                                        </h3>
                                        <ul className="text-sm text-amber-700 space-y-1">
                                            <li>• Documents should be clear and readable with good lighting</li>
                                            <li>• Salary slips must be from the last 3 consecutive months</li>
                                            <li>• Bank statement should cover the last 6 months period</li>
                                            <li>• All documents will be uploaded automatically upon selection</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="inline-flex cursor-pointer items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-all duration-200 order-2 sm:order-1"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                
                                <button 
                                    disabled={loader || !isValid} 
                                    type='submit' 
                                    className="inline-flex items-center cursor-pointer justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                                >
                                    {loader ? (
                                        <BeatLoader color="#fff" size={8} />
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
            <References/>
        </div>
    )
}

export default DocumentUpload;