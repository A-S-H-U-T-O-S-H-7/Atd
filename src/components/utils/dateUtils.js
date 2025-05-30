export const calculateWorkingYears = (startMonth, startYear) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const startDate = new Date(startYear, startMonth - 1);
    const diffInMonths = (currentYear - startYear) * 12 + (currentMonth - startMonth);
    
    return diffInMonths / 12;
  };