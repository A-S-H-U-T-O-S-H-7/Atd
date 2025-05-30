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

const UserRegistration = () => {
  const { step } = useUser(); 
  return (
    <div>
      {step === 1 && <MobileVerification/>}
      {step === 2 && <EmailVerification/>}
      {step === 3 && <AadharVerification/>}
      {step === 4 && <PersonalDetails />}
      {step === 5 && <KYCDetails />}
      {step === 6 && <LoanDetails />}
      {step === 7 && <ServiceDetails />}
      {step === 8 && <BankDetails />}
      {step === 9 && <DocumentUpload /> }
      {step === 10 && <References />}

    </div>
  );
};

export default UserRegistration;
