"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { BeatLoader } from "react-spinners";
import { ServiceDetailsSchema } from "../validations/UserRegistrationValidations";
import { useUser } from "@/lib/UserRegistrationContext";
import { Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

import PageHeader from "../serviceChunks/PageHeader";
import OrganizationSection from "../serviceChunks/OrganisationSection";
import HRContactSection from "../serviceChunks/HrContactSection";
import EmploymentSection from "../serviceChunks/EmployementSection";
import SalarySection from "../serviceChunks/SalarySection";
import ErrorAlert from "../serviceChunks/ErrorAlert";

function ServiceDetails() {
  const {
    serviceData,
    setServiceData,
    step,
    setStep,
    phoneData,
    personalData,
    loader,
    setLoader,
    errorMessage,
    setErrorMessage,
    token
  } = useUser();

  const [availableIncome, setAvailableIncome] = useState(0);
  const { user } = useAuth();
  const [validationData, setValidationData] = useState({
    userPhone: '',
    userEmail: '',
    refMobile: '',
    refEmail: ''
  });

  useEffect(() => {
    if (user) {
      const data = {
        userPhone: user?.phone || phoneData?.phoneNumber || '',
        userEmail: user?.email || '',
        refMobile: user?.ref_mobile || personalData?.familyReference?.mobileNumber || '',
        refEmail: user?.ref_email || personalData?.familyReference?.email || ''
      };
      setValidationData(data);
    }
  }, [user, phoneData, personalData]);

  const handleServiceDetails = async (values) => {
    try {
      setServiceData({ ...values });
      setLoader(true);    
      setErrorMessage("");

      const payload = { 
        step: 4, 
        organizationname: values.organizationName,
        organisationaddress: values.organizationAddress,
        officephone: values.officePhone,
        hrname: values.hrName,
        hrphone: parseInt(values.hrPhone, 10) || 0, 
        website: values.website, 
        hremail: values.hrEmail,
        designation: values.designation,
        worksince_mm: values.workingSince.month,
        worksince_yy: values.workingSince.year,
        grossalary: parseInt(values.monthlySalary, 10) || 0, 
        netsalary: parseInt(values.netMonthlySalary, 10) || 0, 
        nethouseholdincome: parseInt(values.familyIncome, 10) || 0, 
        officialemail: values.officialEmail,
        existingemi: parseInt(values.existingEmi, 10) || 0
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/user/form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setLoader(false);
        setStep(step + 1);
      } else {
        setErrorMessage(result?.message);
        setLoader(false);
      }
    } catch (error) {
      setErrorMessage("Error submitting data: " + error.message);
      setLoader(false);
    }
  };

  const getInitialValues = () => ({
    ...serviceData,
    organizationName: serviceData.organizationName || user?.organisation_name || '',
    netMonthlySalary: serviceData.netMonthlySalary || user?.net_monthly_salary || '',
    employerContactConsent: serviceData.employerContactConsent || false,
    monthlySalary: serviceData.monthlySalary || '',
    existingEmi: serviceData.existingEmi || '',
    familyIncome: serviceData.familyIncome || '',
    organizationAddress: serviceData.organizationAddress || '',
    officePhone: serviceData.officePhone || '',
    hrName: serviceData.hrName || '',
    hrPhone: serviceData.hrPhone || '',
    website: serviceData.website || '',
    hrEmail: serviceData.hrEmail || '',
    designation: serviceData.designation || '',
    workingSince: serviceData.workingSince || { month: '', year: '' },
    officialEmail: serviceData.officialEmail || '',
  });

  const validateServiceDetails = (values) => {
    const errors = {};
    
    if (values.officePhone) {
      if (validationData.userPhone && values.officePhone === validationData.userPhone) {
        errors.officePhone = "Office phone cannot be same as your mobile number";
      }
      if (validationData.refMobile && values.officePhone === validationData.refMobile) {
        errors.officePhone = errors.officePhone 
          ? errors.officePhone + " or family reference mobile number"
          : "Office phone cannot be same as family reference mobile number";
      }
    }
    
    if (values.hrPhone) {
      if (validationData.userPhone && values.hrPhone === validationData.userPhone) {
        errors.hrPhone = "HR phone cannot be same as your mobile number";
      }
      if (validationData.refMobile && values.hrPhone === validationData.refMobile) {
        errors.hrPhone = errors.hrPhone 
          ? errors.hrPhone + " or family reference mobile number"
          : "HR phone cannot be same as family reference mobile number";
      }
      if (values.officePhone && values.hrPhone === values.officePhone) {
        errors.hrPhone = errors.hrPhone 
          ? errors.hrPhone + " or office phone"
          : "HR phone cannot be same as office phone";
      }
    }
    
    if (values.hrEmail) {
      const hrEmailLower = values.hrEmail.toLowerCase();
      
      if (validationData.userEmail && hrEmailLower === validationData.userEmail.toLowerCase()) {
        errors.hrEmail = "HR email cannot be same as your email";
      }
      
      if (values.officialEmail && hrEmailLower === values.officialEmail.toLowerCase()) {
        errors.hrEmail = errors.hrEmail 
          ? errors.hrEmail + " or official email"
          : "HR email cannot be same as official email";
      }
      
      if (validationData.refEmail && hrEmailLower === validationData.refEmail.toLowerCase()) {
        errors.hrEmail = errors.hrEmail 
          ? errors.hrEmail + " or family reference email"
          : "HR email cannot be same as family reference email";
      }
    }
    
    if (values.officialEmail) {
      const officialEmailLower = values.officialEmail.toLowerCase();
      
      if (validationData.userEmail && officialEmailLower === validationData.userEmail.toLowerCase()) {
        errors.officialEmail = "Official email cannot be same as your personal email";
      }
      
      if (validationData.refEmail && officialEmailLower === validationData.refEmail.toLowerCase()) {
        errors.officialEmail = "Official email cannot be same as family reference email";
      }
    }
    
    return errors;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
      <div className="max-w-6xl mx-auto">
        <PageHeader />
        
        <Formik
          initialValues={getInitialValues()}
          validationSchema={ServiceDetailsSchema}
          validate={validateServiceDetails}
          onSubmit={handleServiceDetails}
          enableReinitialize
          validateOnMount={true}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ values }) => {
            useEffect(() => {
              const netSalary = parseFloat(values.netMonthlySalary) || 0;
              const existingEmi = parseFloat(values.existingEmi) || 0;
              const available = netSalary - existingEmi;
              setAvailableIncome(Math.max(0, available));
            }, [values.netMonthlySalary, values.existingEmi]);

            return (
              <Form className="space-y-8">
                <ErrorAlert errorMessage={errorMessage} />
                
                <OrganizationSection />
                <HRContactSection />
                <EmploymentSection values={values} />
                <SalarySection values={values} availableIncome={availableIncome} />

                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-all duration-200 order-2 sm:order-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <button
                    disabled={loader}
                    type="submit"
                    className="inline-flex items-center cursor-pointer justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                  >
                    {loader ? (
                      <BeatLoader color="#fff" size={8} />
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default ServiceDetails;