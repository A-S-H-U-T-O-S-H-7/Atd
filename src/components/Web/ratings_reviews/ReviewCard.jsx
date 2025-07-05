"use client"
import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, User, Calendar } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const [yesCount, setYesCount] = useState(review.yes || 0);
  const [noCount, setNoCount] = useState(review.no || 0);
  const [userVote, setUserVote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (type) => {
    if (isLoading || userVote) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.atdmoney.in/api/reviews/${type}/${review.review_id}`, {
        method: 'GET',
      });
      
      if (response.ok) {
        if (type === 'yes') {
          setYesCount(prev => prev + 1);
        } else {
          setNoCount(prev => prev + 1);
        }
        setUserVote(type);
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StarRating = ({ rating }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-white flex flex-col rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {review.selfie ? (
                <img 
                  src={review.selfie} 
                  alt="User" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">
                {review.name || 'Anonymous User'}
              </h4>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(review.created_at)}</span>
              </div>
            </div>
          </div>
          <StarRating rating={review.rating} />
        </div>

        {/* Review Text */}
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">
            {review.comments}
          </p>
        </div>

        {/* Admin Reply */}
        {review.reply && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <img 
                  src="/atdlogo.png" 
                  alt="User" 
                  className="w-full h-full rounded-full object-cover"
                />              </div>
              <span className="text-sm font-semibold     text-emerald-700">
                ATD Money
              </span>
            </div>
            <p className="text-sm text-blue-700">
              {review.reply}
            </p>
          </div>
        )}

        {/* Verified Badge
        {review.verified_by && (
          <div className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Verified by {review.verified_by}</span>
          </div>
        )} */}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Was this review helpful?
          </span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleVote('yes')}
              disabled={isLoading || userVote}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                userVote === 'yes'
                  ? 'bg-green-100 text-green-700'
                  : userVote
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 border border-gray-200'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Yes</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {yesCount}
              </span>
            </button>
            
            <button
              onClick={() => handleVote('no')}
              disabled={isLoading || userVote}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                userVote === 'no'
                  ? 'bg-red-100 text-red-700'
                  : userVote
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>No</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {noCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;