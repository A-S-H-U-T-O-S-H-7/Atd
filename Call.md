{
    "success": true,
    "message": "Collection reporting fetched successfully",
    "data": [
        {
            "collection_date": "2025-12-04T18:30:00.000000Z",
            "crnno": "S01AM126",
            "loan_no": "ATDAM00001",
            "fullname": "Satyendra Vishwakarma",
            "admin_fee": "500.00",
            "gst": "43.00",
            "sanction_amount": "45000.00",
            "disburse_date": "2025-10-31T18:30:00.000000Z",
            "transaction_date": "2025-11-01T18:30:00.000000Z",
            "due_date": "2025-11-30T18:30:00.000000Z",
            "interest": "1200.00",
            "penality": "200.00",
            "penal_interest": "50.00",
            "penal_interest_gst": "18.00",
            "renewal_charge": "45000.00",
            "renewal_charge_gst": "45000.00",
            "bounce_charge": "300.00",
            "collection_amount": "46768.00",
            "total_due_amount": "46768.00",
            "collection_by": "Satyendra Vishwakarma"
        }
    ],
    "pagination": {
        "total": 1,
        "current_page": 1,
        "per_page": 10,
        "total_pages": 1
    }
}

const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5hdGRtb25leS5pbi9hcGkvY3JtL2xvZ2luIiwiaWF0IjoxNzYyNTExMzczLCJleHAiOjE3NjQzMTEzNzMsIm5iZiI6MTc2MjUxMTM3MywianRpIjoiUlZDTHVVeDU2UWNES3lUQiIsInN1YiI6IjY4IiwicHJ2IjoiZGY4ODNkYjk3YmQwNWVmOGZmODUwODJkNjg2YzQ1ZTgzMmU1OTNhOSJ9.G4I5BfSxVk-SXmjme_6Nu_mZ7MjiXyeb762XZm9ubrE");
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "sanction_amount": 45000,
  "disburse_date": "2025-11-01",
  "transaction_date": "2025-11-02",
  "due_date": "2025-12-01",
  "principal_amount": 45000,
  "process_fee": 500,
  "interest": 1200,
  "due_amount": 46200,
  "collection_date": "2025-12-05",
  "panality": 200,
  "panality_interest": 50,
  "penal_interest_gst": 18,
  "bounce_charge": 300,
  "total_due_amount": 46768,
  "collection_bank_name": 20,
  "disbursed_bank": "ICICI Bank",
  "collected_amount": 46768,
  "collected_transaction_id": "TXN123456789",
  "collection_by": "by bank"
});

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.atdmoney.in/api/crm/collection/export?search_by&search_value&from_date&to_date", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  {
    "success": true,
    "message": "Collection reporting export successfully",
    "data": [
        {
            "collection_date": "2025-12-04T18:30:00.000000Z",
            "crnno": "S01AM126",
            "loan_no": "ATDAM00001",
            "fullname": "Satyendra Vishwakarma",
            "admin_fee": "500.00",
            "gst": "43.00",
            "sanction_amount": "45000.00",
            "disburse_date": "2025-10-31T18:30:00.000000Z",
            "transaction_date": "2025-11-01T18:30:00.000000Z",
            "due_date": "2025-11-30T18:30:00.000000Z",
            "interest": "1200.00",
            "penality": "200.00",
            "penal_interest": "50.00",
            "penal_interest_gst": "18.00",
            "renewal_charge": "45000.00",
            "renewal_charge_gst": "45000.00",
            "bounce_charge": "300.00",
            "collection_amount": "46768.00",
            "total_due_amount": "46768.00",
            "collection_by": "Satyendra Vishwakarma"
        }
    ]
}

Export Collection reporting api