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

  // Step 2: Email and Verification Data
  const [emailData, setEmailData] = useState({
    email: "",
    emailOtp: "",
    isEmailVerified: false
  });

  // Step 3: Aadhar Verification Data
  const [aadharData, setAadharData] = useState({
    aadharNumber: "",
    aadharOtp: "",
    isAadharVerified: false,

    fullName: "",
    dob: "",
    gender: "",
    careOf: "",

    address: {
      country: "",
      state: "",
      dist: "",
      subdist: "",
      vtc: "",
      po: "",
      loc: "",
      street: "",
      house: "",
      landmark: ""
    },
    zip: ""
  });

  // Step 4: referral details
  const [referralData, setReferralData] = useState({
    referralCode: "",
    referrerId: null,
    referrerName: "",
    isVerified: false
  });

  // Step 5: Personal Details
  const [personalData, setPersonalData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    alternativeEmail: "",
    dob: "",
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

  // Step 6: KYC Details Data
  const [kycData, setKycData] = useState({
    panNumber: "",
    crnNumber: "",
    accountId: ""
  });

  // Step 7: Loan Details
  const [loanData, setLoanData] = useState({
    isSalaried: "",

    amount: "",

    tenure: ""
  });

  // Step 8: Service/Employment Details
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

  // Step 9: Bank Details
  const [bankData, setBankData] = useState({
    ifscCode: "",
    bankName: "",
    bankBranch: "",
    accountNumber: "",
    confirmAccountNumber: "",
    accountType: ""
  });

  // Step 10: Document Upload Data
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

  // Upload Status Tracking
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

  // Step 11: References Data
  const [referenceData, setReferenceData] = useState({
    references: [
      { name: "", phone: "", email: "" },
      { name: "", phone: "", email: "" },
      { name: "", phone: "", email: "" },
      { name: "", phone: "", email: "" },
      { name: "", phone: "", email: "" }
    ]
  });

  // Application State Management
  const [userId, setUserId] = useState("");
  const [step, setStep] = useState(null);
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.step) {
       
      setStep(user.step + 1);
      setUserId(user.id || user._id);
  
      setPhoneData((prev) => ({
        ...prev,
        phoneNumber: user.phone || prev.phoneNumber,
        isPhoneVerified: user.phoneVerified || true, 
        userid: user.id,
      }));

      
      if (user.step >= 5) {
        setPersonalData(prev => ({
          ...prev,
          firstName: user.fname || prev.firstName,
          lastName: user.lname || prev.lastName,
          dob: user.dob || prev.dob,
          gender: user.gender || prev.gender,
          fatherName: user.fathername || prev.fatherName,
          
        }));
      }
    } else {
      setStep(1);
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

  // Helper function to reset all data
  const resetAllData = () => {
    setPhoneData({
      phoneNumber: "",
      phoneOtp: "",
      isPhoneVerified: false,
      agreeToTerms: false,
      userid: null
    });
    setEmailData({
      email: "",
      emailOtp: "",
      isEmailVerified: false
    });
    setAadharData({
      aadharNumber: "",
      aadharOtp: "",
      isAadharVerified: false,
      fullName: "",
      dob: "",
      gender: "",
      careOf: "",
      address: {
        country: "",
        state: "",
        dist: "",
        subdist: "",
        vtc: "",
        po: "",
        loc: "",
        street: "",
        house: "",
        landmark: ""
      },
      zip: ""
    });
    setReferralData({
      referralCode: "",
      referrerId: null,
      referrerName: "",
      isVerified: false
    });
    setPersonalData({
      firstName: "",
      lastName: "",
      gender: "",
      alternativeEmail: "",
      dob: "",
      currentAddress: {
        street: "",
        city: "",
        state: "",
        pincode: ""
      },
      permanentAddress: {
        street: "",
        city: "",
        state: "",
        pincode: "",
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
    setLoanData({
      isSalaried: "",

      amount: "",

      tenure: ""
    });
    setKycData({
      panNumber: "",
      crnNumber: "",
      accountId: ""
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
    setBankData({
      ifscCode: "",
      bankName: "",
      bankBranch: "",
      accountNumber: "",
      confirmAccountNumber: "",
      accountType: ""
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
      ]
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
        emailData,
        setEmailData,
        aadharData,
        setAadharData,
        referralData,
        setReferralData,
        personalData,
        setPersonalData,
        loanData,
        setLoanData,
        kycData,
        setKycData,
        serviceData,
        setServiceData,
        bankData,
        setBankData,
        documentData,
        setDocumentData,
        uploadStatus,
        setUploadStatus,
        referenceData,
        setReferenceData,

        // Application States
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

        // Helper Functions
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
