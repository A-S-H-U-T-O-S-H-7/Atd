"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from "@/lib/UserRegistrationContext";

export default function BasicProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUserId, phoneData } = useUser();
  
  // Get userId from URL or context or localStorage
  const getUserId = () => {
    const urlUserId = searchParams.get('userId');
    const contextUserId = phoneData.userid;
    const localStorageUserId = localStorage.getItem('userId');
    
    return urlUserId || contextUserId || localStorageUserId;
  };

  useEffect(() => {
    const userId = getUserId();
    
    if (!userId) {
      // No userId found, redirect to signup
      router.push('/user_signup');
      return;
    }

    // Update context with userId if not already set
    if (!phoneData.userid) {
      updateUserId(userId);
    }

    // Fetch user profile
    fetchUserProfile(userId);
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_ATD_API}/api/registration/user/${userId}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setUserProfile(result.user);
      } else {
        setError(result.message || "Failed to fetch user profile");
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setError("Error fetching profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    const userId = getUserId();
    
    if (!userId) {
      setError("User ID not found. Please signup again.");
      return;
    }

    // Navigate to multi-step form starting from referral step
    // Pass userId in URL to ensure it's available
    router.push(`/loan-registration?userId=${userId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => router.push('/signup')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Signup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>
          
          {userProfile && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <p className="mt-1 text-gray-900">{userProfile.fname}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <p className="mt-1 text-gray-900">{userProfile.lname}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <p className="mt-1 text-gray-900">{userProfile.dob}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-gray-900">{userProfile.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{userProfile.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <p className="mt-1 text-gray-900">{userProfile.company}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Net Salary</label>
                  <p className="mt-1 text-gray-900">₹{userProfile.netsalary}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account ID</label>
                  <p className="mt-1 text-gray-900">{userProfile.accountId}</p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleApplyClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200"
                >
                  Apply Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}