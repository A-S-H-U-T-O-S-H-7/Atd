"use client"

import { useRouter, useSearchParams } from 'next/navigation';

export const useNavigation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get source page from URL query params and decode it
  const sourceParam = searchParams.get('source');
  
  // Map source parameter to actual route
  const getSourcePage = () => {
    if (!sourceParam) return '/crm/completed-application';
    
    // First, decode the URL parameter
    const decodedSource = decodeURIComponent(sourceParam);
    
    // Check if it's a full path (starts with /)
    if (decodedSource.startsWith('/')) {
      return decodedSource; // Return the full path directly
    }
    
    // Only use switch for short codes
    switch(decodedSource.toLowerCase()) {
      case 'manage':
        return '/crm/manage-application';  
      case 'disburse':
        return '/crm/disburse-application';   
      case 'credit-approval':
        return '/crm/credit-approval';    
      case 'sanction':
        return '/crm/sanction-application';  
      case 'completed':
        return '/crm/completed-application';
      case 'pending':
        return '/crm/pending-application';
      case 'processing':
        return '/crm/inprogress-application';
      case 'followup':
        return '/crm/followup-application';
      case 'rejected':
        return '/crm/rejected-application';
      case 'all':
        return '/crm/all-enquiries';
      // Add more cases for other pages as needed
      default:
        return '/crm/completed-application'; 
    }
  };
  
  const sourcePage = getSourcePage();
  
  const navigateBack = () => {
    // Add debug logging
    console.log('Navigating back to:', sourcePage, 'from sourceParam:', sourceParam);
    router.push(sourcePage);
  };
  
  return { navigateBack, sourcePage };
};