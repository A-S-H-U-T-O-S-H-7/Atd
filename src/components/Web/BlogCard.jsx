
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';



const BlogPostCard = ({ post, animationIndex }) => {
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
      { threshold: 0.1 }
    );

    observer.observe(cardRef.current);
    return () => cardRef.current && observer.unobserve(cardRef.current);
  }, []);

  const formattedDate = post.publication_date 
    ? new Date(post.publication_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) 
    : '';

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
      style={{ transitionDelay: `${Math.min(animationIndex * 150, 600)}ms` }}
    >
      <Link href={`/blogs/${post.url}`} className="group block h-full">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
          <div className="h-48 overflow-hidden">
            <img
              src={post.featured_image || '/images/default-blog-image.jpg'}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-white to-gray-50">
            <p className="text-teal-600 text-sm mb-2">{formattedDate}</p>
            
            <h2 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors">
              {post.title}
            </h2>
            
            <p className="text-sm text-gray-600 flex-1 mb-3">{post.content}</p>
            
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

export default BlogPostCard;