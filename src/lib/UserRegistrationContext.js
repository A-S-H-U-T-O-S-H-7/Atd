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
    photo: null,
    salarySlip1: null,
    salarySlip2: null,
    salarySlip3: null,
    bankStatement: null
  });

  const [uploadStatus, setUploadStatus] = useState({
    aadharFront: { uploading: false, uploaded: false, error: null },
    aadharBack: { uploading: false, uploaded: false, error: null },
    panCard: { uploading: false, uploaded: false, error: null },
    photo: { uploading: false, uploaded: false, error: null },
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
              street: userData.current_address || prev.currentAddress.street,
              city: userData.current_city || prev.currentAddress.city,
              state: userData.current_state || prev.currentAddress.state,
              pincode: userData.current_pincode
                ? String(userData.current_pincode)
                : prev.currentAddress.pincode,
              addressType: userData.current_address_code
                ? String(userData.current_address_code)
                : prev.currentAddress.addressType
            },
            permanentAddress: {
              ...prev.permanentAddress,
              street: userData.address || prev.permanentAddress.street,
              city: userData.city || prev.permanentAddress.city,
              state: userData.state || prev.permanentAddress.state,
              pincode: userData.pincode
                ? String(userData.pincode)
                : prev.permanentAddress.pincode,
              addressType: userData.address_code
                ? String(userData.address_code)
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
            amount: userData.applied_amount || userData.loan_amount || prev.amount,
            tenure: userData.tenure || userData.loan_tenure || prev.tenure,
            // Bank fields
            ifscCode: userData.ifsc_code || prev.ifscCode,
            bankName: userData.bank_name || prev.bankName,
            bankBranch: userData.branch_name || prev.bankBranch,
            accountNumber: userData.account_no || prev.accountNumber,
            accountType: userData.account_type || prev.accountType
          }));
        }

        // Step 4: Service Data
       if (userData.step >= 4) {
  setServiceData((prev) => ({
    ...prev,
    organizationName: userData.organisation_name || prev.organizationName,
    netMonthlySalary: userData.net_monthly_salary || prev.netMonthlySalary,
    monthlySalary: userData.gross_monthly_salary || prev.monthlySalary,
    designation: userData.designation || prev.designation,
    organizationAddress: userData.organisation_address || prev.organizationAddress,
    officePhone: userData.office_phone || prev.officePhone,
    hrName: userData.contact_person || prev.hrName,
    hrPhone: userData.hr_mobile || prev.hrPhone,
    hrEmail: userData.hr_mail || prev.hrEmail,
    website: userData.website || prev.website,
    officialEmail: userData.official_email || prev.officialEmail,
    familyIncome: userData.net_house_hold_income || prev.familyIncome,
    existingEmi: userData.existing_emi || prev.existingEmi,
    workingSince: {
      month: userData.work_since_mm || prev.workingSince.month,
      year: userData.work_since_yy || prev.workingSince.year
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
        const errorText = await response.text();
        console.error("Failed to fetch user data:", response.status, errorText);
        setErrorMessage(`Failed to load user data: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrorMessage("Network error. Please check your internet connection.");
      } else {
        setErrorMessage("Failed to load user data. Please try again.");
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    console.log("🔄 UserContext useEffect triggered:");
    console.log("- User:", user);
    console.log("- Current token state:", token);
    console.log("- Token in localStorage:", localStorage.getItem("token"));

    if (user && !loader) {
      setStep(user.step || 1);
      setUserId(user.id || user._id);

      try {
        const storedToken = localStorage.getItem("token");
        
        // Sync token: if localStorage has token but context doesn't, update context
        if (storedToken && storedToken !== token) {
          setToken(storedToken);
        }
        
        // Only fetch if we have token and don't already have the data
        if (storedToken && !personalData.firstName && user.step >= 2) {
          fetchAndPopulateUserData(user.id || user._id, storedToken);
        }
      } catch (error) {
        console.warn("Could not access localStorage:", error);
        setErrorMessage("Storage access error. Please check your browser settings.");
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
      photo: null,
      salarySlip1: null,
      salarySlip2: null,
      salarySlip3: null,
      bankStatement: null
    });
    setUploadStatus({
      aadharFront: { uploading: false, uploaded: false, error: null },
      aadharBack: { uploading: false, uploaded: false, error: null },
      panCard: { uploading: false, uploaded: false, error: null },
      photo: { uploading: false, uploaded: false, error: null },
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
