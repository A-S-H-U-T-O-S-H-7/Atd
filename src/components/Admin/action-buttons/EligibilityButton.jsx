const EligibilityButton = ({ 
  enquiry, 
  isDark, 
  onLoanEligibilityClick 
}) => {
  const buttonBase = "px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 border";
  const buttonTeal = isDark
    ? "bg-teal-900/50 hover:bg-teal-800 text-teal-300"
    : "bg-teal-100 hover:bg-teal-200 text-teal-700";

  return (
    <button
      onClick={() => onLoanEligibilityClick(enquiry)}
      className={`${buttonBase} ${buttonTeal}`}
    >
      Eligibility
    </button>
  );
};

export default EligibilityButton;