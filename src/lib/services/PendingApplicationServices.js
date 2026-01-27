"use client";
import api from "@/utils/axiosInstance";
import { getStatusName, getStatusId } from "@/utils/applicationStatus";
import fileService from "./fileService";

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

    sendPendingEmail: async (applicationId) => {
        try {
            const endpoints = [
                `/crm/email/pending/email/${applicationId}`,
            ];

            let response;
            let lastError;

            for (const endpoint of endpoints) {
                try {
                    response = await api.get(endpoint);
                    console.log("✅ Email sent successfully:", response.data);
                    
                    // Ensure we return the response data properly
                    return {
                        success: true,
                        message: response.data.message || "Email sent successfully",
                        data: response.data.data || response.data
                    };
                } catch (error) {
                    lastError = error;
                    console.log(`❌ Endpoint failed: ${endpoint}`, error.response?.status);
                    continue;
                }
            }

            throw lastError;
        } catch (error) {
            console.error("📧 Email sending error:", error);
            // Return a structured error response
            return {
                success: false,
                message: error.response?.data?.message || "Failed to send email",
                error: error
            };
        }
    }
};

export const formatApplicationForUI = (application) => {
    const permanentAddress = application.address || 
                           `${application.house_no || ''}, ${application.city || ''}, ${application.state || ''} - ${application.pincode || ''}`.trim();

    const loanStatus = getStatusName(application.loan_status);
    const enquiryDate = application.enquiry_date ? new Date(application.enquiry_date) : null;

    
    return {
        // Basic identifiers
        id: application.application_id,
        srNo: application.application_id,
        enquirySource: application.enquiry_type || 'N/A',
        crnNo: application.crnno,
        accountId: application.accountId,
        userId: application.user_id,
        user_id: application.user_id,

        // Date and time
        enquiryDate: enquiryDate ? enquiryDate.toLocaleDateString('en-GB') : 'N/A',

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
        hasSecondBankStatement: !!application.second_bank_statement,
        hasBankFraudReport: !!application.bank_fraud_report,

        // Document file names - ONLY NECESSARY ONES
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
        secondBankStatementFileName: application.second_bank_statement,
        bankFraudReportFileName: application.bank_fraud_report,

        // Status and approval information
        approvalNote: application.approval_note,
        status: loanStatus,
        loanStatus: loanStatus,

        // Application stage information
        verify: application.verify,
        isVerified: application.verify === 1,
        isReportChecked: application.report_check === 1,
        isFinalStage: application.verify === 1 && application.report_check === 1,
        verifyStatus: application.verify,
        reportCheckStatus: application.report_check,

        // Final report information
        hasAppraisalReport: !!application.totl_final_report,
        finalReportStatus: application.totl_final_report,
        isRecommended: application.totl_final_report === "Recommended",

        // Button visibility flags
        showActionButton: true,
        showAppraisalButton: true,
        showEligibilityButton: true,

        // Mail information
        mailCounter: application.mail_counter || application.mailCounter || 0,
        mailerDate: application.mailer_date || null,

        // Timestamps
        createdAt: application.created_at,
        updatedAt: application.updated_at
    };
};

export const getLoanStatusText = (status) => {
    return getStatusName(status);
};

export { fileService };