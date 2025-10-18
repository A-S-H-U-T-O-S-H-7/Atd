const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5hdGRtb25leS5pbi9hcGkvY3JtL2xvZ2luIiwiaWF0IjoxNzU5ODMwMzIyLCJleHAiOjE3NjE2MzAzMjIsIm5iZiI6MTc1OTgzMDMyMiwianRpIjoiOVJFT2RDSUhoSnpYWUVMaSIsInN1YiI6IjY4IiwicHJ2IjoiZGY4ODNkYjk3YmQwNWVmOGZmODUwODJkNjg2YzQ1ZTgzMmU1OTNhOSJ9.a53o67CNZJmEAvfHqf_ZmGk6dxl8scHlDP3srvEt1Nc");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.atdmoney.in/api/crm/appraisal/edit/89", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  {
    {
    "success": true,
    "message": "Appraisal report data fetched successfully.",
    "application": {
        "user_id": 176,
        "crnno": "D07AL615",
        "accountId": "ATDFSLD07AL615OCTOBER2025",
        "fname": "DEEPAK KUMAR",
        "lname": "JHA",
        "dob": "1989-11-07",
        "gender": "Male",
        "fathername": "Parshuram Vishwakarma",
        "phone": "9910546615",
        "email": "deepak.atdpl@gmail.com",
        "alt_email": null,
        "pan_no": "ALBPJ7204M",
        "aadhar_no": "897307674862",
        "ref_name": "Vikas",
        "ref_address": "Greater Noida Uttar Pradesh",
        "ref_mobile": "9999589210",
        "ref_email": "vikash3344@gmail.com",
        "ref_relation": "Brother",
        "earn_points": 0,
        "redeem_points": 0,
        "house_no": "A 31  KULESARA",
        "address": "56, New Ashok Nagar",
        "state": "Uttar Pradesh",
        "city": "Gautam Buddh Nagar",
        "pincode": "201306",
        "current_house_no": "A 31  KULESARA",
        "current_address": "56, New Ashok Nagari",
        "current_city": "Gautam Buddh Nagar",
        "current_state": "Uttar Pradesh",
        "current_pincode": "201306",
        "application_id": 89,
        "loan_no": null,
        "applied_amount": "50000.00",
        "approved_amount": "5000.00",
        "roi": "0.067",
        "tenure": 90,
        "loan_term": 4,
        "dw_collection": null,
        "emi_collection": null,
        "grace_period": 3,
        "process_fee": null,
        "approved_date": null,
        "address_id": 89,
        "approval_note": "NEW CUSTOMER",
        "bank_name": "State Bank of India",
        "branch_name": "BHANGEL, NOIDA",
        "account_type": "SAVING",
        "account_no": "33102832769",
        "ifsc_code": "SBIN0016740",
        "bankVerif": 0,
        "organisation_name": "ALL TIME DATA PVT LTD",
        "organisation_address": "C-316 SECTOR-10 NOIDA",
        "office_phone": "01204348458",
        "contact_person": "Veenu",
        "mobile_no": "9999589202",
        "website": "www.atdgroup.in",
        "hr_mail": "vinu@atdfinance.in",
        "designation": "Account Manager",
        "work_since_mm": "9",
        "work_since_yy": "2014",
        "gross_monthly_salary": "70000.00",
        "net_monthly_salary": "70000.00",
        "net_house_hold_income": "150000.00",
        "official_email": "deepak@atdfinance.in",
        "existing_emi": "10000.00",
        "maxlimit": "10000.00",
        "salary_slip": "1759554098887-xov2lnsk9ie.jpg",
        "second_salary_slip": "1759554113734-oltjnf2ardn.jpg",
        "third_salary_slip": "1759554209104-qzuoizb7ruq.pdf",
        "bank_statement": "1759554155507-y4zvgaz2ees.pdf"
    },
    "appraisal": {
        "applicationId": 89,
        "id": 2,
        "application_id": 89,
        "personal_phone": "Yes",
        "phone_status": "Positive",
        "personal_pan": "Yes",
        "pan_status": "Positive",
        "personal_aadhar": "Yes",
        "aadhar_status": null,
        "personal_ref_name": "Yes",
        "personal_ref_mobile": "Yes",
        "personal_ref_email": "Yes",
        "personal_ref_relation": "Yes",
        "PerRemark": "Ok this in actual customer",
        "personal_final_report": "Positive",
        "personal_verified": null,
        "organization_applied": "Yes",
        "organization_applied_status": "Positive",
        "gross_amount_salary": "Yes",
        "gross_amount_salary_status": "Positive",
        "net_amount_salary": "Yes",
        "net_amount_salary_status": "Positive",
        "SalaryRemark": "Salary transfer on time",
        "salaryslip_final_report": "Positive",
        "salslip_verified": null,
        "online_verification": "Yes",
        "online_verification_status": "Positive",
        "company_phone": "Yes",
        "company_phone_status": "Positive",
        "company_mobile": "Yes",
        "company_mobile_status": "Positive",
        "website_status": null,
        "contact_status": "Yes",
        "hr_mail": "Yes",
        "hr_mail_status": "Positive",
        "hr_email_sent": null,
        "OrganizationRemark": "I have check company ok",
        "organization_final_report": "Positive",
        "organization_verified": null,
        "auto_verification": "Yes",
        "auto_verification_status": "Positive",
        "is_salary_account": "Yes",
        "is_salary_account_status": "Positive",
        "regural_interval": "Yes",
        "regural_interval_status": "Positive",
        "salary_date": "2025-06-02",
        "salary_remark": null,
        "avail_amenities": "Electricity",
        "ava_assets": "Land",
        "primary_income": "Agriculture & allied activities",
        "nature_of_work": "Self-employed",
        "frequency_income": "Daily",
        "month_employment_last_one_year": "56",
        "self_reported_monthly_income": "50000",
        "average_monthly_income": "562554",
        "monthly_salary_date": "04-07-2025",
        "emi_debit": "No",
        "emi_amount": "5000",
        "emi_with_bank_statement": "Yes",
        "BankRemark": "Ok bank statement",
        "bankstatement_final_report": "Positive",
        "bankstatement_verified": null,
        "social_score": "500",
        "social_score_status": "Positive",
        "social_score_suggestion": "Recommended",
        "SocialRemark": "Good",
        "socialscore_final_report": "Positive",
        "social_score_verified": null,
        "cibil_score": "785",
        "score_status": "Positive",
        "total_active_amount": "5000",
        "total_active_amount_status": "Positive",
        "total_closed_amount": "6000",
        "total_closed_amount_status": "Positive",
        "write_off_settled": "5000",
        "write_off_settled_status": "Positive",
        "overdue": "50000",
        "overdue_status": "Positive",
        "total_emi_cibil": "10000",
        "comment": "Ok",
        "dpd": "Nil",
        "dpd_status": "Positive",
        "CibilRemark": "OK",
        "cibil_final_report": "Positive",
        "cibil_score_verified": null,
        "alternate_no1": "9569584126",
        "alternate_no2": "9971734401",
        "admin_id": 68,
        "created_at": "2025-10-10T07:43:55.000000Z",
        "updated_at": "2025-10-10T09:40:43.000000Z",
        "verified_by": "Satyendra Vishwakarma"
    },
    "householdincome": [
        {
            "id": 3,
            "house_holder_family": "Mother",
            "nature_of_work": "Salaried",
            "contact_no": "9569584126",
            "annual_income": "100000.00"
        },
        {
            "id": 4,
            "house_holder_family": "Mother",
            "nature_of_work": "Salaried",
            "contact_no": "9569584126",
            "annual_income": "100000.00"
        },
        {
            "id": 5,
            "house_holder_family": "Mother",
            "nature_of_work": "Salaried",
            "contact_no": "9569584126",
            "annual_income": "100000.00"
        },
        {
            "id": 6,
            "house_holder_family": "Mother",
            "nature_of_work": "Salaried",
            "contact_no": "9569584126",
            "annual_income": "100000.00"
        },
        {
            "id": 7,
            "house_holder_family": "Mother",
            "nature_of_work": "Salaried",
            "contact_no": "9569584126",
            "annual_income": "100000.00"
        },
        {
            "id": 8,
            "house_holder_family": "Mother",
            "nature_of_work": "Salaried",
            "contact_no": "9569584126",
            "annual_income": "100000.00"
        },
        {
            "id": 9,
            "house_holder_family": "Mother",
            "nature_of_work": "Salaried",
            "contact_no": "9569584126",
            "annual_income": "100000.00"
        },
        {
            "id": 10,
            "house_holder_family": "Mother",
            "nature_of_work": "Salaried",
            "contact_no": "9569584126",
            "annual_income": "100000.00"
        },
        {
            "id": 11,
            "house_holder_family": "Mother",
            "nature_of_work": "Salaried",
            "contact_no": "9569584126",
            "annual_income": "100000.00"
        },
        {
            "id": 12,
            "house_holder_family": "Mother",
            "nature_of_work": "Salaried",
            "contact_no": "9569584126",
            "annual_income": "100000.00"
        },
        {
            "id": 13,
            "house_holder_family": "Mother",
            "nature_of_work": "Salaried",
            "contact_no": "9569584126",
            "annual_income": "100000.00"
        },
        {
            "id": 14,
            "house_holder_family": "Mother",
            "nature_of_work": "Salaried",
            "contact_no": "9569584126",
            "annual_income": "100000.00"
        },
        {
            "id": 15,
            "house_holder_family": "Mother",
            "nature_of_work": "Salaried",
            "contact_no": "9569584126",
            "annual_income": "100000.00"
        }
    ]
}
 =====
const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5hdGRtb25leS5pbi9hcGkvY3JtL2xvZ2luIiwiaWF0IjoxNzU5ODMwMzIyLCJleHAiOjE3NjE2MzAzMjIsIm5iZiI6MTc1OTgzMDMyMiwianRpIjoiOVJFT2RDSUhoSnpYWUVMaSIsInN1YiI6IjY4IiwicHJ2IjoiZGY4ODNkYjk3YmQwNWVmOGZmODUwODJkNjg2YzQ1ZTgzMmU1OTNhOSJ9.a53o67CNZJmEAvfHqf_ZmGk6dxl8scHlDP3srvEt1Nc");
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "application_id": 89,
  "total_final_report": "Recommended"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.atdmoney.in/api/crm/appraisal/final-verification", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

  ====
  const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5hdGRtb25leS5pbi9hcGkvY3JtL2xvZ2luIiwiaWF0IjoxNzU5ODMwMzIyLCJleHAiOjE3NjE2MzAzMjIsIm5iZiI6MTc1OTgzMDMyMiwianRpIjoiOVJFT2RDSUhoSnpYWUVMaSIsInN1YiI6IjY4IiwicHJ2IjoiZGY4ODNkYjk3YmQwNWVmOGZmODUwODJkNjg2YzQ1ZTgzMmU1OTNhOSJ9.a53o67CNZJmEAvfHqf_ZmGk6dxl8scHlDP3srvEt1Nc");
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "application_id": 89,
  "remark": "Due to resignation"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.atdmoney.in/api/crm/appraisal/reject", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));