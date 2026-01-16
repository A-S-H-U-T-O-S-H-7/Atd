'use client';

import { useState } from 'react';
import { 
  FaChevronDown, 
  FaFileAlt, 
  FaLink, 
  FaUserPlus, 
  FaBan, 
  FaUserCheck, 
  FaExclamationTriangle, 
  FaGift, 
  FaLock, 
  FaHeadset, 
  FaPhone 
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { FaAngleLeft } from 'react-icons/fa6';

export default function TermsOfUse() {
  const [activeSection, setActiveSection] = useState('useOfInformation');
  const router = useRouter();

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Data structure for accordion sections
  const sections = [
    {
      id: 'useOfInformation',
      title: 'Use of Information and Materials',
      icon: <FaFileAlt />,
      content: (
        <>
          <p>
            The Content (details, data, information, news items, material, etc.) enclosed on this Web Portal is made available for common information only and should not be utilized as a basis for making corporate/economic decisions. The User is recommended to exercise due concern and/or look for self-independent counsel prior to entering into any agreement or financial commitment based on the Content enclosed on this Website.
          </p>
          <p>
            The Content enclosed in ATD Money Quick Website, together with graphics, links, text, or other terms are offered on an "as is", "as available" foundation and are shielded by copyright in the favor of Web Site Operator. A visitor or user should not share out text or graphics to any other third part without the written permission or NOC of the Web Site Operator. A User is not supposed to duplicate, download, distribute, reproduce or publish any of the part or portion of the Content enclosed on this Website in any form without prior permission of the Web Site Operator. Use of the products or services portrayed in this Web Site may not be allowed in some overseas countries and if there is any uncertainty, a user should verify either with the local supervisor or the administration or with the Web Site Operator before demanding additional information on similar products/ services. Service or products are accessible only in the judgment of Operator, a matter of the particular juridical terms of using products and services on which they are presented and such products and services may be taken off or modified at any time without prior notification. The complete array of products or services may not be obtainable in every location.
          </p>
        </>
      )
    },
    {
      id: 'linksToOtherSites',
      title: 'Links to Other Sites',
      icon: <FaLink />,
      content: (
        <p>
          The ATD Money Quick Website may recommend links to sites that are out of the Operator's control. If a user visits any such linked sites they should evaluate the terms and conditions on every such web site. Particularly, the Operator does not take for granted any accountability for any compulsion of any persons who recommend, provide or intercede services or products on similar sites. The Operator is neither answerable for the guiding principle and practice of other agencies, nor for the material of associated third-party web sites.
        </p>
      )
    },
    {
      id: 'userAccount',
      title: 'Creation of User Account for availing Services',
      icon: <FaUserPlus />,
      content: (
        <>
          <p>
            To get the Loan(s) or to get benefited of other services from ATD Money Quick from time to time, the User has to build an account ("User Account") with us by enrolling himself/ herself. You are exclusively accountable for preserving the confidentiality of your user ID and password for that specific User Account and shall be accountable for all actions that take place in correlation with your User Account. For fear that of any illegal or unlawful use of your User Account of ATD Money Quick the same shall be guilty to us. You shall not generate numerous User Accounts and shall not use your User Account for any intention that is illegitimate, prohibited or banned by law. As a concern for getting Loan/ Service through Web Site, you may be needed to pay the due amount as charges, fee, cost or interest as may be pertinent as declared in our Web site.
          </p>
          
          <h4 className="font-semibold mt-6">For the intention of generating the User Account through the Website:</h4>
          <ul className="ml-6 space-y-3 list-disc">
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              The applicant shall be an Indian citizen inhabitant in India and minimum 19 years of age;
            </li>
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              The applicant shall not be an individual either expelled or or else legally forbidden from taking Loan or availing financial services and solutions offered by us;
            </li>
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              The applicant should have an official or legal identity proof/card and residential address proof as explained by Reserve Bank of India;
            </li>
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              The applicant shall not imitate any person or body or misleadingly state or otherwise fake age, individuality or association with any person or body.
            </li>
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              The applicant should have a legitimate email address and authentic mobile number where he/she wishes to receive One Time Password and other exchanges from ATD MONEY Quick.
            </li>
          </ul>
          
          <h4 className="font-semibold mt-6">Your desktop/ mobile device should have:</h4>
          <ul className="ml-6 space-y-3 list-disc">
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              Supported Resolutions: 1366 x 768+. Best viewed on 1366 x 768
            </li>
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              A properly running internet access having HTML supported Web Browsers including Firefox 49+ Chrome 55+, Edge 38+ or Mobile Browsers: Latest version of Chrome, Firefox, Safari Browser
            </li>
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              Latest version of Adobe Reader: https://get.adobe.com/reader/
            </li>
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              A web camera
            </li>
          </ul>
        </>
      )
    },
    {
      id: 'prohibitedConduct',
      title: 'Prohibited Conduct',
      icon: <FaBan />,
      content: (
        <>
          <p>By using our Web Site you are in agreement that you shall not:</p>
          
          <ul className="ml-6 space-y-3 list-disc">
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              Use our Website for spamming or any other unlawful intentions.
            </li>
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              Disobey ours or any third party's intellectual asset rights, rights of promotion or confidentiality;
            </li>
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              Post or broadcast any message which is defamatory, or which unveils confidential or private matters regarding any person.
            </li>
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              Post or convey any memo, information, picture or program which breaches any law.
            </li>
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              Decline to lend a hand in an inquiry or provide authentication of your individuality or any other details or data you provide to us.
            </li>
          </ul>
        </>
      )
    },
    {
      id: 'userObligations',
      title: 'Obligations of Users',
      icon: <FaUserCheck />,
      content: (
        <>
          <p>
            While operating the Website, the Users must not obstruct with the Website's safety, uprightness and operation in common, must not utilize the Website for the transmission of damaging files or endeavor to enter non-public segments of the Website or access restricted information shown on the Website where the Users do not match the standards for accessing this information. The User is additionally required to keep an eye on the operator's copyrights of this Website and, moreover, to study the third parties' rights to content published by the Operator on the Website (including, but not restricted to, trademarks, symbol etc.) but possessed by third parties and which is under the shelter of suitable laws on the safety of intellectual property rights. Additionally, while putting forward any information to the Website for the intention of acquiring any services, the Users shall make sure and verify that the same is proper and accurate.
          </p>
          <p>
            You are not authorized to use any of our business names, logo, trademarks, domain names, service marks, and other idiosyncratic brand features. You shall not create a replica and use the software, graphics, visual, audio, or text on this Site ("Content"). You are not permitted to eliminate, ambiguous, or change any ownership rights notices (counting brand and copyright notices), which may be attached to or enclosed within the services. You will not duplicate or convey any of the services. We neither symbolize nor justify that your use of materials shown on the Site will not infringe civil rights of third parties.
          </p>
        </>
      )
    },
    {
      id: 'breachOfTerms',
      title: 'Breach of the Terms',
      icon: <FaExclamationTriangle />,
      content: (
        <p>
          Without discrimination to our rights under this guiding principles, if you violate these terms & conditions and by any means, or if we believe that you have violated these terms & conditions of Website by any means, we may (i) launch you one or more official warnings; (ii) momentarily postpone your access to Website; (iii) everlastingly ban you from right of entry to Website; (iv) obstruct computers via your IP address from right to use Website; (v) contact any or all of your internet service providers and appeal that they obstruct your access to Website; (vi) initiate lawful action against you, whether for violating of agreement or revival of amounts due or compensation or otherwise; and/or (vii) suspend or remove your user account on Website.
        </p>
      )
    },
    {
      id: 'rewardPoints',
      title: 'Reward Points',
      icon: <FaGift />,
      content: (
        <>
          <p>
            Interest paid on loan taken time to time through ATD Money Quick shall qualify for reward points i.e equivalent to interest paid. Example if interest paid Rs 100/- then points will be add Rs 100/-.
          </p>
          
          <ul className="ml-6 space-y-3 list-disc">
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              Once you are registered in atd money quick same user id and password can be used for online shopping and availing reward points redemption from www.myshopbazzar.com.
            </li>
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              Redemption of reward points shall be as per the terms & policy of myshopbazzar.com.
            </li>
            <li className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-teal-500">
              ATD Money quick may change this policy any time without prior intimation to the user.
            </li>
          </ul>
        </>
      )
    },
    {
      id: 'securityPrecautions',
      title: 'Security Precautions',
      icon: <FaLock />,
      content: (
        <p>
          Our Platform has stringent security measures in place to protect the loss, misuse, and alteration of the information under our control. Whenever you change or access your account information, we offer the use of a secure server. Once your information is in our possession, we adhere to strict security guidelines, protecting it against unauthorized access.
        </p>
      )
    },
    {
      id: 'grievancePolicy',
      title: 'Grievance Policy',
      icon: <FaHeadset />,
      content: (
        <>
          <p>
            To report content that you believe is inappropriate, in violation of applicable laws or any term of this Policy, or infringing upon other rights (including privacy rights), you may get in touch with our Grievance Officer at grievances@atdfinance.in.
          </p>
          
          <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
            <h4 className="text-lg font-medium text-teal-800 mb-2">Grievance Officer</h4>
            <p className="text-teal-700">
              Mr. Deepak Kumar Jha<br />
              Grievance Officer,<br />
              A-86 B, 2nd Floor, School Block,<br />
              ChanderVihar, Delhi-110092<br />
              Mob:- +91- 9999589205
            </p>
          </div>
          
          <p className="mt-6">
            Please review the privacy policy periodically to make sure that you are aware of the latest changes.
          </p>
        </>
      )
    }
  ];

  return (
    <div className="bg-gradient-to-br from-teal-50 to-teal-100">
      <div className=" mx-auto py-4 md:py-6 px-6 lg:px-8">
        <header className="mb-12 text-center">
           <div className="flex justify-end my-4">
            {/* Back button - top right */}
            <button 
              onClick={() => router.back()} 
              className="flex items-center cursor-pointer gap-2 bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 font-medium"
            >
              <FaAngleLeft className="w-4 h-4" />
              Back
            </button>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center">
              <FaFileAlt className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-2">Terms of Use</h1>
          <p className=" text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these terms carefully before using the ATD Money website.
          </p>
        </header>

        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-10">
          <div className="p-6 sm:p-8 bg-teal-600 text-white">
            <h2 className="text-2xl font-bold">Introduction</h2>
            <p className="mt-2 text-teal-100">
              All persons visiting the website www.atdmoney.com should read and notify themselves with this manuscript before using the Website.
            </p>
          </div>
          
          <div className="px-6 py-5 sm:px-8 bg-white text-gray-700 prose prose-teal max-w-none">
            <p>
              All persons visiting the website www.atdmoney.com (the "Website") are suggested to read through and notify themselves with this manuscript before going on to use the Website. Accessing and using the Website by a visitor or user is considered to symbolize the User's permission to the terms and conditions of using the Website and any modification thereto (Such terms and conditions hereinafter referred as "Policy on Website Use"). In case a customer conflict with these terms of uses (as may be modified from time to time), he/she shall depart the Site and avoid visiting the website in the future.
            </p>
            <p>
              The website is possessed and functioned by ATD Financial Services Pvt. Ltd., having its registered headquarters at A-86 B, 2nd Floor, School Block, ChanderVihar, Delhi-110092, which is sanctioned to work out the ownership and intellectual possession rights to the Web Site.
            </p>
            <p>
              These guidelines on website use control the constitutional rights and responsibility of the operator and the users concerning the use of the Web Portal. Users are suggested to read these "Terms of Use" thoroughly and carefully. This is a lawfully obligatory contract between the User and ATD Financial Services Pvt. Ltd., setting up the terms of usage under which this Web Site may be used. In the situation of any disagreement between the terms and conditions of definite products and services and this repudiation, the conditions particular to such products and services shall overcome. Users are suggested to read carefully these terms before enrolling, discovering, downloading, accessing, or using no matter what from the Web Site.
            </p>
          </div>
        </div>

        {/* Accordion Sections */}
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl shadow-xl overflow-hidden mb-4 md:mb-8">
            <div className="accordion-item">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-5 sm:px-8 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="mr-3 text-teal-600">{section.icon}</span>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-900">{section.title}</h3>
                </div>
                <FaChevronDown 
                  className={`w-5 h-5 text-teal-600 transform transition-transform duration-200 ${activeSection === section.id ? 'rotate-180' : ''}`}
                />
              </button>
              
              {activeSection === section.id && (
                <div className="px-6 py-5 sm:px-8 bg-gray-50 text-gray-700 prose prose-teal max-w-none">
                  {section.content}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Contact Support */}
        <div className="bg-teal-600 rounded-xl shadow-xl overflow-hidden mb-10">
          <div className="p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-white p-2">
                <FaPhone className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold">Need Help?</h3>
            </div>
            <p className="mt-4">
              If you have any questions or need assistance regarding our terms of use, please don't hesitate to contact our customer support team.
            </p>
            <div className="mt-6 inline-flex rounded-md shadow">
              <a
                href="/contactus"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-teal-600 bg-white hover:bg-teal-50"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
        <div className="flex justify-end my-4">
            {/* Back button - top right */}
            <button 
              onClick={() => router.back()} 
              className="flex items-center cursor-pointer gap-2 bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 font-medium"
            >
              <FaAngleLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        
        <footer className="text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} ATD Money. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}