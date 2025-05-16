import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "How to Master Personal Finance",
      content: "Learn the essentials of budgeting, investing, and building wealth for long-term financial freedom.",
      date: "May 8, 2025",
      image: "/blog2.png",
      slug: "/blog/master-personal-finance"
    },
    {
      id: 2,
      title: "Investment Strategies for Beginners",
      content: "Discover simple yet effective ways to start your investment journey without taking unnecessary risks.",
      date: "May 5, 2025",
      image: "/Blog1.jpg",
      slug: "/blog/investment-strategies-beginners"
    },
    {
      id: 3,
      title: "Planning for Early Retirement",
      content: "Strategic approaches to achieve financial independence and retire earlier than you thought possible.",
      date: "April 29, 2025",
      image: "/Blog3.avif",
      slug: "/blog/planning-early-retirement"
    }
  ];

  return (
    <div className=" px-4 md:px-10 py-10 bg-[#faf2fa] ">
        <div className='pb-10'>
      <h2 className="text-2xl md:text-3xl font-semibold text-center "> Blogs </h2>
      <p className="text-gray-700 text-base md:text-lg text-center mt-2">Explore insights, tips, and stories curated just for you</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Featured Blog Post - Wider Left Column (3/5) */}
        <div className="lg:col-span-2">
          <Link href={blogPosts[0].slug} className="block h-full">
            <div className="border rounded-lg shadow-sm hover:shadow-lg transition duration-300 h-full cursor-pointer">
              <div className="relative h-60 md:h-66 p-2">
                <div className="relative h-full w-full">
                  <Image 
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-medium mb-2">{blogPosts[0].title}</h3>
                <p className=" text-sm md:text-base text-gray-600 mb-4">{blogPosts[0].content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-teal-600 hover:text-teal-800 font-medium">
                    Read More
                  </span>
                  <p className="text-gray-500 text-sm">{blogPosts[0].date}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Side Column Blog Posts - Narrower Right Column (2/5) */}
        <div className="lg:col-span-2 flex flex-col justify-between gap-6">
          {blogPosts.slice(1).map((post, index) => (
            <Link key={post.id} href={post.slug} className="block h-full">
              <div className="border flex items-center rounded-lg shadow-sm hover:shadow-lg transition duration-300 h-full cursor-pointer">
                <div className="flex flex-col items-center justify-center md:flex-row">
                  <div className="relative w-full md:w-2/5 h-50 p-2">
                    <div className="relative h-full w-full">
                      <Image 
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover rounded-lg"
                        priority
                      />
                    </div>
                  </div>
                  <div className="p-4 md:p-6 md:w-3/5 flex flex-col gap-2 justify-between">
                    <div>
                      <h3 className=" text-lg md:text-xl font-medium mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm md:text-base">{post.content}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-teal-600 hover:text-teal-800 font-medium">
                        Read More
                      </span>
                      <p className="text-gray-500 text-sm">{post.date}</p>
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