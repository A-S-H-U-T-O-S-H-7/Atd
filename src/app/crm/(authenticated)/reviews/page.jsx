import ProtectedRoute from "@/components/Admin/ProtectedRoute";
import ReviewPage from "@/components/Admin/review/Reviews";

function page() {
  return (
    <div>
      <ProtectedRoute requiredPermission="reviews">
      <ReviewPage />
      </ProtectedRoute>
    </div>
  );
}

export default page;
