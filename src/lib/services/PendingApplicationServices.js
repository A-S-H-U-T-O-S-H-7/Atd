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

    // Send pending email - UPDATED ENDPOINT
    sendPendingEmail: async (applicationId) => {
        try {
            // Try different possible endpoints
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

            // If all endpoints failed
            throw lastError;

        } catch (error) {
            console.error("📧 Email sending error:", error);
            throw error;
        }
    }
};

// Format application data for UI
export const formatApplicationForUI = (application) => {
    
    // Create permanent address from available fields
    const permanentAddress = application.address || 
                           `${application.house_no || ''}, ${application.city || ''}, ${application.state || ''} - ${application.pincode || ''}`.trim();

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

        // Status and approval information
        approvalNote: application.approval_note,
        status: getLoanStatusText(application.loan_status),
        loanStatus: getLoanStatusText(application.loan_status),

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

        // Mail information
        mailCounter: application.mail_counter,
        mailerDate: application.mailer_date,

        // Timestamps
        createdAt: application.created_at,
        updatedAt: application.updated_at
    };
};

export const emailAPI = {
    // Send pending email
    sendPendingEmail: async (applicationId) => {
        try {
            const response = await api.get(`/crm/email/pending/email/${applicationId}`);
            return response;
        } catch (error) {
            console.error("Email sending error:", error);
            throw error;
        }
    }
};

// Get loan status text
const getLoanStatusText = (status) => {
    switch (Number(status)) {
        case 0: return "Pending";
        case 1: return "In Progress";
        case 2: return "Approved";
        case 3: return "Rejected";
        case 4: return "Disbursed";
        default: return "Pending";
    }
};

// Get status text (for backward compatibility)
const getStatusText = (status) => {
    return getLoanStatusText(status);
};

// Get status number from text
export const getStatusNumber = (status) => {
    switch (String(status).toLowerCase()) {
        case "pending": return 0;
        case "in progress": return 1;
        case "approved": return 2;
        case "rejected": return 3;
        case "disbursed": return 4;
        default: return 0;
    }
};