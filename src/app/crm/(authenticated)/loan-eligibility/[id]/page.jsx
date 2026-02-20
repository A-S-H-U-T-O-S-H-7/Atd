"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LoanEligibility from "@/components/Admin/all-enquiries/LoanEligibility";



export default function LoanEligibilityPage() {
  const params = useParams();
  const router = useRouter();
  const enquiryId = params.id;
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEnquiry = localStorage.getItem('selectedEnquiry');
    
    if (storedEnquiry) {
      try {
        const parsedEnquiry = JSON.parse(storedEnquiry);
        setEnquiry(parsedEnquiry);
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing stored enquiry:', error);
      }
    }
    
    setLoading(false);
  }, [enquiryId]);

  const handleBack = () => {
    localStorage.removeItem('selectedEnquiry');
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium">Enquiry not found</p>
          <button 
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <LoanEligibility 
      enquiry={enquiry}
    />
  );
}