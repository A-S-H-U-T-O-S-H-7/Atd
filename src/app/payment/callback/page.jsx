import { Suspense } from 'react';
import CallbackContent from './CallbackContent';

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment verification...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}