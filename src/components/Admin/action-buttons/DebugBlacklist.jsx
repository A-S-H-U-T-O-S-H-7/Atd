// Temporary debug function - add this to BlackListService.js
export const debugBlacklist = async (applicationId) => {
  console.log('🔍 === BLACKLIST DEBUG START ===');
  console.log('Application ID:', applicationId);
  console.log('ID Type:', typeof applicationId);
  
  try {
    // Test the exact same endpoint you used in your manual test
    const testResponse = await api.put(`/crm/application/black-list/${applicationId}`);
    console.log('✅ Manual test response:', testResponse.data);
    return testResponse.data;
  } catch (testError) {
    console.log('❌ Manual test error:', testError);
    console.log('❌ Manual test error response:', testError.response?.data);
    throw testError;
  }
};