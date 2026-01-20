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

export const getStatusName = (statusId) => {
  const status = Object.values(APPLICATION_STATUS).find(s => s.id === Number(statusId));
  return status ? status.name : "Unknown";
};

export const getStatusId = (statusName) => {
  const status = Object.values(APPLICATION_STATUS).find(s => 
    s.name.toLowerCase() === statusName.toLowerCase()
  );
  return status ? status.id : 1; 
};