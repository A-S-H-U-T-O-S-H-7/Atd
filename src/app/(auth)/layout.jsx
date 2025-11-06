// app/(auth)/layout.jsx
import { AuthProvider } from "@/lib/AuthContext";
import { UserContextProvider } from "@/lib/UserRegistrationContext";
import '../globals.css';

export const metadata = {
  title: 'ATD Money',
  description: 'Loan Application Platform',
};

export default function AuthLayout({ children }) {
  return (
    <AuthProvider>
      <UserContextProvider>
        {children}
      </UserContextProvider>
    </AuthProvider>
  );
}
