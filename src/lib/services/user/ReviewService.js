// services/reviewService.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://live.atdmoney.com/api';

export const submitReview = async (token, reviewData) => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  try {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "crnno": reviewData.crnno,
      "comments": reviewData.comments || "",
      "rating": reviewData.rating
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch(`${API_BASE_URL}/user/review`, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to submit review: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

