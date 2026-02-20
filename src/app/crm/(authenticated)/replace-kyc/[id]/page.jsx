"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ReplaceKYC from "@/components/Admin/all-enquiries/replace-kyc/ReplaceKYC";
import kycService from "@/lib/services/replaceKycSevice";



export default function ReplaceKYCPage() {
  const params = useParams();
  const router = useRouter();
  const enquiryId = params.id;
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to load enquiry data
  const loadEnquiryData = async () => {
    try {
      setError(null);
      
      // Validate enquiryId
      if (!enquiryId || isNaN(parseInt(enquiryId))) {
        throw new Error("Invalid enquiry ID");
      }

      const enquiryIdNum = parseInt(enquiryId);

      // Try to get from localStorage first
      const storedEnquiry = localStorage.getItem('selectedEnquiry');
      
      if (storedEnquiry) {
        try {
          const parsedEnquiry = JSON.parse(storedEnquiry);
          if (parsedEnquiry.id === enquiryIdNum) {
            // Fetch latest KYC data from API
            const kycData = await kycService.getKYCDetails(enquiryIdNum);
            setEnquiry({
              ...parsedEnquiry,
              kycDocuments: kycData.kycDocuments,
              documentId: kycData.documentId
            });
            setLoading(false);
            return;
          }
        } catch (parseError) {
          console.warn('Error parsing stored enquiry:', parseError);
        }
      }

      // Fetch KYC data directly from API
      const kycData = await kycService.getKYCDetails(enquiryIdNum);
      
      // Create minimal enquiry object from KYC data
      const minimalEnquiry = {
        id: enquiryIdNum,
        name: kycData.fullName,
        crnNo: kycData.crnNo,
        kycDocuments: kycData.kycDocuments,
        documentId: kycData.documentId
      };
      
      setEnquiry(minimalEnquiry);
    } catch (err) {
      console.error('Error loading KYC data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiryData();
  }, [enquiryId]);

  const handleBack = () => {
    localStorage.removeItem('selectedEnquiry');
    router.back();
  };

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    await loadEnquiryData(); 
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading enquiry data...</p>
          <p className="text-sm text-gray-500 mt-1">CRN: {enquiryId}</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error.includes('Invalid') ? 'Invalid Enquiry ID' : 'Enquiry Not Found'}
          </h2>
          <p className="text-gray-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            {error.includes('Invalid') 
              ? 'The enquiry ID format is incorrect.' 
              : 'The enquiry you\'re looking for doesn\'t exist or may have been removed.'
            }
          </p>
          <div className="flex gap-3 justify-center">
            {!error.includes('Invalid') && (
              <button 
                onClick={handleRetry}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
              >
                Try Again
              </button>
            )}
            <button 
              onClick={handleBack}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No Enquiry Found State
  if (!enquiry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Enquiry Data</h2>
          <p className="text-gray-600 mb-6">Unable to load enquiry information.</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              Try Again
            </button>
            <button 
              onClick={handleBack}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success State - Render ReplaceKYC Component
  return (
    <ReplaceKYC 
      enquiry={enquiry}
    />
  );
}