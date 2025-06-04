import LoanDetails from "@/components/Web/steps/LoanDetails";
import UserRegistration from "@/components/Web/UserRegistration";
import { UserContextProvider } from "@/lib/UserRegistrationContext";
import Profile from "../userProfile/page";

function page() {
  return (
    <div>
      <UserContextProvider>
        <UserRegistration />
      </UserContextProvider>
    </div>
  );
}

export default page;
