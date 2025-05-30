import AboutUs from "@/components/Web/AboutUs"
import BankDetails from "@/components/Web/steps/BankDetails"
import DocumentUpload from "@/components/Web/steps/DocumnetUpload"
import KYCDetails from "@/components/Web/steps/KYCDetails"
import LoanDetails from "@/components/Web/steps/LoanDetails"
import PersonalDetails from "@/components/Web/steps/PersonalDetails"
import References from "@/components/Web/steps/References"
import ServiceDetails from "@/components/Web/steps/ServiceDetails"
import UserRegistration from "@/components/Web/UserRegistration"
import { UserContextProvider } from "@/lib/UserRegistrationContext"

function page() {
  return (
    <div>
      <AboutUs/>
      <UserContextProvider>
      <PersonalDetails/>
      </UserContextProvider>

    </div>
  )
}

export default page
