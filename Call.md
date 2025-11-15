const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5hdGRtb25leS5pbi9hcGkvY3JtL2xvZ2luIiwiaWF0IjoxNzYyNTExMzczLCJleHAiOjE3NjQzMTEzNzMsIm5iZiI6MTc2MjUxMTM3MywianRpIjoiUlZDTHVVeDU2UWNES3lUQiIsInN1YiI6IjY4IiwicHJ2IjoiZGY4ODNkYjk3YmQwNWVmOGZmODUwODJkNjg2YzQ1ZTgzMmU1OTNhOSJ9.G4I5BfSxVk-SXmjme_6Nu_mZ7MjiXyeb762XZm9ubrE");
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "transaction_amount": 3000,
  "transaction_id": "ATD5544sddgfds4g",
  "transaction_date": "2025-11-07",
  "due_date": "2025-12-01",
  "atd_bank": 20,
  "atd_branch": "Sector-61, Noida"
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.atdmoney.in/api/crm/disbursement/transaction/manual/1", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  {
    "success": true,
    "message": "Manual transfer recorded successfully"
}

{
    "success": true,
    "message": "Disburse reporting fetched successfully",
    "data": [
        {
            "user_id": 1,
            "application_id": 1,
            "disburse_id": 1,
            "loan_no": "ATDAM00001",
            "disburse_date": "2025-11-15",
            "crnno": "S01AM126",
            "transaction_ref_no": "5454hjgvhjfhg",
            "transaction_date": "2025-11-15",
            "sanction_amount": "2000.00",
            "disburse_amount": "1760.00",
            "tenure": 120,
            "sender_acno": "ICICI banks-A\/c-5403",
            "sender_name": "ATD FINANCIAL SERVICES PVT LTD",
            "customer_ifsc": "ICIC0000017",
            "customer_ac_type": "Saving",
            "customer_ac": "001701578603",
            "customer_name": "Satyendra Vishwakarma",
            "transaction_narration": "Loan\/ATDAM00001"
        }
    ],
    "pagination": {
        "total": 1,
        "current_page": 1,
        "per_page": 10,
        "total_pages": 1
    }
}

response