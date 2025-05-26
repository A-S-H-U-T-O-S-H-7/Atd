"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BeatLoader } from "react-spinners";
import { ServiceDetailsSchema } from "../validations/UserRegistrationValidations";
import { useUser } from "@/lib/UserRegistrationContext";
import { Building2, Users, Briefcase, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

function ServiceDetails() {
  const {
    serviceData,
    setServiceData,
    step,
    setStep,
    loader,
    setLoader,
    errorMessage,
    setErrorMessage
  } = useUser();

  const [availableIncome, setAvailableIncome] = useState(0);

  const handleServiceDetails = async values => {
    // try {
    //     setServiceData({ ...values });
    //     setLoader(true);
    //     setErrorMessage("");

    //     const response = await fetch(`${ENV.API_URL}/finance-service-details`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Accept": "application/json"
    //         },
    //         body: JSON.stringify(values),
    //     });

    //     const result = await response.json();

    //     if (response.ok) {
    //         setLoader(false);
    //         setStep(step + 1);
    //     } else {
    //         setErrorMessage(result?.message);
    //         setLoader(false);
    //     }
    // } catch (error) {
    //     setErrorMessage("Error submitting data: " + error.message);
    //     setLoader(false);
    // }
    setStep(step + 1);
  };

  const formatAmount = value => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Format with commas for thousands
    if (numericValue) {
      const parts = numericValue.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
    return numericValue;
  };

  const calculateWorkingYears = (fromDate, toDate) => {
    if (!fromDate) return 0;

    const startDate = new Date(fromDate);
    const endDate = toDate ? new Date(toDate) : new Date();

    const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
    const monthsDiff = endDate.getMonth() - startDate.getMonth();

    return yearsDiff + monthsDiff / 12;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 md:p-6'>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Organization Details
          </h1>
          <p className="text-gray-600">
            Please provide your employment and financial information
          </p>
        </div>

        <Formik
          initialValues={serviceData}
          validationSchema={ServiceDetailsSchema}
          onSubmit={values => {
            handleServiceDetails(values);
          }}
          enableReinitialize
        >
          {({ isValid, touched, setFieldValue, values }) => {
            // Calculate available income for loan eligibility
            React.useEffect(
              () => {
                const netSalary = parseFloat(values.netMonthlySalary) || 0;
                const existingEmi = parseFloat(values.existingEmi) || 0;
                const available = netSalary - existingEmi;
                setAvailableIncome(Math.max(0, available));
              },
              [values.netMonthlySalary, values.existingEmi]
            );

            return (
              <Form className="space-y-8">
                {errorMessage && (
                  <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4">
                    <p className='text-red-600 text-center font-medium'>{errorMessage}</p>
                  </div>
                )}

                {/* Organization Information Section */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Organization Information</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Organization Name<span className="text-red-500 ml-1">*</span>
                      </label>
                      <Field
                        name="organizationName"
                        type="text"
                        placeholder="Enter organization name"
                        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                      />
                      <ErrorMessage
                        name="organizationName"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Organization Address<span className="text-red-500 ml-1">*</span>
                      </label>
                      <Field
                        name="organizationAddress"
                        as="textarea"
                        rows="3"
                        placeholder="Enter complete organization address"
                        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300 resize-none"
                      />
                      <ErrorMessage
                        name="organizationAddress"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Office Phone<span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          name="officePhone"
                          type="text"
                          maxLength="11"
                          placeholder="Enter office phone number"
                          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                        />
                        <p className="text-xs text-gray-500">10-11 digits</p>
                        <ErrorMessage
                          name="officePhone"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Website
                        </label>
                        <Field
                          name="website"
                          type="text"
                          placeholder="Enter organization website (optional)"
                          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                        />
                        <ErrorMessage
                          name="website"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* HR Contact Details Section */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">HR Contact Details</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        HR Name<span className="text-red-500 ml-1">*</span>
                      </label>
                      <Field
                        name="hrName"
                        type="text"
                        placeholder="Enter HR name"
                        className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                      />
                      <ErrorMessage
                        name="hrName"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          HR Phone<span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          name="hrPhone"
                          type="text"
                          maxLength="10"
                          placeholder="Enter HR phone number"
                          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                        />
                        <p className="text-xs text-gray-500">10 digits</p>
                        <ErrorMessage
                          name="hrPhone"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          HR Email<span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          name="hrEmail"
                          type="email"
                          placeholder="Enter HR email"
                          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                        />
                        <ErrorMessage
                          name="hrEmail"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment Details Section */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Employment Details</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Designation<span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          name="designation"
                          type="text"
                          placeholder="Enter your designation"
                          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                        />
                        <ErrorMessage
                          name="designation"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Official Email<span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          name="officialEmail"
                          type="email"
                          placeholder="Enter your official email"
                          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                        />
                        <ErrorMessage
                          name="officialEmail"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* Working Period */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Working From<span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          name="workingSince.from"
                          type="date"
                          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                        />
                        <ErrorMessage
                          name="workingSince.from"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Working To
                        </label>
                        <Field
                          name="workingSince.to"
                          type="date"
                          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                        />
                        <p className="text-xs text-gray-500">
                          Leave empty if currently working
                        </p>
                        <ErrorMessage
                          name="workingSince.to"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* Experience Indicator */}
                    {values.workingSince.from && (
                      <div className="bg-teal-50/80 backdrop-blur-sm border border-teal-200 rounded-xl p-4">
                        <p className="text-teal-700 text-sm">
                          <strong>Work Experience:</strong>{" "}
                          {calculateWorkingYears(
                            values.workingSince.from,
                            values.workingSince.to
                          ).toFixed(1)}{" "}
                          years
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Salary Details Section */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Salary Details</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Monthly Salary (₹)<span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field name="monthlySalary">
                          {({ field, form }) => (
                            <input
                              {...field}
                              type="text"
                              placeholder="Enter gross monthly salary"
                              className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                              onChange={e => {
                                const rawValue = e.target.value.replace(/[^0-9]/g, "");
                                const formattedValue = formatAmount(rawValue);
                                form.setFieldValue(field.name, rawValue);
                                e.target.value = formattedValue;
                              }}
                              value={formatAmount(field.value)}
                            />
                          )}
                        </Field>
                        <p className="text-xs text-gray-500">
                          Gross salary before deductions
                        </p>
                        <ErrorMessage
                          name="monthlySalary"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Net Monthly Salary (₹)<span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field name="netMonthlySalary">
                          {({ field, form }) => (
                            <input
                              {...field}
                              type="text"
                              placeholder="Enter net monthly salary"
                              className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                              onChange={e => {
                                const rawValue = e.target.value.replace(/[^0-9]/g, "");
                                const formattedValue = formatAmount(rawValue);
                                form.setFieldValue(field.name, rawValue);
                                e.target.value = formattedValue;
                              }}
                              value={formatAmount(field.value)}
                            />
                          )}
                        </Field>
                        <p className="text-xs text-gray-500">
                          Salary after all deductions
                        </p>
                        <ErrorMessage
                          name="netMonthlySalary"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Existing EMI (₹)<span className="text-red-500 ml-1">*</span>
                      </label>
                      <Field name="existingEmi">
                        {({ field, form }) => (
                          <input
                            {...field}
                            type="text"
                            placeholder="Enter existing EMI amount (0 if none)"
                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                            onChange={e => {
                              const rawValue = e.target.value.replace(/[^0-9]/g, "");
                              const formattedValue = formatAmount(rawValue);
                              form.setFieldValue(field.name, rawValue);
                              e.target.value = formattedValue;
                            }}
                            value={formatAmount(field.value)}
                          />
                        )}
                      </Field>
                      <p className="text-xs text-gray-500">
                        Total monthly EMI for all existing loans
                      </p>
                      <ErrorMessage
                        name="existingEmi"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Family Income (₹)<span className="text-red-500 ml-1">*</span>
                      </label>
                      <Field name="familyIncome">
                        {({ field, form }) => (
                          <input
                            {...field}
                            type="text"
                            placeholder="Enter total family income"
                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:border-transparent hover:border-teal-300"
                            onChange={e => {
                              const rawValue = e.target.value.replace(/[^0-9]/g, "");
                              const formattedValue = formatAmount(rawValue);
                              form.setFieldValue(field.name, rawValue);
                              e.target.value = formattedValue;
                            }}
                            value={formatAmount(field.value)}
                          />
                        )}
                      </Field>
                      <p className="text-xs text-gray-500">
                        Total monthly income of all family members
                      </p>
                      <ErrorMessage
                        name="familyIncome"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Financial Summary */}
                    {values.netMonthlySalary && (
                      <div className="bg-gradient-to-r from-teal-50/80 to-emerald-50/80 backdrop-blur-sm border border-teal-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Financial Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Net Salary</p>
                            <p className="text-xl font-bold text-teal-600">
                              ₹{formatAmount(values.netMonthlySalary)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Existing EMI</p>
                            <p className="text-xl font-bold text-red-600">
                              ₹{formatAmount(values.existingEmi || "0")}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Available Income</p>
                            <p className="text-xl font-bold text-emerald-600">
                              ₹{formatAmount(availableIncome.toString())}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 text-center">
                          <p className="text-sm text-gray-600">
                            Recommended EMI Limit:{" "}
                            <span className="font-semibold text-teal-600">
                              ₹{formatAmount((availableIncome * 0.6).toFixed(0))}
                            </span>
                            <span className="text-xs ml-1">
                              (60% of available income)
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

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