"use client";
import api from "@/utils/axiosInstance";

export const pendingApplicationAPI = {
    // Get all pending applications with filters
    getPendingApplications: async (params = {}) => {
        try {  
            const response = await api.get("/crm/application/pending", { params });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Export pending applications
    exportPendingApplications: async (params = {}) => {
        try {
            const response = await api.get("/crm/application/export/pending", { params });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Send pending email
    sendPendingEmail: async (applicationId) => {
        try {
            const endpoints = [
                `/crm/email/pending/email/${applicationId}`,
                `/crm/application/send-email/${applicationId}`,
                `/crm/application/${applicationId}/send-email`
            ];

            let response;
            let lastError;

            for (const endpoint of endpoints) {
                try {
                    response = await api.get(endpoint);
                    console.log("✅ Email sent successfully:", response.data);
                    return response.data;
                } catch (error) {
                    lastError = error;
                    console.log(`❌ Endpoint failed: ${endpoint}`, error.response?.status);
                    continue;
                }
            }

            throw lastError;
        } catch (error) {
            console.error("📧 Email sending error:", error);
            throw error;
        }
    }
};

// Use the same status mapping as completed applications
export const APPLICATION_STATUS = {
  PENDING: { id: 1, name: "Pending" },
  COMPLETED: { id: 2, name: "Completed" },
  REJECTED: { id: 3, name: "Rejected" },
  FOLLOW_UP: { id: 4, name: "Follow Up" },
  PROCESSING: { id: 5, name: "Processing" },
  SANCTION: { id: 6, name: "Sanction" },
  READY_TO_VERIFY: { id: 7, name: "Ready To Verify" },
  READY_TO_DISBURSED: { id: 8, name: "Ready To Disbursed" },
  DISBURSED: { id: 9, name: "Disbursed" },
  TRANSACTION: { id: 10, name: "Transaction" },
  COLLECTION: { id: 11, name: "Collection" },
  RE_COLLECTION: { id: 12, name: "Re-Collection" },
  CLOSED: { id: 13, name: "Closed" },
  DEFAULTER: { id: 14, name: "Defaulter" },
  CANCELLED: { id: 15, name: "Cancelled" },
  CLOSED_BY_ADMIN: { id: 16, name: "Closed By Admin" },
  RETURN: { id: 17, name: "Return" },
  RENEWAL: { id: 18, name: "Renewal" },
  EMI: { id: 19, name: "EMI" }
};

export const formatApplicationForUI = (application) => {
    const permanentAddress = application.address || 
                           `${application.house_no || ''}, ${application.city || ''}, ${application.state || ''} - ${application.pincode || ''}`.trim();

    const loanStatus = getStatusName(application.loan_status);
    
    return {
        // Basic identifiers
        id: application.application_id,
        srNo: application.application_id,
        enquirySource: application.enquiry_type || 'N/A',
        crnNo: application.crnno,
        accountId: application.accountId,

        // Date and time
        enquiryDate: application.created_at ? new Date(application.created_at).toLocaleDateString('en-GB') : 
                    new Date().toLocaleDateString('en-GB'),

        // Personal information
        name: application.name,
        firstName: application.fname || application.name?.split(' ')[0] || '',
        lastName: application.lname || application.name?.split(' ').slice(1).join(' ') || '',
        dob: application.dob,
        gender: application.gender,

        // Address information
        permanentAddress: permanentAddress,
        state: application.state,
        city: application.city,
        pincode: application.pincode,
        houseNo: application.house_no,

        // Contact information
        phoneNo: application.phone,
        email: application.email || 'N/A',

        // Loan information
        appliedLoan: application.applied_amount,
        approvedAmount: application.approved_amount,
        roi: application.roi,
        tenure: application.tenure,
        loanTerm: application.loan_term === 4 ? "One Time Payment" : "Daily",

        // Document availability flags
        hasPhoto: !!application.selfie,
        hasPanCard: !!application.pan_proof,
        hasAddressProof: !!application.address_proof,
        hasIdProof: !!application.aadhar_proof,
        hasSalaryProof: !!application.salary_slip,
        hasSecondSalaryProof: !!application.second_salary_slip,
        hasThirdSalaryProof: !!application.third_salary_slip,
        hasBankStatement: !!application.bank_statement,
        hasBankVerificationReport: !!application.bank_verif_report,
        hasSocialScoreReport: !!application.social_score_report,
        hasCibilScoreReport: !!application.cibil_score_report,

        // Document file names
        photoFileName: application.selfie,
        panCardFileName: application.pan_proof,
        addressProofFileName: application.address_proof,
        idProofFileName: application.aadhar_proof,
        salarySlip1: application.salary_slip,
        salarySlip2: application.second_salary_slip,
        salarySlip3: application.third_salary_slip,
        bankStatementFileName: application.bank_statement,
        bankVerificationFileName: application.bank_verif_report,
        socialScoreFileName: application.social_score_report,
        cibilScoreFileName: application.cibil_score_report,

        // Status and approval information - FIXED with consistent mapping
        approvalNote: application.approval_note,
        status: loanStatus,
        loanStatus: loanStatus,

        // Application stage information
        isVerified: application.verify === 1,
        isReportChecked: application.report_check === 1,
        isFinalStage: application.verify === 1 && application.report_check === 1,
        verifyStatus: application.verify,
        reportCheckStatus: application.report_check,

        // Final report information
        hasAppraisalReport: !!application.totl_final_report,
        finalReportStatus: application.totl_final_report,
        isRecommended: application.totl_final_report === "Recommended",

        // Button visibility flags - IMPORTANT: Set these to true for pending applications
        showActionButton: true,
        showAppraisalButton: true,
        showEligibilityButton: true,

        // Mail information
        mailCounter: application.mail_counter,
        mailerDate: application.mailer_date,

        // Timestamps
        createdAt: application.created_at,
        updatedAt: application.updated_at
    };
};

// Get status name from ID using the shared APPLICATION_STATUS
const getStatusName = (statusId) => {
    const status = Object.values(APPLICATION_STATUS).find(s => s.id === Number(statusId));
    return status ? status.name : "Pending"; 
};

// Get status ID from name
export const getStatusId = (statusName) => {
    const status = Object.values(APPLICATION_STATUS).find(s => 
        s.name.toLowerCase() === statusName.toLowerCase()
    );
    return status ? status.id : 1;
};

// For backward compatibility
export const getLoanStatusText = (status) => {
    return getStatusName(status);
};