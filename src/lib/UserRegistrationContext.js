"use client"
import { createContext,useState,useContext } from "react"
const UserContext = createContext();

export const UserContextProvider = ({children}) => {

  // Step 1: Phone Number and Verification Data
  const [phoneData, setPhoneData] = useState({
    phoneNumber: "",
    phoneOtp: "",
    isPhoneVerified: false,
    agreeToTerms: false ,
    userid: null,
  });

  // Step 2: Email and Verification Data
  const [emailData, setEmailData] = useState({
    email: "",
    emailOtp: "",
    isEmailVerified: false,
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

  // Step 4: Personal Details
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
    },
    permanentAddress: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      isSameAsCurrent: false,
    },
    fatherName: "",
    familyReference: {
      name: "",
      mobileNumber: "",
      email: "",
      relation: "",
      address: "",
    },
  });

  // Step 5: KYC Details Data 
  const [kycData, setKycData] = useState({
    panNumber: "",
    crnNumber: "",
    accountId: "", 
  });
  

  // Step 6: Loan Details
    const [loanData, setLoanData] = useState({
      isSalaried: "",
      state: "",
      amount: "",
      city: "",
      tenure: "", 
      
  });

  // Step 7: Service/Employment Details
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

  // Step 8: Bank Details
  const [bankData, setBankData] = useState({
    ifscCode: "",
    bankName: "",
    bankBranch: "",
    accountNumber: "",
    confirmAccountNumber: "",
    accountType: "",
    
  });

  // Step 9: Document Upload Data
  const [documentData, setDocumentData] = useState({
    aadharFront: null,
    aadharBack: null,
    panCard: null,
    photo: null,
    salarySlip1: null, 
    salarySlip2: null, 
    salarySlip3: null, 
    bankStatement: null,
    
  });

  const [uploadStatus, setUploadStatus] = useState({
    documentData,
    setDocumentData,
   
  });


  // Step 10: References Data
  const [referenceData, setReferenceData] = useState({
    references: [
      { name: "", phone: "", email: "" },
      { name: "", phone: "", email: "" },
      { name: "", phone: "", email: "" },
      { name: "", phone: "", email: "" },
      { name: "", phone: "", email: "" },
    ],
  });

  // Application State Management
  const [userId, setUserId] = useState("");
  const [step, setStep] = useState(1);
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Helper function to copy current address to permanent
  const copyCurrentToPermanent = () => {
    setPersonalData(prev => ({
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
      agreeToTerms: false ,
      userid: null,
    });
    setEmailData({
      email: "",
      emailOtp: "",
      isEmailVerified: false,
            // googleUser: null
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
        pincode: "",
      },
      permanentAddress: {
        street: "",
        city: "",
        state: "",
        pincode: "",
        isSameAsCurrent: false,
      },
      fatherName: "",
      familyReference: {
        name: "",
        mobileNumber: "",
        email: "",
        relation: "",
        address: "",
      },
    });
    setLoanData({
      isSalaried: "",
      state: "",
      amount: "",
      city: "",
      tenure: "",
      
    });
   
    setKycData({
      panNumber: "",
      crnNumber: "",
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
      designation: "",
      existingEmi: "",
      workingSince: {
        from: "",
        to: "",
      },
    });
    setBankData({
      ifscCode: "",
      bankName: "",
      bankBranch: "",
      accountNumber: "",
      confirmAccountNumber: "",
      accountType: "",
      
    });
    setDocumentData({
      aadharFront: null,
      aadharBack: null,
      panCard: null,
      photo: null,
      salarySlip1: null,
      salarySlip2: null,
      salarySlip3: null,
      bankStatement: null,
    });
    setReferenceData({
      references: [
        { name: "", phone: "", email: "" },
        { name: "", phone: "", email: "" },
        { name: "", phone: "", email: "" },
        { name: "", phone: "", email: "" },
        { name: "", phone: "", email: "" },
      ],
    });
    setStep(1);
    setUserId("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <UserContext.Provider
      value={{
        // Data States
        phoneData,
        setPhoneData,
        emailData,
        setEmailData,
        aadharData,
        setAadharData,
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
        resetAllData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useUser must be used within a UserRegistrationProvider"
    );
  }
  return context;
};