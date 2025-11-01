export const formatAmount = (value) => {
  // Handle null, undefined, or empty values
  if (value === null || value === undefined || value === '') {
    return '';
  }
  
  const stringValue = String(value);
  
  const numericValue = stringValue.replace(/[^0-9.]/g, "");

  // Format with commas for thousands
  if (numericValue) {
    const parts = numericValue.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  return numericValue;
};