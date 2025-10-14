// src/lib/utils/appraisalHelpers.js

// Format appraisal data from API response for UI
export const formatAppraisalForUI = (appraisalData) => {
    if (!appraisalData) return null;

    const { application, appraisal } = appraisalData;

    return {
        // Basic Application Info
        applicationId: application?.application_id,
        crnNo: application?.crnno,
        accountId: application?.accountId,
        
        // Personal Information
        personalInfo: {
            userId: application?.user_id,
            fullName: `${application?.fname || ''} ${application?.lname || ''}`.trim(),
            firstName: application?.fname,
            lastName: application?.lname,
            dob: application?.dob,
            gender: application?.gender,
            fatherName: application?.fathername,
            phone: application?.phone,
            email: application?.email,
            altEmail: application?.alt_email,
            panNo: application?.pan_no,
            aadharNo: application?.aadhar_no,
            refName: application?.ref_name,
            refAddress: application?.ref_address,
            refMobile: application?.ref_mobile,
            refEmail: application?.ref_email,
            refRelation: application?.ref_relation
        },

        // Loan Information
        loanInfo: {
            appliedAmount: application?.applied_amount,
            approvedAmount: application?.approved_amount,
            roi: application?.roi,
            tenure: application?.tenure,
            loanTerm: application?.loan_term,
            gracePeriod: application?.grace_period,
            processFee: application?.process_fee,
            approvedDate: application?.approved_date,
            approvalNote: application?.approval_note
        },

        // Bank Information
        bankInfo: {
            bankName: application?.bank_name,
            branchName: application?.branch_name,
            accountType: application?.account_type,
            accountNo: application?.account_no,
            ifscCode: application?.ifsc_code,
            bankVerif: application?.bankVerif
        },

        // Employment Information
        employmentInfo: {
            organisationName: application?.organisation_name,
            organisationAddress: application?.organisation_address,
            officePhone: application?.office_phone,
            contactPerson: application?.contact_person,
            mobileNo: application?.mobile_no,
            website: application?.website,
            hrMail: application?.hr_mail,
            designation: application?.designation,
            workSince: `${application?.work_since_mm || ''}/${application?.work_since_yy || ''}`,
            grossMonthlySalary: application?.gross_monthly_salary,
            netMonthlySalary: application?.net_monthly_salary,
            netHouseHoldIncome: application?.net_house_hold_income,
            officialEmail: application?.official_email,
            existingEmi: application?.existing_emi,
            maxLimit: application?.maxlimit
        },

        // Appraisal Data
        appraisal: {
            personal: {
                phone: appraisal?.personal_phone,
                phoneStatus: appraisal?.phone_status,
                pan: appraisal?.personal_pan,
                panStatus: appraisal?.pan_status,
                aadhar: appraisal?.personal_aadhar,
                aadharStatus: appraisal?.aadhar_status,
                refName: appraisal?.personal_ref_name,
                refMobile: appraisal?.personal_ref_mobile,
                refEmail: appraisal?.personal_ref_email,
                refRelation: appraisal?.personal_ref_relation,
                remarks: appraisal?.PerRemark,
                finalReport: appraisal?.personal_final_report,
                verified: appraisal?.personal_verified
            },
            salary: {
                organizationApplied: appraisal?.organization_applied,
                organizationAppliedStatus: appraisal?.organization_applied_status,
                grossAmountSalary: appraisal?.gross_amount_salary,
                grossAmountSalaryStatus: appraisal?.gross_amount_salary_status,
                netAmountSalary: appraisal?.net_amount_salary,
                netAmountSalaryStatus: appraisal?.net_amount_salary_status,
                remarks: appraisal?.SalaryRemark,
                finalReport: appraisal?.salaryslip_final_report,
                verified: appraisal?.salslip_verified,
                monthlySalaryDate: appraisal?.monthly_salary_date,
                availAmenities: appraisal?.avail_amenities,
                availableAssets: appraisal?.ava_assets,
                primaryIncome: appraisal?.primary_income,
                natureOfWork: appraisal?.nature_of_work,
                frequencyIncome: appraisal?.frequency_income,
                monthEmploymentLastOneYear: appraisal?.month_employment_last_one_year,
                selfReportedMonthlyIncome: appraisal?.self_reported_monthly_income,
                averageMonthlyIncome: appraisal?.average_monthly_income
            },
            organization: {
                onlineVerification: appraisal?.online_verification,
                onlineVerificationStatus: appraisal?.online_verification_status,
                companyPhone: appraisal?.company_phone,
                companyPhoneStatus: appraisal?.company_phone_status,
                companyMobile: appraisal?.company_mobile,
                companyMobileStatus: appraisal?.company_mobile_status,
                websiteStatus: appraisal?.website_status,
                contactStatus: appraisal?.contact_status,
                hrMail: appraisal?.hr_mail,
                hrMailStatus: appraisal?.hr_mail_status,
                hrEmailSent: appraisal?.hr_email_sent,
                remarks: appraisal?.OrganizationRemark,
                finalReport: appraisal?.organization_final_report,
                verified: appraisal?.organization_verified
            },
            bank: {
                autoVerification: appraisal?.auto_verification,
                autoVerificationStatus: appraisal?.auto_verification_status,
                isSalaryAccount: appraisal?.is_salary_account,
                isSalaryAccountStatus: appraisal?.is_salary_account_status,
                regularInterval: appraisal?.regural_interval,
                regularIntervalStatus: appraisal?.regural_interval_status,
                salaryDate: appraisal?.salary_date,
                salaryRemark: appraisal?.salary_remark,
                emiDebit: appraisal?.emi_debit,
                emiAmount: appraisal?.emi_amount,
                emiWithBankStatement: appraisal?.emi_with_bank_statement,
                remarks: appraisal?.BankRemark,
                finalReport: appraisal?.bankstatement_final_report,
                verified: appraisal?.bankstatement_verified
            },
            social: {
                socialScore: appraisal?.social_score,
                socialScoreStatus: appraisal?.social_score_status,
                socialScoreSuggestion: appraisal?.social_score_suggestion,
                remarks: appraisal?.SocialRemark,
                finalReport: appraisal?.socialscore_final_report,
                verified: appraisal?.social_score_verified
            },
            cibil: {
                cibilScore: appraisal?.cibil_score,
                scoreStatus: appraisal?.score_status,
                totalActiveAmount: appraisal?.total_active_amount,
                totalActiveAmountStatus: appraisal?.total_active_amount_status,
                totalClosedAmount: appraisal?.total_closed_amount,
                totalClosedAmountStatus: appraisal?.total_closed_amount_status,
                writeOffSettled: appraisal?.write_off_settled,
                writeOffSettledStatus: appraisal?.write_off_settled_status,
                overdue: appraisal?.overdue,
                overdueStatus: appraisal?.overdue_status,
                totalEmiCibil: appraisal?.total_emi_cibil,
                comment: appraisal?.comment,
                dpd: appraisal?.dpd,
                dpdStatus: appraisal?.dpd_status,
                remarks: appraisal?.CibilRemark,
                finalReport: appraisal?.cibil_final_report,
                verified: appraisal?.cibil_score_verified
            },
            alternateNumbers: {
                alternateNo1: appraisal?.alternate_no1,
                alternateNo2: appraisal?.alternate_no2
            }
        },

        // Admin and Timestamps
        adminInfo: {
            adminId: appraisal?.admin_id,
            verifiedBy: appraisal?.verified_by,
            createdAt: appraisal?.created_at,
            updatedAt: appraisal?.updated_at
        }
    };
};

// Helper function to get verification status text
export const getVerificationStatusText = (status) => {
    if (status === null || status === undefined) return "Pending";
    
    const statusStr = String(status).toLowerCase();
    
    if (statusStr === "positive") return "Verified";
    if (statusStr === "negative") return "Rejected";
    if (statusStr === "yes") return "Verified";
    if (statusStr === "no") return "Rejected";
    
    switch (Number(status)) {
        case 1: return "Verified";
        case 2: return "Rejected";
        case 0: 
        default: return "Pending";
    }
};

export const getVerificationStatusNumber = (status) => {
    const statusStr = String(status).toLowerCase();
    
    switch (statusStr) {
        case "verified":
        case "positive":
        case "yes":
        case "1": return 1;
        case "rejected":
        case "negative":
        case "no":
        case "2": return 2;
        case "pending":
        case "0":
        default: return 0;
    }
};

// Helper to check if all sections are verified
export const isAppraisalComplete = (appraisalData) => {
    const sections = [
        appraisalData?.appraisal?.personal?.finalReport,
        appraisalData?.appraisal?.salary?.finalReport,
        appraisalData?.appraisal?.organization?.finalReport,
        appraisalData?.appraisal?.bank?.finalReport,
        appraisalData?.appraisal?.social?.finalReport,
        appraisalData?.appraisal?.cibil?.finalReport
    ];

    return sections.every(section => 
        section && getVerificationStatusText(section) === "Verified"
    );
};

// Helper to calculate overall appraisal status
export const getOverallAppraisalStatus = (appraisalData) => {
    const sections = {
        personal: appraisalData?.appraisal?.personal?.finalReport,
        salary: appraisalData?.appraisal?.salary?.finalReport,
        organization: appraisalData?.appraisal?.organization?.finalReport,
        bank: appraisalData?.appraisal?.bank?.finalReport,
        social: appraisalData?.appraisal?.social?.finalReport,
        cibil: appraisalData?.appraisal?.cibil?.finalReport
    };

    const verifiedCount = Object.values(sections).filter(section => 
        section && getVerificationStatusText(section) === "Verified"
    ).length;

    const totalCount = Object.values(sections).filter(section => section !== undefined && section !== null).length;

    if (verifiedCount === totalCount && totalCount > 0) return "Completed";
    if (verifiedCount > 0) return "In Progress";
    return "Not Started";
};

// Helper to get section completion percentage
export const getAppraisalCompletionPercentage = (appraisalData) => {
    const sections = [
        appraisalData?.appraisal?.personal?.finalReport,
        appraisalData?.appraisal?.salary?.finalReport,
        appraisalData?.appraisal?.organization?.finalReport,
        appraisalData?.appraisal?.bank?.finalReport,
        appraisalData?.appraisal?.social?.finalReport,
        appraisalData?.appraisal?.cibil?.finalReport
    ];

    const completedSections = sections.filter(section => 
        section && getVerificationStatusText(section) === "Verified"
    ).length;

    return Math.round((completedSections / sections.length) * 100);
};