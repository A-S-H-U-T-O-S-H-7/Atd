"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import ReviewsBanner from './Banner';
import RatingSummary from './RatingSummary';
import ReviewCard from './ReviewCard';

const INITIAL_LOAD = 10;
const BATCH_LOAD = 10;

const ReviewsPage = () => {
  const [allReviews, setAllReviews] = useState([]);
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  
  const loaderRef = useRef(null);
  const initialFetchCompleted = useRef(false);

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all reviews at once (you might want to adjust this based on your API)
      const response = await fetch(`https://api.atdmoney.in/api/reviews?page=1&limit=1000`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setAllReviews(data.data);
        setDisplayedReviews(data.data.slice(0, INITIAL_LOAD));
        setHasMore(data.data.length > INITIAL_LOAD);
        initialFetchCompleted.current = true;
      } else {
        throw new Error(data.message || 'Failed to load reviews');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialFetchCompleted.current) return;
    fetchAllReviews();
  }, []);

  const loadMoreReviews = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    // Simulate loading delay (like in blog page)
    setTimeout(() => {
      const currentReviewsCount = displayedReviews.length;
      const newReviews = allReviews.slice(
        currentReviewsCount,
        currentReviewsCount + BATCH_LOAD
      );

      if (newReviews.length > 0) {
        setDisplayedReviews(prev => [...prev, ...newReviews]);
      }

      setHasMore(
        currentReviewsCount + newReviews.length < allReviews.length
      );
      setLoadingMore(false);
    }, 300);
  }, [allReviews, displayedReviews.length, hasMore, loadingMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreReviews();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadMoreReviews]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ReviewsBanner />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-pulse flex space-x-3 justify-center mb-4">
                <div className="w-4 h-4 bg-blue-600 rounded-full" />
                <div className="w-4 h-4 bg-blue-600 rounded-full animation-delay-200" />
                <div className="w-4 h-4 bg-blue-600 rounded-full animation-delay-400" />
              </div>
              <p className="text-gray-600">Loading reviews...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ReviewsBanner />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 text-lg font-medium mb-2">Error Loading Reviews</p>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => {
                  initialFetchCompleted.current = false;
                  setError(null);
                  setLoading(true);
                  fetchAllReviews();
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <ReviewsBanner />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 -mt-8 relative z-10">
        
        {/* Rating Summary */}
        <div className="mb-12">
          <RatingSummary reviews={allReviews} />
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-800">
              All Reviews ({allReviews.length})
            </h3>
            <div className="text-sm text-gray-500">
              Showing {displayedReviews.length} of {allReviews.length} review{allReviews.length !== 1 ? 's' : ''}
            </div>
          </div>

          {displayedReviews.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {displayedReviews.map((review, index) => (
                  <ReviewCard key={`review-${review.review_id || index}`} review={review} />
                ))}
              </div>
              
              {/* Load More Section */}
              {hasMore && (
                <div
                  ref={loaderRef}
                  className="flex justify-center items-center py-10 mt-8"
                >
                  {loadingMore ? (
                    <div className="animate-pulse flex space-x-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full" />
                      <div className="w-3 h-3 bg-blue-600 rounded-full" />
                      <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    </div>
                  ) : (
                    <button
                      onClick={loadMoreReviews}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Load More Reviews
                    </button>
                  )}
                </div>
              )}
              
              {/* End of Results Indicator */}
              {!hasMore && displayedReviews.length > 0 && (
                <div className="text-center mt-12 text-gray-500">
                  <p>You've reached the end of all reviews</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Reviews Yet</h3>
              <p className="text-gray-500">Be the first to leave a review!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;