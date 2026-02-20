import ProtectedRoute from "@/components/Admin/ProtectedRoute";
import ReviewPage from "@/components/Admin/review/Reviews";

export const metadata = {
  title: 'Reviews - ATD Money',
};

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
