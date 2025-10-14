const AppraisalReportButton = ({ 
  enquiry, 
  isDark, 
  onFileView, 
  onCheckClick 
}) => {
  const buttonBase = "px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors duration-200 border";
  const buttonPink = isDark
    ? "bg-pink-900/50 hover:bg-pink-800 text-pink-300"
    : "bg-pink-100 hover:bg-pink-200 text-pink-700";

  if (enquiry.finalReportStatus === "Recommended") {
    return (
      <button
        onClick={() => onFileView(enquiry, enquiry.finalReportFile)}
        className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200 transition-colors"
      >
        View PDF
      </button>
    );
  }

  if (enquiry.isFinalStage) {
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs">
        Locked
      </span>
    );
  }

  return (
    <button
      onClick={() => onCheckClick(enquiry)}
      className={`${buttonBase} ${buttonPink}`}
    >
      Check
    </button>
  );
};

export default AppraisalReportButton;