import ProtectedRoute from "@/components/Admin/ProtectedRoute";
import DashboardPage from "@/components/Admin/dashboard/DashboardPage";


export default function Dashboard() {
  return (
    <div >
      <ProtectedRoute requiredPermission="dashboard">
      <DashboardPage/>
      </ProtectedRoute>
    </div>
  );
}