"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AppraisalReport from "@/components/Admin/all-enquiries/appraisal-report/AppraisalReport";

export default function AppraisalReportPage() {
  const params = useParams();
  const router = useRouter();
  const enquiryId = params.enquiryId;
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
        eligibility: "Eligible",
        organizationName: "Tech Solutions Pvt Ltd",
        accountDetails: "Savings Account - SBI Main Branch",
        aadharNo: "1234-5678-9012",
        panNo: "ABCDE1234F",
        phoneNoVerified: true,
        ifscCode: "SBIN0001234"
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
        eligibility: "Eligible",
        organizationName: "Infosys Technologies Ltd",
        accountDetails: "Current Account - HDFC Bank",
        aadharNo: "9876-5432-1098",
        panNo: "FGHIJ5678K",
        phoneNoVerified: true,
        ifscCode: "HDFC0001234"
      },
      {
        id: 3,
        srNo: 3,
        enquirySource: "Branch Visit",
        crnNo: "CRN001236",
        accountId: "ACC003",
        enquiryDate: "2024-06-22",
        enquiryTime: "11:45 AM",
        name: "AMIT KUMAR GUPTA",
        firstName: "AMIT",
        lastName: "GUPTA",
        currentAddress: "456 Connaught Place, New Delhi",
        currentState: "Delhi",
        currentCity: "New Delhi",
        address: "789 Sector 21, Gurgaon",
        state: "Haryana",
        city: "Gurgaon",
        phoneNo: "9654321087",
        email: "amit.gupta@gmail.com",
        appliedLoan: "7500",
        loanAmount: "15,00,000",
        roi: "10.25%",
        tenure: "180 months",
        loanTerm: "Medium Term",
        grossSalary: "100000",
        netSalary: "78000",
        hasPhoto: true,
        hasPanCard: true,
        hasAddressProof: false,
        hasIdProof: true,
        hasSalaryProof: true,
        hasBankStatement: false,
        hasBankVerificationReport: true,
        hasSocialScoreReport: true,
        hasCibilScoreReport: false,
        approvalNote: "Under review",
        status: "In Progress",
        hasAppraisalReport: false,
        eligibility: "Under Review",
        organizationName: "Wipro Limited",
        accountDetails: "Salary Account - ICICI Bank",
        aadharNo: "5432-1098-7654",
        panNo: "KLMNO9876P",
        phoneNoVerified: false,
        ifscCode: "ICIC0001234"
      }
    ];
    
    const foundEnquiry = sampleEnquiries.find(enq => enq.id === parseInt(enquiryId));
    setEnquiry(foundEnquiry);
    setLoading(false);
  }, [enquiryId]);

  const handleBack = () => {
    // Clean up localStorage when going back
    localStorage.removeItem('selectedEnquiry');
    router.push("/crm/all-enquiries");
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

  if (!enquiry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Enquiry Not Found</h2>
          <p className="text-gray-600 mb-6">The requested enquiry could not be found or may have been removed.</p>
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
      mode="appraisal" // Pass mode to indicate this is for appraisal report
    />
  );
}