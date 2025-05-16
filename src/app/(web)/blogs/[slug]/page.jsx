'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';

const blogPosts = [
  {
    title: 'How to Manage Your Finances with ATD',
    slug: 'manage-finances-atd',
    image: '/heroimage3.png',
    content: `
      <div>
        <p class="text-lg leading-relaxed mb-6">Managing your finances properly is essential for a healthy financial life. Start by tracking your income and expenses, then build a budget that aligns with your goals.</p>
        
        <h2 class="text-2xl font-bold text-teal-700 mt-8 mb-4">Track Your Spending</h2>
        <p class="text-lg leading-relaxed mb-6">The first step to better financial management is understanding where your money goes. ATD Money offers easy-to-use tools to help you monitor your loans, repayments, and track your financial journey with clarity.</p>
        
        <h2 class="text-2xl font-bold text-teal-700 mt-8 mb-4">Create a Realistic Budget</h2>
        <p class="text-lg leading-relaxed mb-6">Once you know your spending patterns, create a budget that works for your lifestyle. Allocate funds for essentials, savings, and discretionary spending.</p>
        
        <blockquote class="border-l-4 border-teal-500 pl-4 italic my-8 text-gray-700 py-2">
          "Financial freedom isn't about being rich. It's about having control over your money rather than letting money control you."
        </blockquote>
        
        <h2 class="text-2xl font-bold text-teal-700 mt-8 mb-4">Plan for the Future</h2>
        <p class="text-lg leading-relaxed mb-6">Set aside emergency funds and plan for long-term goals. With ATD Money's guidance, you can make informed decisions about loans and repayments that align with your financial objectives.</p>
      </div>
    `,
    date: '2025-05-10',
  },
  {
    title: 'Why Choose ATD Money for Your Loan Needs?',
    slug: 'why-atd-money',
    image: '/contactusbanner.jpg',
    content: `
      <div>
        <p class="text-lg leading-relaxed mb-6">ATD Money is trusted by thousands across India. With a seamless application process, fast approvals, and dedicated customer support, we help you get financial support when you need it most.</p>
        
        <h2 class="text-2xl font-bold text-teal-700 mt-8 mb-4">Fast and Easy Application</h2>
        <p class="text-lg leading-relaxed mb-6">Our digital-first approach means you can apply for loans from the comfort of your home. The entire process takes just minutes, not days.</p>
        
        <h2 class="text-2xl font-bold text-teal-700 mt-8 mb-4">Competitive Rates</h2>
        <p class="text-lg leading-relaxed mb-6">We offer some of the most competitive interest rates in the market, ensuring you get the best value for your money.</p>
        
        <h2 class="text-2xl font-bold text-teal-700 mt-8 mb-4">Exceptional Customer Support</h2>
        <p class="text-lg leading-relaxed mb-6">Our team is always ready to assist you with any questions or concerns. We believe in building relationships, not just processing transactions.</p>
        
        <div class="bg-teal-50 border-l-4 border-teal-500 p-6 rounded-lg my-8">
          <h3 class="font-bold text-teal-700 mb-2">Customer Satisfaction</h3>
          <p class="text-gray-700">9 out of 10 customers would recommend ATD Money to friends and family, making us one of the most trusted financial services providers.</p>
        </div>
      </div>
    `,
    date: '2025-05-05',
  },
  {
    title: 'Top 5 Mistakes to Avoid When Applying for a Loan',
    slug: 'loan-mistakes',
    image: '/images/loan-mistakes.jpg',
    content: `
      <div>
        <p class="text-lg leading-relaxed mb-6">When applying for a loan, avoiding common mistakes can significantly increase your chances of approval and help you secure better terms.</p>
        
        <h2 class="text-2xl font-bold text-teal-700 mt-8 mb-4">1. Not Checking Your Credit Score</h2>
        <p class="text-lg leading-relaxed mb-6">Your credit score is a crucial factor in loan approval. Review it before applying to address any issues that might hurt your chances.</p>
        
        <h2 class="text-2xl font-bold text-teal-700 mt-8 mb-4">2. Applying for Multiple Loans Simultaneously</h2>
        <p class="text-lg leading-relaxed mb-6">Each application can trigger a hard inquiry, potentially lowering your credit score. Space out applications if necessary.</p>
        
        <h2 class="text-2xl font-bold text-teal-700 mt-8 mb-4">3. Borrowing More Than You Need</h2>
        <p class="text-lg leading-relaxed mb-6">Larger loans mean higher payments. Borrow only what you need to avoid unnecessary financial strain.</p>
        
        <h2 class="text-2xl font-bold text-teal-700 mt-8 mb-4">4. Ignoring the Repayment Terms</h2>
        <p class="text-lg leading-relaxed mb-6">Understanding how and when you'll repay is essential. Make sure the terms align with your financial situation.</p>
        
        <h2 class="text-2xl font-bold text-teal-700 mt-8 mb-4">5. Not Reading the Fine Print</h2>
        <p class="text-lg leading-relaxed mb-6">Hidden fees and conditions can significantly impact the total cost of your loan. Always read all documentation carefully.</p>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg my-8">
          <h3 class="font-bold text-yellow-700 mb-2">Pro Tip</h3>
          <p class="text-gray-700">Before finalizing any loan, calculate the total cost including all fees and interest over the entire repayment period. This gives you a clearer picture of your commitment.</p>
        </div>
      </div>
    `,
    date: '2025-05-01',
  },
];

export default function BlogDetail({ params }) {
  // Properly unwrap params using React.use to fix the warning
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;
  
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return notFound();

  // Format date for display
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full Image Display */}
      <div className="w-full">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-100 object-cover" 
        />
      </div>
  
      {/* Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Date Section */}
        <div className="mb-10 text-center">
          <p className="text-teal-600 font-medium mb-2">{formattedDate}</p>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
            {post.title}
          </h1>
          <div className="w-24 h-1 bg-teal-500 mx-auto mt-6"></div>
        </div>
      
        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
          
        {/* Post Navigation */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <Link 
            href="/blogs" 
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}