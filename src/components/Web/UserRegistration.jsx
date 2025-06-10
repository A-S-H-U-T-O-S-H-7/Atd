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
      {step === 1 && <MobileVerification/>}
      {step === 2 && <EmailVerification/>}
      {step === 3 && <AadharVerification/>}
      {step === 4 && <ReferralCode/>}
      {step === 5 && <PersonalDetails />}
      {step === 6 && <KYCDetails />}
      {step === 7 && <LoanDetails />}
      {step === 8 && <ServiceDetails />}
      {step === 9 && <BankDetails />}
      {step === 10 && <DocumentUpload /> }
      {step === 11 && <References />}
      
    </div>
  );
};

export default UserRegistration;
