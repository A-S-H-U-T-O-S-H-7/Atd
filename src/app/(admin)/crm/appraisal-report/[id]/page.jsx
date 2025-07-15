"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AppraisalReport from "@/components/Admin/all-enquiries/appraisal-report/AppraisalReport";

export default function AppraisalReportPage() {
  const params = useParams();
  const router = useRouter();
  const enquiryId = params.id;
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate enquiry ID
if (!enquiryId || isNaN(parseInt(enquiryId))) {
    useEffect(() => {
      setError("Invalid enquiry ID");
      setLoading(false);
    }, []);
  }


  useEffect(() => {
    const storedEnquiry = localStorage.getItem('selectedEnquiry');
    
    if (storedEnquiry) {
      try {
        const parsedEnquiry = JSON.parse(storedEnquiry);
        if (parsedEnquiry.id === parseInt(enquiryId)) {
          setEnquiry(parsedEnquiry);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing stored enquiry:', error);
      }
    }
  
    const fetchEnquiry = async () => {
  try {
    // Change to use appraisal API instead of enquiry API
    const { appraisalAPI } = await import('@/lib/api');
    const response = await appraisalAPI.getAppraisalReport(enquiryId);
    
    if (response.data.success) {
      // Set the application data as enquiry
      setEnquiry(response.data.application);
    } else {
      console.error('Failed to fetch enquiry:', response.data.message);
      setEnquiry(null);
    }
  } catch (error) {
    console.error('Error fetching enquiry:', error);
    setEnquiry(null);
  } finally {
    setLoading(false);
  }
};
  
    fetchEnquiry();
  }, [enquiryId]);

  const handleBack = () => {
    // Clean up localStorage when going back
    localStorage.removeItem('selectedEnquiry');
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Appraisal Report...</p>
        </div>
      </div>
    );
  }

  if (!enquiry && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Enquiry Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The requested enquiry could not be found or may have been removed."}
          </p>
          <button 
            onClick={handleBack}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            Back to All Enquiries
          </button>
        </div>
      </div>
    );
  }

  return (
    <AppraisalReport 
      enquiry={enquiry}
      onBack={handleBack}
      mode="appraisal" 
    />
  );
}