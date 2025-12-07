import { useAuth } from '@/lib/AuthContext';
import { useUser } from '@/lib/UserRegistrationContext';
import { useMemo } from 'react';

export const useReferencesValidation = (references) => {
  const { user } = useAuth(); 
  const { phoneData, serviceData, personalData } = useUser();
  
  return useMemo(() => {
    if (!Array.isArray(references)) return { 
      completedCount: 0, 
      duplicates: {}, 
      userPhoneMatches: {},
      restrictedPhoneMatches: {},
      restrictedEmailMatches: {}
    };

    const restrictedPhoneNumbers = [
      user?.phone,
      user?.mobile_no,
      user?.office_phone,
      user?.ref_mobile,
      phoneData?.phoneNumber,
      serviceData?.officePhone,
      serviceData?.hrPhone,
      personalData?.familyReference?.mobileNumber
    ]
      .filter(Boolean) 
      .map(phone => String(phone).replace(/\D/g, '')) 
      .filter(phone => phone.length >= 10) 
      .map(phone => phone.slice(-10)) 
      .filter((phone, index, self) => self.indexOf(phone) === index);

    const restrictedEmails = [
      user?.email,
      user?.ref_email,
      user?.official_email,
      user?.hr_mail,
      user?.alt_email,
      serviceData?.hrEmail,
      serviceData?.officialEmail,
      personalData?.familyReference?.email
    ]
      .filter(Boolean)
      .map(email => String(email).toLowerCase().trim())
      .filter((email, index, self) => self.indexOf(email) === index);

    const completedCount = references.filter(ref => 
      ref && 
      typeof ref === 'object' && 
      typeof ref.name === 'string' && ref.name.trim() !== '' &&
      typeof ref.phone === 'string' && ref.phone.trim() !== '' &&
      typeof ref.email === 'string' && ref.email.trim() !== ''
    ).length;

    const duplicates = {};
    const userPhoneMatches = {};
    const restrictedPhoneMatches = {};
    const restrictedEmailMatches = {};
    
    references.forEach((ref, index) => {
      if (!ref) return;
      
      const currentPhone = ref.phone?.trim().replace(/\D/g, '');
      const currentEmail = ref.email?.trim().toLowerCase();
      
      if (currentPhone && restrictedPhoneNumbers.includes(currentPhone)) {
        restrictedPhoneMatches[`phone_${index}`] = {
          phone: currentPhone,
          matchedType: getPhoneMatchType(currentPhone, user, phoneData, serviceData, personalData)
        };
      }
      
      if (currentEmail && restrictedEmails.includes(currentEmail)) {
        restrictedEmailMatches[`email_${index}`] = {
          email: currentEmail,
          matchedType: getEmailMatchType(currentEmail, user, serviceData, personalData)
        };
      }
      
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
      userPhoneMatches,
      restrictedPhoneMatches,
      restrictedEmailMatches
    };
  }, [references, user, phoneData, serviceData, personalData]); 
};

const getPhoneMatchType = (phone, user, phoneData, serviceData, personalData) => {
  const phonesToCheck = [
    { value: user?.phone, type: 'mobile number' },
    { value: user?.mobile_no, type: 'your mobile number' },
    { value: phoneData?.phoneNumber, type: 'your mobile number' },
    { value: user?.ref_mobile, type: 'family reference mobile number' },
    { value: personalData?.familyReference?.mobileNumber, type: 'family reference mobile number' },
    { value: serviceData?.officePhone, type: 'office phone' },
    { value: serviceData?.hrPhone, type: 'HR phone' },
    { value: user?.office_phone, type: 'office phone' }
  ];

  for (const item of phonesToCheck) {
    if (item.value && String(item.value).replace(/\D/g, '').slice(-10) === phone) {
      return item.type;
    }
  }
  
  return 'restricted phone number';
};

const getEmailMatchType = (email, user, serviceData, personalData) => {
  const emailsToCheck = [
    { value: user?.email, type: 'your email' },
    { value: user?.ref_email, type: 'family reference email' },
    { value: user?.official_email, type: 'official email' },
    { value: user?.hr_mail, type: 'HR email' },
    { value: user?.alt_email, type: 'alternative email' },
    { value: serviceData?.hrEmail, type: 'HR email' },
    { value: serviceData?.officialEmail, type: 'official email' },
    { value: personalData?.familyReference?.email, type: 'family reference email' }
  ];

  for (const item of emailsToCheck) {
    if (item.value && String(item.value).toLowerCase().trim() === email) {
      return item.type;
    }
  }
  
  return 'restricted email';
};