import LoanDetails from "@/components/Web/steps/LoanDetails"
import UserRegistration from "@/components/Web/UserRegistration"
import { UserContextProvider } from "@/lib/UserRegistrationContext"

function page() {
  return (
    <div>
      <UserContextProvider>
        
       
            <UserRegistration/>
            
      </UserContextProvider>
    </div>
  )
}

export default page
