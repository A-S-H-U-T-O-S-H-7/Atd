"use client";
import api from "@/utils/axiosInstance";

export const enquiryAPI = {
    getAllEnquiries: (params = {}) => {
        return api.get("/crm/application/all-application", { params });
    },

    exportEnquiries: (params = {}) => {
        return api.get("/crm/application/export/all-application", { params });
    },

    getApplicationForEdit: (id) => {
        return api.get(`/crm/application/edit/${id}`);
    },

    updateApplication: (id, data) => {
        return api.put(`/crm/application/update/${id}`, data);
    }
}; 

export const enachAPI = {
    getBankList: () => {
        return api.get("/enach-bank");
    },

    getBankModes: (bankName) => {
        return api.get(`/enach-bank/${encodeURIComponent(bankName)}`);
    },

    getBankCode: (modeId) => {
        return api.get(`/enach-bank/bank-code/${modeId}`);
    }
};

export const locationAPI = {
    getStates: () => {
        return api.get("/states");
    },

    getCities: (stateName) => {
        return api.get(`/cities?state=${encodeURIComponent(stateName)}`);
    }
};

// Get appraisal PDF
   export const AppraisalPDF = {
    getAppraisalPDF: (applicationId) => {
        return api.get(`/crm/appraisal/pdf/${applicationId}`, {
            responseType: 'blob' 
        });
    },
};


export const formatEnquiryForUI = (enquiry) => {
    return {
        // Basic identifiers
        id: enquiry.application_id,
        srNo: enquiry.application_id,
        enquirySource: enquiry.enquiry_type,
        crnNo: enquiry.crnno,
        accountId: enquiry.accountId,

        // Date and time
        enquiryDate: enquiry.created_at ? new Date(enquiry.created_at).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
        enquiryTime: enquiry.created_at ? new Date(enquiry.created_at).toLocaleTimeString('en-GB') : new Date().toLocaleTimeString('en-GB'),

        // Personal information
        name: `${enquiry.fname} ${enquiry.lname}`,
        firstName: enquiry.fname,
        lastName: enquiry.lname,
        dob: enquiry.dob,
        gender: enquiry.gender,

        // Address information
        currentAddress: enquiry.current_address,
        currentState: enquiry.current_state,
        currentCity: enquiry.current_city,
        currentPincode: enquiry.current_pincode,
        currentHouseNo: enquiry.current_house_no,
        address: enquiry.address,
        state: enquiry.state,
        city: enquiry.city,
        pincode: enquiry.pincode,
        houseNo: enquiry.house_no,

        // Contact information
        phoneNo: enquiry.phone,
        email: enquiry.email,

        // Loan information
        appliedLoan: enquiry.applied_amount,
        loanAmount: enquiry.approved_amount,
        appliedAmount: enquiry.applied_amount,
        approvedAmount: enquiry.approved_amount,
        roi: `${enquiry.roi}%`,
        tenure: `${enquiry.tenure} days`,
        loanTerm: enquiry.loan_term === 4 ? "One Time Payment" : "Daily",

        // Document availability flags
        hasPhoto: !!enquiry.selfie,
        hasPanCard: !!enquiry.pan_proof,
        hasAddressProof: !!enquiry.address_proof,
        hasIdProof: !!enquiry.aadhar_proof,
        hasSalaryProof: !!enquiry.salary_slip,
        hasSecondSalaryProof: !!enquiry.second_salary_slip,
        hasThirdSalaryProof: !!enquiry.third_salary_slip,
        hasBankStatement: !!enquiry.bank_statement,
        hasBankVerificationReport: !!enquiry.bank_verif_report,
        hasSocialScoreReport: !!enquiry.social_score_report,
        hasCibilScoreReport: !!enquiry.cibil_score_report,

        //  Use the same property names that components expect
        selfie: enquiry.selfie, 
        pan_proof: enquiry.pan_proof, 
        address_proof: enquiry.address_proof, 
        aadhar_proof: enquiry.aadhar_proof, 
        salary_slip: enquiry.salary_slip, 
        second_salary_slip: enquiry.second_salary_slip, 
        third_salary_slip: enquiry.third_salary_slip, 
        bank_statement: enquiry.bank_statement, 
        bank_verif_report: enquiry.bank_verif_report, 
        social_score_report: enquiry.social_score_report, 
        cibil_score_report: enquiry.cibil_score_report, 

        // Status and approval information
        approvalNote: enquiry.approval_note,
        status: getEnquiryStatusText(enquiry.loan_status),
        loanStatus: enquiry.loan_status,

        // Application stage information
        isVerified: enquiry.verify === 1,
        isReportChecked: enquiry.report_check === 1,
        isFinalStage: enquiry.verify === 1 && enquiry.report_check === 1,
        verifyStatus: enquiry.verify,
        reportCheckStatus: enquiry.report_check,

        // Final report information
        hasAppraisalReport: !!enquiry.totl_final_report,
        finalReportStatus: enquiry.totl_final_report,
        isRecommended: enquiry.totl_final_report === "Recommended",

        // Mail information
        mailCounter: enquiry.mail_counter,
        mailerDate: enquiry.mailer_date,

        // Timestamps
        createdAt: enquiry.created_at,
        updatedAt: enquiry.updated_at
    };
};

const getEnquiryStatusText = (status) => {
    switch (Number(status)) {
        case 1: return "Pending";
        case 2: return "Approved";
        case 3: return "Rejected";
        default: return "Pending";
    }
};

export const getEnquiryStatusNumber = (status) => {
    switch (String(status).toLowerCase()) {
        case "pending": return 1;
        case "approved": return 2;
        case "rejected": return 3;
        default: return 1;
    }
};