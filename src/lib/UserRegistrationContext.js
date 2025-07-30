"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  // Step 1: Phone Number and Verification Data
  const [phoneData, setPhoneData] = useState({
    phoneNumber: "",
    phoneOtp: "",
    isPhoneVerified: false,
    agreeToTerms: false,
    userid: null
  });

  // Step 2: Personal Details
  const [personalData, setPersonalData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    alternativeEmail: "",
    dob: "",
    email: "",
    phoneNumber: "",
    aadharNumber: "",
    panNumber: "",
    referralCode: "",
    currentAddress: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      addressType: ""
    },
    permanentAddress: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      addressType: "",
      isSameAsCurrent: false
    },
    fatherName: "",
    familyReference: {
      name: "",
      mobileNumber: "",
      email: "",
      relation: "",
      address: ""
    }
  });

  // Step 3: bank &Loan Details
  const [bankLoanData, setBankLoanData] = useState({
    // Loan fields
    isSalaried: "",
    amount: "",
    tenure: "",
    // Bank fields
    ifscCode: "",
    bankName: "",
    bankBranch: "",
    accountNumber: "",
    confirmAccountNumber: "",
    accountType: ""
  });

  // Step 4: Service/Employment Details
  const [serviceData, setServiceData] = useState({
    organizationName: "",
    organizationAddress: "",
    officePhone: "",
    hrName: "",
    hrPhone: "",
    hrEmail: "",
    website: "",
    monthlySalary: "",
    officialEmail: "",
    netMonthlySalary: "",
    familyIncome: "",
    designation: "",
    existingEmi: "",
    workingSince: {
      month: "",
      year: ""
    }
  });

  // Step 5: Document Upload Data
  const [documentData, setDocumentData] = useState({
    aadharFront: null,
    aadharBack: null,
    panCard: null,
    selfie: null,
    salarySlip1: null,
    salarySlip2: null,
    salarySlip3: null,
    bankStatement: null
  });

  const [uploadStatus, setUploadStatus] = useState({
    aadharFront: { uploading: false, uploaded: false, error: null },
    aadharBack: { uploading: false, uploaded: false, error: null },
    panCard: { uploading: false, uploaded: false, error: null },
    selfie: { uploading: false, uploaded: false, error: null },
    salarySlip1: { uploading: false, uploaded: false, error: null },
    salarySlip2: { uploading: false, uploaded: false, error: null },
    salarySlip3: { uploading: false, uploaded: false, error: null },
    bankStatement: { uploading: false, uploaded: false, error: null }
  });

  // Step 6: References Data
  const [referenceData, setReferenceData] = useState({
    references: [
      { name: "", phone: "", email: "" },
      { name: "", phone: "", email: "" },
      { name: "", phone: "", email: "" },
      { name: "", phone: "", email: "" },
      { name: "", phone: "", email: "" }
    ],
    consentToContact: false
  });

  // Application State Management
  const [userId, setUserId] = useState("");
  const [step, setStep] = useState(null);
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState(null);

  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    console.error("Error accessing AuthContext:", error);
    authContext = null;
  }

  const user = authContext?.user || null;

  const fetchAndPopulateUserData = async (userId, token) => {
    try {
      setLoader(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ATD_API}/api/user/me`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        const userData = result.user || result.data || result;
        console.log("🔍 Full API Response:", userData);

        // Step 2: Personal Data
        if (userData.step >= 2) {
          setPersonalData((prev) => ({
            ...prev,
            firstName: userData.fname || prev.firstName,
            lastName: userData.lname || prev.lastName,
            gender: userData.gender || prev.gender,
            dob: userData.dob || prev.dob,
            fatherName: userData.fathername || prev.fatherName,
            alternativeEmail: userData.alt_email || prev.alternativeEmail,
            // referralCode: userData.referral_code || prev.referralCode,
            currentAddress: {
              ...prev.currentAddress,
              street: userData.curr_address || prev.currentAddress.street,
              city: userData.curr_city || prev.currentAddress.city,
              state: userData.curr_state || prev.currentAddress.state,
              pincode: userData.curr_pincode
                ? String(userData.curr_pincode)
                : prev.currentAddress.pincode,
              addressType: userData.curr_address_code
                ? String(userData.curr_address_code)
                : prev.currentAddress.addressType
            },
            permanentAddress: {
              ...prev.permanentAddress,
              street: userData.per_address || prev.permanentAddress.street,
              city: userData.per_city || prev.permanentAddress.city,
              state: userData.per_state || prev.permanentAddress.state,
              pincode: userData.per_pincode
                ? String(userData.per_pincode)
                : prev.permanentAddress.pincode,
              addressType: userData.per_address_code
                ? String(userData.per_address_code)
                : prev.permanentAddress.addressType
            },
            familyReference: {
              ...prev.familyReference,
              name: userData.ref_name || prev.familyReference.name,
              mobileNumber: userData.ref_mobile
                ? String(userData.ref_mobile)
                : prev.familyReference.mobileNumber,
              email: userData.ref_email || prev.familyReference.email,
              relation: userData.ref_relation || prev.familyReference.relation,
              address: userData.ref_address || prev.familyReference.address
            }
          }));
        }

        // Step 3: Bank&Loan Data
        if (userData.step >= 3) {
          setBankLoanData((prev) => ({
            ...prev,
            // Loan fields
            amount: userData.loanAmount || userData.loan_amount || prev.amount,
            tenure: userData.loanTenure || userData.loan_tenure || prev.tenure,
            // Bank fields
            ifscCode: userData.ifsc_code || prev.ifscCode,
            bankName: userData.bank_name || prev.bankName,
            bankBranch: userData.bank_branch || prev.bankBranch,
            accountNumber: userData.account_number || prev.accountNumber,
            accountType: userData.account_type || prev.accountType
          }));
        }

        // Step 4: Service Data
        if (userData.step >= 4) {
          setServiceData((prev) => ({
            ...prev,
            organizationName:
              userData.companyName ||
              userData.company_name ||
              prev.organizationName,
            monthlySalary:
              userData.monthlySalary ||
              userData.monthly_salary ||
              prev.monthlySalary,
            netMonthlySalary:
              userData.netSalary ||
              userData.net_salary ||
              prev.netMonthlySalary,
            designation: userData.designation || prev.designation,
            organizationAddress:
              userData.company_address || prev.organizationAddress,
            officePhone: userData.office_phone || prev.officePhone,
            hrName: userData.hr_name || prev.hrName,
            hrPhone: userData.hr_phone || prev.hrPhone,
            hrEmail: userData.hr_email || prev.hrEmail,
            website: userData.company_website || prev.website,
            officialEmail: userData.official_email || prev.officialEmail,
            familyIncome: userData.family_income || prev.familyIncome,
            existingEmi: userData.existing_emi || prev.existingEmi,
            workingSince: {
              month: userData.working_since_month || prev.workingSince.month,
              year: userData.working_since_year || prev.workingSince.year
            }
          }));
        }

        // Step 5: Document Status
        if (userData.step >= 5) {
          setUploadStatus((prev) => {
            const newStatus = { ...prev };
            if (userData.documents) {
              Object.keys(userData.documents).forEach((docType) => {
                if (newStatus[docType]) {
                  newStatus[docType] = {
                    ...newStatus[docType],
                    uploaded: !!userData.documents[docType]
                  };
                }
              });
            }
            return newStatus;
          });
        }

        // Step 6: Reference Data
        if (userData.step >= 6 && userData.references) {
          setReferenceData((prev) => ({
            ...prev,
            references:
              userData.references.length > 0
                ? userData.references
                : prev.references,
            consentToContact:
              userData.consent_to_contact || prev.consentToContact
          }));
        }
      } else {
        console.error("Failed to fetch user data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    console.log("🔄 UserContext useEffect triggered:");
  console.log("- User:", user);
  console.log("- Current token state:", token);
  console.log("- Token in localStorage:", localStorage.getItem("token"));

    if (user &&  !loader) {
      setStep(user.step || 1);
      setUserId(user.id || user._id);

      try {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          // Only fetch if we don't already have the data
          if (!personalData.firstName && user.step >= 2) {
            fetchAndPopulateUserData(user.id || user._id, storedToken);
          }
        }
      } catch (error) {
        console.warn("Could not access localStorage:", error);
      }

    }
  }, [user]);

  const copyCurrentToPermanent = () => {
    setPersonalData((prev) => ({
      ...prev,
      permanentAddress: {
        ...prev.currentAddress,
        isSameAsCurrent: true
      }
    }));
  };

  const resetAllData = () => {
    setToken(null);
    setPhoneData({
      phoneNumber: "",
      phoneOtp: "",
      isPhoneVerified: false,
      agreeToTerms: false,
      userid: null
    });

    setPersonalData({
      firstName: "",
      lastName: "",
      gender: "",
      alternativeEmail: "",
      dob: "",
      referralCode: "",
      currentAddress: {
        street: "",
        city: "",
        state: "",
        pincode: "",
        addressType: ""
      },
      permanentAddress: {
        street: "",
        city: "",
        state: "",
        pincode: "",
        addressType: "",
        isSameAsCurrent: false
      },
      fatherName: "",
      familyReference: {
        name: "",
        mobileNumber: "",
        email: "",
        relation: "",
        address: ""
      }
    });

    setBankLoanData({
      isSalaried: "",
      amount: "",
      tenure: "",
      ifscCode: "",
      bankName: "",
      bankBranch: "",
      accountNumber: "",
      confirmAccountNumber: "",
      accountType: ""
    });
    setServiceData({
      organizationName: "",
      organizationAddress: "",
      officePhone: "",
      hrName: "",
      hrPhone: "",
      hrEmail: "",
      website: "",
      monthlySalary: "",
      officialEmail: "",
      netMonthlySalary: "",
      familyIncome: "",
      designation: "",
      existingEmi: "",
      workingSince: {
        month: "",
        year: ""
      }
    });

    setDocumentData({
      aadharFront: null,
      aadharBack: null,
      panCard: null,
      selfie: null,
      salarySlip1: null,
      salarySlip2: null,
      salarySlip3: null,
      bankStatement: null
    });
    setUploadStatus({
      aadharFront: { uploading: false, uploaded: false, error: null },
      aadharBack: { uploading: false, uploaded: false, error: null },
      panCard: { uploading: false, uploaded: false, error: null },
      selfie: { uploading: false, uploaded: false, error: null },
      salarySlip1: { uploading: false, uploaded: false, error: null },
      salarySlip2: { uploading: false, uploaded: false, error: null },
      salarySlip3: { uploading: false, uploaded: false, error: null },
      bankStatement: { uploading: false, uploaded: false, error: null }
    });
    setReferenceData({
      references: [
        { name: "", phone: "", email: "" },
        { name: "", phone: "", email: "" },
        { name: "", phone: "", email: "" },
        { name: "", phone: "", email: "" },
        { name: "", phone: "", email: "" }
      ],
      consentToContact: false
    });
    setStep(1);
    setUserId("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <UserContext.Provider
      value={{
        phoneData,
        setPhoneData,
        token,
        setToken,
        personalData,
        setPersonalData,
        bankLoanData,
        setBankLoanData,
        serviceData,
        setServiceData,
        documentData,
        setDocumentData,
        uploadStatus,
        setUploadStatus,
        referenceData,
        setReferenceData,
        fetchAndPopulateUserData,
        userId,
        setUserId,
        step,
        setStep,
        loader,
        setLoader,
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
        copyCurrentToPermanent,
        resetAllData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};
