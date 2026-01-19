import { Suspense } from 'react';
import DocumentViewer from './DocumentViewer';

export default function DocumentViewerPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Loading document viewer...</p>
          <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    }>
      <DocumentViewer />
    </Suspense>
  );
}