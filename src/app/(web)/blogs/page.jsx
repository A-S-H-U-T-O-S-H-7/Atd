"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import BlogPostCard from "@/components/Web/BlogCard";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_ATD_API;

const INITIAL_LOAD = 4;
const BATCH_LOAD = 4;

export default function BlogPage() {
  const [allBlogPosts, setAllBlogPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [error, setError] = useState(null);

  const loaderRef = useRef(null);
  const initialFetchCompleted = useRef(false);

  useEffect(() => {
    if (initialFetchCompleted.current) return;

    async function fetchBlogPosts() {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/api/blogs`);

        if (!response.ok) throw new Error("Failed to fetch blog posts");

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setAllBlogPosts(data.data);
          setDisplayedPosts(data.data.slice(0, INITIAL_LOAD));
          setHasMorePosts(data.data.length > INITIAL_LOAD);
          initialFetchCompleted.current = true;
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  const loadMorePosts = useCallback(
    () => {
      if (isLoadingMore || !hasMorePosts) return;

      setIsLoadingMore(true);

      setTimeout(() => {
        const currentPostsCount = displayedPosts.length;
        const newPosts = allBlogPosts.slice(
          currentPostsCount,
          currentPostsCount + BATCH_LOAD
        );

        if (newPosts.length > 0) {
          setDisplayedPosts(prev => [...prev, ...newPosts]);
        }

        setHasMorePosts(
          currentPostsCount + newPosts.length < allBlogPosts.length
        );
        setIsLoadingMore(false);
      }, 300);
    },
    [allBlogPosts, displayedPosts.length, hasMorePosts, isLoadingMore]
  );

  useEffect(
    () => {
      if (!loaderRef.current || !hasMorePosts || isLoading) return;

      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMorePosts && !isLoadingMore) {
            loadMorePosts();
          }
        },
        { threshold: 0.1, rootMargin: "100px" }
      );

      observer.observe(loaderRef.current);
      return () => observer.disconnect();
    },
    [hasMorePosts, isLoading, isLoadingMore, loadMorePosts]
  );

  return (
    <div className="min-h-screen pt-5 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className=" px-4 md:px-10">
      <Image
        src="/Blogbanner.png"
        alt="Blog Banner"
        width={4500}
        height={4200}
        className="w-full rounded-xl"
        priority
      />
      </div>
      <h1 className="flex justify-center pt-10 text-xl md:text-5xl font-semibold">
        Blogs
      </h1>

      {/* <div className="mx-4 md:mx-10 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">ATD Money Blog</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">Insights, tips, and guidance to help you make smarter financial decisions</p>
        </div>
      </div> */}

      <div className="px-4 lg:px-10 py-16">
        {error &&
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">
              Failed to load blog posts: {error}
            </p>
            <button
              onClick={() => {
                initialFetchCompleted.current = false;
                setError(null);
                setIsLoading(true);
              }}
              className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>}

        {isLoading &&
          !error &&
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex space-x-3">
              <div className="w-4 h-4 bg-teal-600 rounded-full" />
              <div className="w-4 h-4 bg-teal-600 rounded-full animation-delay-200" />
              <div className="w-4 h-4 bg-teal-600 rounded-full animation-delay-400" />
            </div>
          </div>}

        {!isLoading &&
          !error &&
          displayedPosts.length === 0 &&
          <div className="text-center py-16">
            <p className="text-gray-500">No blog posts found.</p>
          </div>}

        {!isLoading &&
          !error &&
          displayedPosts.length > 0 &&
          <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayedPosts.map((post, index) =>
              <BlogPostCard
                key={`blog-post-${post.id || index}`}
                post={post}
                animationIndex={index % 4}
              />
            )}
          </div>}

        {!error &&
          hasMorePosts &&
          <div
            ref={loaderRef}
            className="flex justify-center items-center py-10 mt-8"
          >
            {isLoadingMore
              ? <div className="animate-pulse flex space-x-2">
                  <div className="w-3 h-3 bg-teal-600 rounded-full" />
                  <div className="w-3 h-3 bg-teal-600 rounded-full" />
                  <div className="w-3 h-3 bg-teal-600 rounded-full" />
                </div>
              : <button
                  onClick={loadMorePosts}
                  className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                >
                  Load More
                </button>}
          </div>}

        {!error &&
          !hasMorePosts &&
          displayedPosts.length > 0 &&
          <div className="text-center mt-12 text-gray-500">
            <p>You've reached the end of our blog posts</p>
          </div>}
      </div>
    </div>
  );
}
