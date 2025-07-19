"use client";

import BankDetails from "@/components/Web/steps/BankDetails";
import DocumentUpload from "@/components/Web/steps/DocumnetUpload";
import LoanDetails from "@/components/Web/steps/LoanDetails";
import PersonalDetails from "@/components/Web/steps/PersonalDetails";
import References from "@/components/Web/steps/References";
import ServiceDetails from "@/components/Web/steps/ServiceDetails";
import KYCDetails from "./steps/KYCDetails";
import { useUser } from "@/lib/UserRegistrationContext";
import MobileVerification from "./steps/Signup";
import EmailVerification from "./steps/EmailVerification";
import AadharVerification from "./steps/AadharVerification";
import ReferralCode from "./steps/ReferalCode";

const UserRegistration = () => {
  const { step } = useUser(); 
  
if (step === null) {
  return <div>Loading...</div>; 
}
  return (
    <div>
      {/* {step === 1 && <MobileVerification/>}
      {step === 2 && <EmailVerification/>}
      {step === 3 && <AadharVerification/>} */}

      {step === 1 && <ReferralCode/>}
      {step === 2 && <PersonalDetails />}
      {step === 3 && <KYCDetails />}
      {step === 4 && <LoanDetails />}
      {step === 5 && <ServiceDetails />}
      {step === 6 && <BankDetails />}
      {step === 7 && <DocumentUpload /> }
      {step === 8 && <References />}
      
    </div>
  );
};

export default UserRegistration;
