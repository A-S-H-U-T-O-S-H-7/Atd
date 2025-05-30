export const formatAmount = (value) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
  
    // Format with commas for thousands
    if (numericValue) {
      const parts = numericValue.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
    return numericValue;
  };