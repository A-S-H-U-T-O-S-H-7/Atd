'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Loader2, Clock, Tag } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_ATD_API;

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlogPost() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/api/blog/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Blog post not found');
          }
          throw new Error('Failed to fetch blog post');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setBlogPost(data.data);
        } else {
          throw new Error(data.message || 'Invalid data format received from API');
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  // Format publication date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-50 pb-16">
      

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-32">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-teal-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
            <p className="text-red-500 mb-6">{error}</p>
            <Link
              href="/blogs"
              className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors inline-block"
            >
              Return to Blog
            </Link>
          </div>
        </div>
      )}

      {/* Blog post content */}
      {blogPost && !isLoading && !error && (
        <>
          {/* Hero section with featured image */}
<div className="relative mx-10 text-white overflow-hidden rounded-xl shadow-lg h-126">
  {blogPost.featured ? (
    <div className="relative w-full h-full">
      <Image
        src={blogPost.featured}
        alt={blogPost.title}
        fill
        className="object-cover" 
        priority
        sizes="100vw"
        onError={(e) => {
          e.target.style.display = 'none';
          console.error('Failed to load image:', blogPost.featured);
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 to-gray-900/70" />
    </div>
  ) : (
    <div className="absolute inset-0 bg-gradient-to-r from-teal-700 to-blue-700" />
  )}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
    <div className="flex flex-wrap gap-2 mb-4">
      {blogPost.tags && blogPost.tags.map((tag, index) => (
        <span key={index} className="bg-teal-600/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          {tag}
        </span>
      ))}
    </div>
  </div>
</div>
          <div className='flex flex-col gap-3 text-center items-center text-teal-800 px-10 pt-5'>
          <h1 className="text-3xl md:text-5xl font-semibold  leading-tight">{blogPost.title}</h1>
          <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{formatDate(blogPost.publication_date)}</span>
                </div>
                </div>

          {/* Article content */}
          <div className=" px-4 md:px-10  py-12">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 transition-all hover:shadow-xl">
              {blogPost.summary && (
                <div className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-teal-500 italic text-gray-700">
                  {blogPost.summary}
                </div>
              )}
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-a:text-teal-600 prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />
              
            </div>
            
           
            
            {/* Back to all blogs button */}
            <div className="mt-12 text-center">
              <Link 
                href="/blogs" 
                className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to all blogs
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}