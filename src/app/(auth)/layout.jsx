import { AuthProvider } from "@/lib/AuthContext";
import { UserContextProvider } from "@/lib/UserRegistrationContext";

function layout({ children }) {
  return (
    <div>
      <AuthProvider>
        <UserContextProvider>
          {children}
        </UserContextProvider>
      </AuthProvider>
    </div>
  );
}

export default layout;
