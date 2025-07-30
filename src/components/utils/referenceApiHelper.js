export const transformToApiFormat = (formData, phoneData) => {
    const apiData = {
      step: 6,
      // provider: 1,
      // userid: phoneData.userid,
    };
  
    if (Array.isArray(formData.references)) {
      formData.references.forEach((reference, index) => {
        const refNumber = index + 1;
        apiData[`refname_${refNumber}`] = reference.name || "";
        apiData[`refphone_${refNumber}`] = parseInt(reference.phone) || "";
        apiData[`refemail_${refNumber}`] = reference.email || "";
      });
    }
  
    return apiData;
  };
  
  export const formatPhoneNumber = (value) => {
    if (typeof value !== 'string') return '';
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue.slice(0, 10);
  };
  