import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Send } from 'lucide-react';

const ReviewSection = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (starIndex) => {
    setRating(starIndex + 1);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      setSubmitted(true);
      // Reset after 2 seconds for demo
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setReview('');
      }, 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-dashed border-orange-300 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-50 to-amber-100 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Rate Our App</h3>
            <p className="text-sm text-slate-600">Share your experience with us</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Rating Stars */}
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-600 mb-3">How would you rate our app?</p>
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                onClick={() => handleStarClick(index)}
                className="transition-all duration-200 transform hover:scale-110"
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

        {/* Review Text Area */}
        <div>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review here... (optional)"
            className="w-full p-4 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-slate-50"
            rows="3"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          {submitted ? (
            <div className="flex items-center justify-center space-x-2 text-green-600 font-semibold">
              <ThumbsUp className="w-5 h-5" />
              <span>Thank you for your feedback!</span>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 mx-auto ${
                rating > 0
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Submit Review</span>
            </button>
          )}
        </div>

       
      </div>
    </div>
  );
};

export default ReviewSection;