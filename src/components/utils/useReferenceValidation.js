import { useMemo } from 'react';

export const useReferencesValidation = (references) => {
  return useMemo(() => {
    if (!Array.isArray(references)) return { completedCount: 0, duplicates: {} };

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
    references.forEach((ref, index) => {
      if (!ref) return;
      
      // Phone duplicates
      const currentPhone = ref.phone?.trim();
      if (currentPhone) {
        const phoneDuplicates = references
          .map((r, i) => ({ phone: r?.phone?.trim(), index: i }))
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
          .map((r, i) => ({ email: r?.email?.trim().toLowerCase(), index: i }))
          .filter(({ email, index: i }) => email === currentEmail && i !== index)
          .map(({ index: i }) => i);
        
        if (emailDuplicates.length > 0) {
          duplicates[`email_${index}`] = emailDuplicates;
        }
      }
    });

    return { completedCount, duplicates };
  }, [references]);
};
