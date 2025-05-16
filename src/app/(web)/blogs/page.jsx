'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

// Expanded blog posts array with more items
const allBlogPosts = [
  {
    id: 1,
    title: "How to Manage Your Finances with ATD",
    summary: "Learn the best practices to manage your loans and repayments efficiently.",
    image: "/images/finance-tips.jpg",
    slug: "manage-finances-atd",
    date: "2025-05-10",
  },
  {
    id: 2,
    title: "Why Choose ATD Money for Your Loan Needs?",
    summary: "Discover why thousands trust ATD for fast, easy, and secure loans.",
    image: "/heroimage2.png",
    slug: "why-choose-atd-money",
    date: "2025-05-05",
  },
  {
    id: 3,
    title: "Top 5 Mistakes to Avoid When Applying for a Loan",
    summary: "Avoid these common pitfalls to ensure your loan application gets approved quickly.",
    image: "/images/loan-mistakes.jpg",
    slug: "top-loan-mistakes-to-avoid",
    date: "2025-05-01",
  },
  {
    id: 4,
    title: "Understanding Interest Rates: What You Need to Know",
    summary: "A comprehensive guide to understanding how interest rates affect your loans.",
    image: "/images/interest-rates.jpg",
    slug: "understanding-interest-rates-guide",
    date: "2025-04-28",
  },
  {
    id: 5,
    title: "Building Credit Score with Small Loans",
    summary: "How taking small, manageable loans can help build your credit score over time.",
    image: "/images/credit-score.jpg",
    slug: "building-credit-with-loans",
    date: "2025-04-25",
  },
  {
    id: 6,
    title: "Emergency Funds: Why You Need One",
    summary: "Learn why having an emergency fund is crucial and how to build one efficiently.",
    image: "/images/emergency-fund.jpg",
    slug: "importance-of-emergency-funds",
    date: "2025-04-22",
  },
  {
    id: 7,
    title: "Loan Consolidation: Is It Right for You?",
    summary: "Explore the pros and cons of consolidating multiple loans into one payment.",
    image: "/images/loan-consolidation.jpg",
    slug: "is-loan-consolidation-right-for-you",
    date: "2025-04-18",
  },
  {
    id: 8,
    title: "Financial Planning for Young Professionals",
    summary: "Start your financial journey right with these essential tips for young earners.",
    image: "/images/young-professionals.jpg",
    slug: "young-professionals-financial-guide",
    date: "2025-04-15",
  },
  {
    id: 9,
    title: "Understanding Loan Terms and Conditions",
    summary: "A beginner's guide to decoding the fine print in loan agreements.",
    image: "/images/loan-terms.jpg",
    slug: "decoding-loan-terms-conditions",
    date: "2025-04-12",
  },
  {
    id: 10,
    title: "How to Budget After Taking a Loan",
    summary: "Effective strategies to manage your budget while repaying your loan.",
    image: "/images/budgeting.jpg",
    slug: "budgeting-with-loan-repayments",
    date: "2025-04-08",
  },
  {
    id: 11,
    title: "Digital Banking: The Future of Finance",
    summary: "How technology is transforming the way we manage money and loans.",
    image: "/images/digital-banking.jpg",
    slug: "future-of-digital-banking",
    date: "2025-04-05",
  },
  {
    id: 12,
    title: "Secured vs Unsecured Loans: Which to Choose?",
    summary: "Understanding the key differences between secured and unsecured loan options.",
    image: "/images/loan-types.jpg",
    slug: "secured-vs-unsecured-loans-guide",
    date: "2025-04-01",
  },
];

// Number of posts to load initially and in each subsequent batch
const INITIAL_LOAD = 4;
const BATCH_LOAD = 4;

// BlogPostCard component extracted outside the main component to prevent re-creation
const BlogPostCard = ({ post, animationIndex, uniqueKey }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.unobserve(cardRef.current);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`transition-all duration-700 transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-16'
      }`}
      style={{ transitionDelay: `${Math.min(animationIndex * 150, 600)}ms` }}
    >
      <Link
        href={`/blogs/${post.slug}`}
        className="group block h-full"
      >
        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
          {/* Image container */}
          <div className="h-48 overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          </div>
          
          {/* Content container */}
          <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-white to-gray-50">
            {/* Date */}
            <p className="text-teal-600 text-sm mb-2">
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
            
            {/* Heading */}
            <h2 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors">
              {post.title}
            </h2>
            
            {/* Summary */}
            <p className="text-sm text-gray-600 flex-1 mb-3">{post.summary}</p>
            
            {/* Read more link */}
            <div className="mt-auto">
              <span className="text-sm text-teal-600 font-medium inline-flex items-center group-hover:translate-x-1 transition-transform">
                Read More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default function BlogPage() {
  // State to track visible posts and loading state
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const loaderRef = useRef(null);
  const observerRef = useRef(null);
  const loadingStateRef = useRef(false); // Ref to track loading state for observer
  
  // Load initial posts
  useEffect(() => {
    // Add unique keys to blog posts to ensure React rendering stability
    const initialPosts = allBlogPosts.slice(0, INITIAL_LOAD);
    setDisplayedPosts(initialPosts);
    setHasMorePosts(allBlogPosts.length > INITIAL_LOAD);
  }, []);

  // Load more posts function
  const loadMorePosts = useCallback(() => {
    if (loadingStateRef.current || !hasMorePosts) return;
    
    setIsLoading(true);
    loadingStateRef.current = true;
    
    // Use a setTimeout to simulate loading - can be removed in production if not needed
    setTimeout(() => {
      const currentPostsCount = displayedPosts.length;
      const newPosts = allBlogPosts.slice(
        currentPostsCount, 
        currentPostsCount + BATCH_LOAD
      );
      
      if (newPosts.length > 0) {
        setDisplayedPosts(prevPosts => [...prevPosts, ...newPosts]);
      }
      
      // Check if there are more posts to load
      const remainingPosts = allBlogPosts.length - (currentPostsCount + newPosts.length);
      setHasMorePosts(remainingPosts > 0);
      setIsLoading(false);
      loadingStateRef.current = false;
    }, 500);
  }, [displayedPosts.length, hasMorePosts]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    // Clean up previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    if (!loaderRef.current || !hasMorePosts) return;
    
    const handleObserver = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMorePosts && !loadingStateRef.current) {
        loadMorePosts();
      }
    };
    
    // Create new observer
    observerRef.current = new IntersectionObserver(handleObserver, { 
      threshold: 0.1,
      rootMargin: '200px'
    });
    
    observerRef.current.observe(loaderRef.current);
    
    // Clean up function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [hasMorePosts, loadMorePosts]);

  return (
    <div className="min-h-screen pt-5 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Banner Section */}
      <div className="mx-4 md:mx-10 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">ATD Money Blog</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Insights, tips, and guidance to help you make smarter financial decisions
          </p>
        </div>
      </div>
      
      {/* Blog Posts Grid */}
      <div className="px-4 lg:px-10 py-16">
        <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayedPosts.map((post, index) => (
            <BlogPostCard 
              key={`blog-post-${post.id}-${index}`} 
              post={post} 
              animationIndex={index % 4} 
              uniqueKey={`${post.id}-${index}`}
            />
          ))}
        </div>
        
        {/* Loading indicator - only show if there are more posts to load */}
        {hasMorePosts && (
          <div 
            ref={loaderRef} 
            className="flex justify-center items-center py-10 mt-8"
          >
            {isLoading ? (
              <div className="animate-pulse flex space-x-2">
                <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
                <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
                <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
              </div>
            ) : (
              <div className="h-8"> </div> /* Invisible placeholder to trigger intersection */
            )}
          </div>
        )}
        
        {/* End of content message */}
        {!hasMorePosts && displayedPosts.length > 0 && (
          <div className="text-center mt-12 text-gray-500">
            <p>You've reached the end of our blog posts</p>
          </div>
        )}
      </div>
    </div>
  );
}