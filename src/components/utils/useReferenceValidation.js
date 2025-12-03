import { useAuth } from '@/lib/AuthContext';
import { useMemo } from 'react';

export const useReferencesValidation = (references) => {
  const { user } = useAuth(); 
  
  return useMemo(() => {
    if (!Array.isArray(references)) return { 
      completedCount: 0, 
      duplicates: {}, 
      userPhoneMatches: {} 
    };

    // Extract user's existing phone numbers
    const userPhoneNumbers = [
      user?.phone,           
      user?.mobile_no,       
      user?.office_phone,    
      user?.ref_mobile       
    ]
      .filter(Boolean) 
      .map(phone => String(phone).replace(/\D/g, '')) 
      .filter(phone => phone.length >= 10) 
      .map(phone => phone.slice(-10)) 
      .filter((phone, index, self) => self.indexOf(phone) === index); 

    // Count completed references
    const completedCount = references.filter(ref => 
      ref && 
      typeof ref === 'object' && 
      typeof ref.name === 'string' && ref.name.trim() !== '' &&
      typeof ref.phone === 'string' && ref.phone.trim() !== '' &&
      typeof ref.email === 'string' && ref.email.trim() !== ''
    ).length;

    // Find duplicates
    const duplicates = {};
    const userPhoneMatches = {};
    
    references.forEach((ref, index) => {
      if (!ref) return;
      
      const currentPhone = ref.phone?.trim().replace(/\D/g, '');
      
      // Check if matches user's phone numbers
      if (currentPhone && userPhoneNumbers.includes(currentPhone)) {
        userPhoneMatches[`phone_${index}`] = currentPhone;
      }
      
      // Phone duplicates among references
      if (currentPhone) {
        const phoneDuplicates = references
          .map((r, i) => ({ 
            phone: r?.phone?.trim().replace(/\D/g, ''), 
            index: i 
          }))
          .filter(({ phone, index: i }) => phone === currentPhone && i !== index)
          .map(({ index: i }) => i);
        
        if (phoneDuplicates.length > 0) {
          duplicates[`phone_${index}`] = phoneDuplicates;
        }
      }

      // Email duplicates
      const currentEmail = ref.email?.trim().toLowerCase();
      if (currentEmail) {
        const emailDuplicates = references
          .map((r, i) => ({ 
            email: r?.email?.trim().toLowerCase(), 
            index: i 
          }))
          .filter(({ email, index: i }) => email === currentEmail && i !== index)
          .map(({ index: i }) => i);
        
        if (emailDuplicates.length > 0) {
          duplicates[`email_${index}`] = emailDuplicates;
        }
      }
    });

    return { 
      completedCount, 
      duplicates, 
      userPhoneMatches 
    };
  }, [references, user]); 
};