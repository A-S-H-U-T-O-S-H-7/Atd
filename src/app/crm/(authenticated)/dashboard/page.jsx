import ProtectedRoute from "@/components/Admin/ProtectedRoute";
import DashboardPage from "@/components/Admin/dashboard/DashboardPage";

export const metadata = {
  title: 'Dashboard - ATD Money',
};

export default function Dashboard() {
  return (
    <div >
      <ProtectedRoute requiredPermission="dashboard">
      <DashboardPage/>
      </ProtectedRoute>
    </div>
  );
}