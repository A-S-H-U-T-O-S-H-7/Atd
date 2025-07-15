"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ApplicationForm from "@/components/Admin/all-enquiries/application-form/ApplicationForm";

export default function VerifyPage() {
  const params = useParams();
  const router = useRouter();
  const enquiryId = params.id;
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get enquiry data from localStorage first
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

    // Fallback: Define the same enquiries data as in AllEnquiries component
    const sampleEnquiries = [
      {
        id: 1,
        srNo: 1,
        enquirySource: "Website",
        crnNo: "CRN001234",
        accountId: "ACC001",
        enquiryDate: "2024-06-20",
        enquiryTime: "10:30 AM",
        name: "RAJESH KUMAR SHARMA",
        firstName: "RAJESH",
        lastName: "SHARMA",
        currentAddress: "123 MG Road, Bangalore",
        currentState: "Karnataka",
        currentCity: "Bangalore",
        address: "456 Park Street, Delhi",
        state: "Delhi",
        city: "New Delhi",
        phoneNo: "9876543210",
        email: "rajesh.sharma@gmail.com",
        appliedLoan: "4000",
        loanAmount: "5,00,000",
        roi: "12.5%",
        tenure: "24 months",
        loanTerm: "Short Term",
        grossSalary: "80000",
        netSalary: "65000",
        hasPhoto: true,
        hasPanCard: true,
        hasAddressProof: true,
        hasIdProof: true,
        hasSalaryProof: false,
        hasBankStatement: true,
        hasBankVerificationReport: true,
        hasSocialScoreReport: false,
        hasCibilScoreReport: true,
        approvalNote: "Pending verification",
        status: "Pending",
        hasAppraisalReport: false,
        eligibility: "Eligible"
      },
      {
        id: 2,
        srNo: 2,
        enquirySource: "Mobile App",
        crnNo: "CRN001235",
        accountId: "ACC002",
        enquiryDate: "2024-06-21",
        enquiryTime: "02:15 PM",
        name: "PRIYA SINGH PATEL",
        firstName: "PRIYA",
        lastName: "PATEL",
        currentAddress: "789 Brigade Road, Bangalore",
        currentState: "Karnataka",
        currentCity: "Bangalore",
        address: "321 Sector 15, Noida",
        state: "Uttar Pradesh",
        city: "Noida",
        phoneNo: "9765432109",
        email: "priya.patel@gmail.com",
        appliedLoan: "10000",
        loanAmount: "25,00,000",
        roi: "8.75%",
        tenure: "240 months",
        loanTerm: "Long Term",
        grossSalary: "120000",
        netSalary: "95000",
        hasPhoto: true,
        hasPanCard: true,
        hasAddressProof: true,
        hasIdProof: true,
        hasSalaryProof: true,
        hasBankStatement: true,
        hasBankVerificationReport: true,
        hasSocialScoreReport: true,
        hasCibilScoreReport: true,
        approvalNote: "Documents verified",
        status: "Approved",
        hasAppraisalReport: true,
        eligibility: "Eligible"
      }
    ];
    
    const foundEnquiry = sampleEnquiries.find(enq => enq.id === parseInt(enquiryId));
    setEnquiry(foundEnquiry);
    setLoading(false);
  }, [enquiryId]);

  const handleBack = () => {
    // Clean up localStorage when going back
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
    <ApplicationForm 
      enquiry={enquiry}
      onBack={handleBack}
      mode="verify" 
    />
  );
}