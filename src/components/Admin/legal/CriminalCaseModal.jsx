"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X, Scale, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { legalService } from "@/lib/services/LegalService";

const validationSchema = Yup.object({
  criminalComplaintNo: Yup.string()
    .required("Criminal Complaint No. is required"),
  policeStation: Yup.string(),
  boardResolutionDate: Yup.date().nullable(),
  loanAgreementDate: Yup.date().nullable(),
  loanApplicationDate: Yup.date().nullable(),
  noticeDate: Yup.date().nullable(),
  caseFilledDate: Yup.date().required("Case filled date is required"),
  courtId: Yup.string().required("Court selection is required"),
  advocateId: Yup.string().required("Advocate selection is required"),
  authorisedId: Yup.string().required("Authorised representative is required"),
});

const CreateCriminalCaseModal = ({ 
  isOpen, 
  onClose, 
  legal, 
  isDark, 
  onSuccess 
}) => {
  const [courts, setCourts] = useState([]);
  const [advocates, setAdvocates] = useState([]);
  const [authorisedReps, setAuthorisedReps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString || dateString === 'N/A') return '';
    
    try {
      if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
      }
      
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Get initial values
  const getInitialValues = () => ({
    criminalComplaintNo: '',
    policeStation: legal?.policeStation || '',
    boardResolutionDate: formatDateForInput(legal?.boardResolutionDate),
    loanAgreementDate: formatDateForInput(legal?.loanAgreementDate),
    loanApplicationDate: formatDateForInput(legal?.loanApplicationDate),
    noticeDate: formatDateForInput(legal?.noticeDate) || new Date().toISOString().split('T')[0],
    caseFilledDate: new Date().toISOString().split('T')[0],
    courtId: '',
    advocateId: '',
    authorisedId: ''
  });

  // Handle form submission
  const handleSubmit = async (values) => {
    if (!legal?.id) {
      toast.error("Invalid legal case");
      return;
    }

    setIsLoading(true);

    try {
      const caseData = {
        criminal_complaint_no: values.criminalComplaintNo,
        police_station: values.policeStation || "",
        board_resolution_date: values.boardResolutionDate || null,
        loan_agreement_date: values.loanAgreementDate || null,
        loan_application_date: values.loanApplicationDate || null,
        notice_date: values.noticeDate || null,
        case_filled_date: values.caseFilledDate,
        court_id: parseInt(values.courtId),
        advocate_id: parseInt(values.advocateId),
        authorised_id: parseInt(values.authorisedId)
      };

      const response = await legalService.createCriminalCase(legal.id, caseData);

      if (response.success && response.data instanceof Blob) {
        downloadDocument(response.data, "Criminal Case");
        toast.success("Document generated successfully!");
        if (onSuccess) onSuccess();
        setTimeout(onClose, 1000);
      } else {
        toast.error(response.message || "Failed to generate document");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create criminal case");
    } finally {
      setIsLoading(false);
    }
  };

  // Download document helper
  const downloadDocument = (blob, documentType) => {
    try {
      const customerName = legal?.customerName?.replace(/[^a-zA-Z0-9-_]/g, '_') || 'document';
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `${documentType.replace(/\s+/g, '_')}_${customerName}_${dateStr}.doc`;
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    try {
      const [courtsRes, advocatesRes, authRes] = await Promise.all([
        legalService.getCourts(),
        legalService.getAdvocates(),
        legalService.getAuthorisedRepresentatives()
      ]);

      if (courtsRes?.success) setCourts(courtsRes.data || []);
      if (advocatesRes?.success) setAdvocates(advocatesRes.data || []);
      if (authRes?.success) setAuthorisedReps(authRes.data || []);
    } catch (error) {
      console.error("Failed to load dropdown data:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className={`relative z-10 w-full max-w-2xl mx-4 rounded-xl shadow-2xl max-h-[90vh] overflow-hidden ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}>
        <div className={`px-6 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Scale className={`w-6 h-6 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              <h3 className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                Create Criminal Case - {legal?.customerName}
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Formik
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
          validateOnMount={true}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="p-6 space-y-5">
                {/* Criminal Complaint No and Police Station */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Criminal Complaint No. <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      name="criminalComplaintNo"
                      placeholder="CC/2026/001234"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark 
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      }`}
                    />
                    <ErrorMessage name="criminalComplaintNo">
                      {(msg) => <p className="mt-1 text-sm text-red-600">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Police Station:
                    </label>
                    <Field
                      type="text"
                      name="policeStation"
                      placeholder="Enter police station"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark 
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      }`}
                    />
                  </div>
                </div>

                {/* Date Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Board Resolution Date:
                    </label>
                    <Field
                      type="date"
                      name="boardResolutionDate"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark 
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Loan Agreement Date:
                    </label>
                    <Field
                      type="date"
                      name="loanAgreementDate"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark 
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      }`}
                    />
                  </div>
                </div>

                {/* More Date Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Loan Application Date:
                    </label>
                    <Field
                      type="date"
                      name="loanApplicationDate"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark 
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Legal Notice Date:
                    </label>
                    <Field
                      type="date"
                      name="noticeDate"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark 
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      }`}
                    />
                  </div>
                </div>

                {/* Dropdown Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Court Selection */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Court <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="courtId"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark 
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      }`}
                    >
                      <option value="">Select Court</option>
                      {courts.map((court) => (
                        <option key={court.id} value={court.id}>
                          {court.court_name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="courtId">
                      {(msg) => <p className="mt-1 text-sm text-red-600">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Advocate Selection */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Advocate <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="advocateId"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark 
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      }`}
                    >
                      <option value="">Select Advocate</option>
                      {advocates.map((advocate) => (
                        <option key={advocate.id} value={advocate.id}>
                          {advocate.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="advocateId">
                      {(msg) => <p className="mt-1 text-sm text-red-600">{msg}</p>}
                    </ErrorMessage>
                  </div>
                </div>

                {/* Authorised Representative and Case Filled Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Authorised Representative <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="authorisedId"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark 
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      }`}
                    >
                      <option value="">Select Representative</option>
                      {authorisedReps.map((rep) => (
                        <option key={rep.id} value={rep.id}>
                          {rep.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="authorisedId">
                      {(msg) => <p className="mt-1 text-sm text-red-600">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Case Filled Date <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="date"
                      name="caseFilledDate"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        isDark 
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      }`}
                    />
                    <ErrorMessage name="caseFilledDate">
                      {(msg) => <p className="mt-1 text-sm text-red-600">{msg}</p>}
                    </ErrorMessage>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className={`px-6 py-4 border-t flex justify-end ${
                isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50/50"
              }`}>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading || !isValid}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 ${
                    isSubmitting || isLoading || !isValid
                      ? isDark
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : isDark
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/50"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                  }`}
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Generate Document</span>
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
};

export default CreateCriminalCaseModal;