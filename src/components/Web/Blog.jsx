"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_ATD_API;
        const response = await fetch(`${BASE_URL}/api/blogs?limit=3&status=2`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        // Handle different API response formats
        if (Array.isArray(data)) {
          setBlogPosts(data);
        } else if (data && Array.isArray(data.data)) {
          setBlogPosts(data.data);
        } else if (data && data.blogs && Array.isArray(data.blogs)) {
          setBlogPosts(data.blogs);
        } else if (data && typeof data === 'object') {
          const dataArray = Object.values(data).filter(item => 
            item && typeof item === 'object' && item.title && item.featured_image
          );
          
          if (dataArray.length > 0) {
            setBlogPosts(dataArray);
          } else {
            throw new Error('Could not extract blog posts from API response');
          }
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError(error.message);
        setBlogPosts([]);
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="px-4 md:px-10 py-10 bg-[#faf2fa]">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Loading blogs...</h2>
        </div>
      </div>
    );
  }

  // Show error state if there's an error and no posts
  if (error && blogPosts.length === 0) {
    return (
      <div className="px-4 md:px-10 py-10 bg-[#faf2fa]">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Unable to load blogs</h2>
          <p className="text-gray-700 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  // If no blog posts are available after loading, show empty state
  if (blogPosts.length === 0) {
    return (
      <div className="px-4 md:px-10 py-10 bg-[#faf2fa]">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">No blogs available</h2>
          <p className="text-gray-700 mt-2">Check back soon for new content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 py-10 bg-[#faf2fa]">
      <div className="pb-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-center">Blogs</h2>
        <p className="text-gray-700 text-base md:text-lg text-center mt-2">
          Explore insights, tips, and stories curated just for you
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Featured Blog Post - Wider Left Column (2/4) */}
        {blogPosts.length > 0 && (
          <div className="lg:col-span-2">
            <Link href={`/blogs/${blogPosts[0].url || blogPosts[0].slug || blogPosts[0].id}`} className="block h-full">
              <div className="border rounded-lg shadow-sm hover:shadow-lg transition duration-300 h-full cursor-pointer">
                <div className="relative p-2">
                  <div className="relative h-60 md:h-120 w-full">
                    <Image 
                      src={blogPosts[0].featured_image || "/placeholder.png"}
                      alt={blogPosts[0].title || "Blog post"}
                      fill
                      className="object-cover rounded-lg"
                      priority
                    />
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-medium mb-2">{blogPosts[0].title}</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4">{blogPosts[0].content}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-teal-600 hover:text-teal-800 font-medium">
                      Read More
                    </span>
                    <p className="text-gray-500 text-sm">{blogPosts[0].date || new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Side Column Blog Posts - Narrower Right Column (2/4) */}
        <div className="lg:col-span-2 flex flex-col justify-between gap-6">
          {blogPosts.slice(1, 3).map((post, index) => (
            <Link key={post.id || index} href={`/blogs/${post.url || post.slug || post.id}`} className="block h-full">
              <div className="border flex items-center rounded-lg shadow-sm hover:shadow-lg transition duration-300 h-full cursor-pointer">
                <div className="flex flex-col items-center justify-center md:flex-row">
                  <div className="relative w-full md:w-2/5 h-50 p-2">
                    <div className="relative h-full w-full">
                      <Image 
                        src={post.featured_image || "/placeholder.png"}
                        alt={post.title || "Blog post"}
                        fill
                        className="object-cover rounded-lg"
                        priority
                      />
                    </div>
                  </div>
                  <div className="p-4 md:p-6 md:w-3/5 flex flex-col gap-2 justify-between">
                    <div>
                      <h3 className="text-lg md:text-xl font-medium mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm md:text-base">{post.content}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-teal-600 hover:text-teal-800 font-medium">
                        Read More
                      </span>
                      <p className="text-gray-500 text-sm">{post.date || new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Explore More Button */}
      <div className="flex justify-center mt-8 md:mt-12">
        <Link href="/blogs" className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-lg transition duration-300">
          Explore More 
        </Link>
      </div>
    </div>
  );
}

export default Blog;