import api from "@/utils/axiosInstance";

export const tallyExportAPI = {
  getTallyExportDirect: async (params = {}) => {
    try {
      // Set responseType to 'blob' for binary/Excel file
      const response = await api.post("crm/tally-ledger-export", params, {
        responseType: 'blob', // Important for file download
        headers: {
          'Accept': 'application/vnd.ms-excel, application/json'
        }
      });
      
      // Check if response is blob (Excel file)
      if (response instanceof Blob) {
        return response;
      }
      
      // If response is hex string, convert it
      if (typeof response === 'string') {
        // Check if it's a hex string
        if (response.match(/^[0-9A-Fa-f]+$/)) {
          return hexToBlob(response, 'application/vnd.ms-excel');
        }
        
        // Try to parse as JSON first
        try {
          const jsonData = JSON.parse(response);
          if (jsonData.data && typeof jsonData.data === 'string') {
            return hexToBlob(jsonData.data, 'application/vnd.ms-excel');
          }
        } catch {
          // If not JSON, treat as direct response
          return new Blob([response], { type: 'application/vnd.ms-excel' });
        }
      }
      
      // Handle object response with hex data
      if (response?.data && typeof response.data === 'string') {
        return hexToBlob(response.data, 'application/vnd.ms-excel');
      }
      
      throw new Error('Unexpected response format from server');
      
    } catch (error) {
      console.error("Error exporting tally data:", error);
      throw error;
    }
  }
};

// Helper function to convert hex string to Blob
const hexToBlob = (hexString, mimeType) => {
  try {
    // Remove any whitespace or non-hex characters
    const cleanHex = hexString.replace(/[^0-9A-Fa-f]/g, '');
    
    // Convert hex to byte array
    const byteArray = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      byteArray[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }
    
    return new Blob([byteArray], { type: mimeType });
  } catch (error) {
    console.error('Error converting hex to blob:', error);
    throw new Error('Failed to convert hex data to Excel file');
  }
};

// Helper function to download blob as file
export const downloadBlobAsFile = (blob, filename) => {
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up URL object
  setTimeout(() => window.URL.revokeObjectURL(url), 100);
};

// Main export function
export const exportTallyDataDirect = async (dateRange) => {
  try {
    const params = {
      from_date: dateRange.start,
      to_date: dateRange.end,
      export_format: 'xls'
    };
    
    const blob = await tallyExportAPI.getTallyExportDirect(params);
    
    // Generate filename
    const start = dateRange.start.replace(/-/g, '');
    const end = dateRange.end.replace(/-/g, '');
    const filename = `ATD_Tally_Export_${start}_${end}.xls`;
    
    // Download the file
    downloadBlobAsFile(blob, filename);
    
    return {
      success: true,
      filename,
      message: 'Excel file exported successfully'
    };
    
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
};