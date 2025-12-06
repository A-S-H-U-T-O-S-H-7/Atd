"use client";
import React, { useState } from 'react';
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import { ReferencesSchema } from '../validations/UserRegistrationValidations';
import { useUser } from '@/lib/UserRegistrationContext';
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

// Import components
import FullPageLoader from '../referenceChunks/PageLoader';
import ReferenceCard from '../referenceChunks/ReferenceCard';
import ImportantGuidelines from '../referenceChunks/GuideLines';
import NavigationButtons from '../referenceChunks/NavigationButtons';

// Import hooks and utilities
import { useReferencesValidation } from '@/components/utils/useReferenceValidation';
import { transformToApiFormat, formatPhoneNumber } from '@/components/utils/referenceApiHelper';

function References() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { completeRegistration, fetchUserData } = useAuth();

  const {
    referenceData,
    setReferenceData,
    step,
    setStep,
    loader,
    setLoader,
    errorMessage,
    setErrorMessage,
    phoneData,
    token 
  } = useUser();

 const handleReferences = async (values) => {
  try {
    setReferenceData({ ...values });
    setLoader(true);
    setIsSubmitting(true);
    setErrorMessage("");
    
    const apiPayload = transformToApiFormat(values, phoneData);
    console.log('API Payload:', apiPayload);

    const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/user/form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(apiPayload),
    });

    const result = await response.json();
    console.log("Registration result:", result);

    if (response.ok && result.success) {
      // References updated successfully - now refresh user data
      localStorage.setItem('showCongratulations', 'true');
      
      // Use the existing fetchUserData with forceRefresh to get updated user info
      await fetchUserData(true);
      
      // Navigate to profile
      router.push('/userProfile');
      
    } else {
      setErrorMessage(
        result?.message || 
        result?.error || 
        `API Error: ${response.status} ${response.statusText}`
      );
      setLoader(false);
      setIsSubmitting(false);
    }
    
  } catch (error) {
    console.error('API Error:', error);
    setErrorMessage("Network error: " + (error?.message || "Unable to connect to server"));
    setLoader(false);
    setIsSubmitting(false);
  }
};
  
  return (
    <>
      <FullPageLoader isVisible={isSubmitting} />
      
      <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Personal References
            </h1>
            <p className="text-gray-600">
               Please provide 5 personal references who can speak about your reliability 
            </p>
          </div>

          <Formik
            initialValues={referenceData}
            validationSchema={ReferencesSchema}
            onSubmit={handleReferences}
            enableReinitialize
          >
            {({ values }) => {
              const references = Array.isArray(values?.references) ? values.references : 
                Array(5).fill().map(() => ({ name: "", phone: "", email: "" }));

              // Call hook INSIDE Formik render function
              const { completedCount, duplicates, userPhoneMatches } = useReferencesValidation(references);
              
              const hasDuplicates = Object.keys(duplicates).length > 0;
              const hasUserPhoneMatches = Object.keys(userPhoneMatches).length > 0;
              
              // Update isFormValid to include userPhoneMatches check
              const isFormValid = completedCount === 5 && 
                                 !hasDuplicates && 
                                 !hasUserPhoneMatches && 
                                 values.consentToContact; 

              return (
                <Form className="space-y-8">
                  {errorMessage && (
                    <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4">
                      <p className='text-red-600 text-center font-medium'>{errorMessage}</p>
                    </div>
                  )}

                  {/* References List */}
                  <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-4 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">Reference Information</h2>
                    </div>

                    <FieldArray name="references">
                      {() => (
                        <div className="space-y-8">
                          {references.map((reference, index) => (
                            <ReferenceCard
                              key={`reference-${index}`}
                              reference={reference}
                              index={index}
                              duplicatePhones={duplicates[`phone_${index}`] || []}
                              duplicateEmails={duplicates[`email_${index}`] || []}
                              userPhoneMatch={userPhoneMatches[`phone_${index}`]} // Pass user phone match
                              formatPhoneNumber={formatPhoneNumber}
                            />
                          ))}
                        </div>
                      )}
                    </FieldArray>

                    {/* Consent Checkbox */}
                    <div className="mt-8 p-4 bg-blue-50/50 backdrop-blur-sm border border-blue-200 rounded-xl">
                      <Field name="consentToContact">
                        {({ field, form }) => (
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              {...field}
                              checked={field.value || false}
                              onChange={(e) => form.setFieldValue('consentToContact', e.target.checked)}
                              className="w-5 h-5 text-teal-500 bg-white border-2 border-gray-300 rounded focus:ring-teal-500 focus:ring-2 mt-1"
                            />
                            <div className="flex-1">                              
                              <p className="text-sm text-gray-800 mt-1">
                                I hereby confirm that NBFC can contact my above-mentioned references in case of default or not contactable .
                              </p>
                            </div>
                          </label>
                        )}
                      </Field>
                      <ErrorMessage 
                        name="consentToContact" 
                        component="p" 
                        className="text-red-500 text-sm mt-2" 
                      />
                    </div>
                  </div>

                  <ImportantGuidelines />

                  <NavigationButtons
                    step={step}
                    setStep={setStep}
                    loader={loader}
                    completedCount={completedCount}
                    hasDuplicates={hasDuplicates}
                    hasUserPhoneMatches={hasUserPhoneMatches} 
                    isSubmitting={isSubmitting}
                    values={values}
                    isFormValid={isFormValid}
                  />
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default References;