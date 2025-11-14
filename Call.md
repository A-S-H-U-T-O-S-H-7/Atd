const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5hdGRtb25leS5pbi9hcGkvY3JtL2xvZ2luIiwiaWF0IjoxNzYyNTExMzczLCJleHAiOjE3NjQzMTEzNzMsIm5iZiI6MTc2MjUxMTM3MywianRpIjoiUlZDTHVVeDU2UWNES3lUQiIsInN1YiI6IjY4IiwicHJ2IjoiZGY4ODNkYjk3YmQwNWVmOGZmODUwODJkNjg2YzQ1ZTgzMmU1OTNhOSJ9.G4I5BfSxVk-SXmjme_6Nu_mZ7MjiXyeb762XZm9ubrE");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.atdmoney.in/api/crm/collection/get/2", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  {
    "success": true,
    "message": "Collection details fetched successfully.",
    "data": {
        "approved_amount": "12000.00",
        "roi": "0.067",
        "tenure": 30,
        "dw_collection": "12241.00",
        "emi_collection": "12241.00",
        "grace_period": 7,
        "process_percent": null,
        "process_fee": "1560.00",
        "gst": "281.00",
        "loan_status": 9,
        "disburse_date": "2025-11-13",
        "transaction_date": "2025-11-07",
        "duedate": "2025-12-01",
        "disburse_amount": "10500.00",
        "ledger_balance": "0.00",
        "bank_name": "ICICI banks-A/c-5399",
        "total_collection": "0.00",
        "total_penalty_paid": "0.00",
        "total_penal_interest_paid": "0.00",
        "total_bounce_charges_paid": "0.00",
        "last_collection_date": null,
        "overdue_days": -17,
        "has_overdue_payment": 0
    }
}
