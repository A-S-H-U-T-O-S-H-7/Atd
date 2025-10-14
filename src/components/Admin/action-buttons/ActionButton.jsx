const ActionButton = ({ 
  enquiry, 
  isDark, 
  onVerifyClick 
}) => {
  const buttonBase = "px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 border";
  const buttonBlue = isDark
    ? "bg-blue-800/50 hover:bg-blue-800 text-blue-200"
    : "bg-blue-200 hover:bg-blue-300 text-blue-800";

  if (enquiry.isFinalStage) {
    return (
      <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs">
        Final Stage
      </span>
    );
  }

  return (
    <button
      onClick={() => onVerifyClick(enquiry)}
      className={`${buttonBase} ${buttonBlue}`}
    >
      Verify
    </button>
  );
};

export default ActionButton;