import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, Send, AlertCircle } from 'lucide-react';
import { submitReview } from '@/lib/services/user/ReviewService';
import { TokenManager } from '@/utils/tokenManager';
import toast from 'react-hot-toast';

const ReviewSection = ({ user }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);

  // Get token info from TokenManager
  useEffect(() => {
    const tokenData = TokenManager.getToken();
    setTokenInfo(tokenData);
    
    // Since we don't have GET API, we can check localStorage for previous review
    const checkLocalReview = () => {
      try {
        const savedReview = localStorage.getItem(`user_review_${user?.user_id}`);
        if (savedReview) {
          const reviewData = JSON.parse(savedReview);
          setRating(reviewData.rating || 0);
          setReview(reviewData.comments || '');
        }
      } catch (error) {
        console.log('No saved review found');
      }
    };
    
    if (user?.user_id) {
      checkLocalReview();
    }
  }, [user?.user_id]);

  const handleStarClick = (starIndex) => {
    setRating(starIndex + 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      toast.error('Please select a rating');
      return;
    }

    if (!tokenInfo?.token) {
      setError('Authentication required. Please login again.');
      toast.error('Please login to submit a review');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const reviewData = {
        crnno: user?.crnno || user?.application_id || user?.user_id?.toString() || 'N/A',
        comments: review.trim(),
        rating: rating
      };

      const result = await submitReview(tokenInfo.token, reviewData);
      
      if (result.success) {
        setSubmitted(true);
        toast.success('Review submitted successfully!');
        
        // Save to localStorage for future reference
        if (user?.user_id) {
          localStorage.setItem(`user_review_${user.user_id}`, JSON.stringify({
            rating: rating,
            comments: review.trim(),
            submittedAt: new Date().toISOString()
          }));
        }
        
        // Reset after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        throw new Error(result.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      setError(error.message || 'Failed to submit review. Please try again.');
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  // Check if user has previously submitted (from localStorage)
  const hasPreviousReview = () => {
    if (!user?.user_id) return false;
    try {
      return localStorage.getItem(`user_review_${user.user_id}`) !== null;
    } catch {
      return false;
    }
  };

  const previousReviewExists = hasPreviousReview();

  return (
    <div className="bg-white rounded-2xl shadow-md border border-dashed border-orange-300 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-50 to-amber-100 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Rate Our App</h3>
              <p className="text-sm text-slate-600">Share your experience with us</p>
            </div>
          </div>
          {previousReviewExists && !submitted && (
            <div className="flex items-center space-x-1 text-blue-600 text-sm bg-blue-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4" />
              <span>Rated: {rating}★</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Rating Stars */}
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-600 mb-3">
            How would you rate our app?
            <span className="text-red-500 ml-1">*</span>
          </p>
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                onClick={() => handleStarClick(index)}
                disabled={isSubmitting || previousReviewExists}
                className="transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Star
                  className={`w-8 h-8 ${
                    index < rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 hover:text-yellow-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-slate-600 font-medium">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>

        {/* Review Text Area and Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1 w-full">
            <textarea
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyPress}
              placeholder={previousReviewExists ? "You can update your previous review" : "Write your review here... (Optional)"}
              disabled={isSubmitting}
              className="w-full p-4 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              rows="3"
              maxLength={500}
            />
            <div className="text-right mt-1">
              <span className={`text-xs ${review.length >= 500 ? 'text-red-500' : 'text-slate-400'}`}>
                {review.length}/500
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full sm:w-auto flex justify-center sm:justify-start">
            {submitted ? (
              <div className="flex items-center justify-center space-x-2 text-green-600 font-semibold px-6 py-3 animate-pulse">
                <ThumbsUp className="w-5 h-5" />
                <span>Thank you for your feedback!</span>
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting || (previousReviewExists && !review.trim())}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 whitespace-nowrap disabled:cursor-not-allowed ${
                  rating > 0 && !isSubmitting
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : previousReviewExists ? (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Update Review</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Helper Text */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            {tokenInfo?.type === 'admin_view' 
              ? "Admin view mode - You can't submit reviews"
              : previousReviewExists
                ? "You've already submitted a review. You can update it if you wish."
                : "Your review helps us improve our services. Click stars to rate, comments are optional."}
          </p>
          {tokenInfo?.type === 'admin_view' && (
            <p className="text-xs text-orange-600 mt-1">
              Login as user to submit a review
            </p>
          )}
          {previousReviewExists && !tokenInfo?.type === 'admin_view' && (
            <p className="text-xs text-blue-600 mt-1">
              Note: Updating will replace your previous review
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;