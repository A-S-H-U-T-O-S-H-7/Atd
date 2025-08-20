"use client";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import { BeatLoader } from "react-spinners";
import { ServiceDetailsSchema } from "../validations/UserRegistrationValidations";
import { useUser } from "@/lib/UserRegistrationContext";
import { Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';


// Import sub-components
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
    loader,
    setLoader,
    errorMessage,
    setErrorMessage,
    token
  } = useUser();

  const [availableIncome, setAvailableIncome] = useState(0);
    const { user } = useAuth();

  const handleServiceDetails = async (values) => {
    try {
      setServiceData({ ...values });
      setLoader(true);    
      setErrorMessage("");

      const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/user/form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          step: 4, 
          // userid: phoneData.userid,
          // provider: 1,
          organizationname: values.organizationName,
          organisationaddress: values.organizationAddress,
          officephone: values.officePhone,
          hrname: values.hrName,
          hrphone: parseInt(values.hrPhone, 10),
          website: values.website,
          hremail: values.hrEmail,
          designation: values.designation,
          worksince_mm: values.workingSince.month,
          worksince_yy: values.workingSince.year,
          grossalary: parseInt(values.monthlySalary, 10),
          netsalary: parseInt(values.netMonthlySalary, 10),
          nethouseholdincome: parseInt(values.familyIncome, 10),
          officialemail: values.officialEmail,
          existingemi: parseInt(values.existingEmi, 10)
        }),
      });

      const result = await response.json();
      console.log(result);

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
  // ... other existing fields
});

  return (
    <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
      <div className="max-w-6xl mx-auto">
        <PageHeader />
        
        <Formik
          initialValues={getInitialValues()}
          validationSchema={ServiceDetailsSchema}
          onSubmit={handleServiceDetails}
          enableReinitialize
        >
          {({ values }) => {
            // Calculate available income for loan eligibility
            React.useEffect(() => {
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

                {/* Navigation Buttons */}
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