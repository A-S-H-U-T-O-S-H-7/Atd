import React from 'react';
import { Star } from 'lucide-react';

const RatingSummary = ({ reviews }) => {
  const totalReviews = reviews.length;
  
  // Calculate average rating
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
    : 0;

  // Calculate rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => 
    reviews.filter(review => review.rating === rating).length
  );

  const getPercentage = (count) => totalReviews > 0 ? (count / totalReviews) * 100 : 0;

  const StarRating = ({ rating, size = 'w-5 h-5' }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Average Rating */}
        <div className="text-center md:text-left">
          <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-4">
            <div className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              {avgRating}
            </div>
            <StarRating rating={Math.round(avgRating)} size="w-6 h-6 md:w-7 md:h-7" />
            <p className="text-gray-600 mt-2 font-medium">
              Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Rating Bars */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating, index) => (
            <div key={rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-8">
                <span className="text-sm font-medium text-gray-700">{rating}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
              
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${getPercentage(ratingCounts[index])}%` }}
                ></div>
              </div>
              
              <span className="text-sm text-gray-600 w-12 text-right">
                {ratingCounts[index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;